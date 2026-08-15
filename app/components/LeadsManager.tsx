'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
  id?: string;
  name: string;
  phone: string;
  project: string;
  area: number;
  total_price: number;
  down_payment: number;
  status?: string;
  created_at?: string;
}

export default function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // بيانات النموذج لإضافة عميل جديد
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [project, setProject] = useState('Zahra North Coast (زهرة)');
  const [area, setArea] = useState(90);
  const [totalPrice, setTotalPrice] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [status, setStatus] = useState('جديد');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب العملاء من Supabase
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error('خطأ في جلب البيانات:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // إضافة عميل جديد
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('برجاء كتابة اسم العميل ورقم الهاتف');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([
        {
          name,
          phone,
          project,
          area: Number(area),
          total_price: Number(totalPrice),
          down_payment: Number(downPayment),
          status,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      alert('✅ تم إضافة العميل بنجاح!');
      setName('');
      setPhone('');
      setTotalPrice(0);
      setDownPayment(0);
      fetchLeads(); // إعادة تحميل القائمة
    } catch (err: any) {
      alert('خطأ أثناء إضافة العميل: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // حذف عميل
  const handleDeleteLead = async (id?: string) => {
    if (!id || !confirm('هل أنت تأكد من حذف هذا العميل؟')) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setLeads(leads.filter((item) => item.id !== id));
    } catch (err: any) {
      alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* فورمة إضافة عميل جديد */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <span>👥</span> إضافة عميل جديد (Lead)
        </h3>
        <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">اسم العميل:</label>
            <input
              type="text"
              required
              placeholder="اسم العميل الكامل..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">رقم التليفون:</label>
            <input
              type="text"
              required
              placeholder="01xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">المشروع المهتم به:</label>
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">المساحة (م²):</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">إجمالي السعر (ج.م):</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">المقدم (ج.م):</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-500/20"
            >
              {isSubmitting ? 'جاري الحفظ...' : '➕ إضافة العميل لقاعدة البيانات'}
            </button>
          </div>
        </form>
      </div>

      {/* جدول عرض العملاء المسجلين */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>📋</span> قائمة العملاء المسجلين ({leads.length})
          </h3>
          <button
            onClick={fetchLeads}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            🔄 تحديث البيانات
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400 text-xs">جاري تحميل العملاء...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">لا يوجد عملاء مسجلين حالياً.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3">اسم العميل</th>
                  <th className="p-3">الهاتف</th>
                  <th className="p-3">المشروع</th>
                  <th className="p-3">المساحة</th>
                  <th className="p-3">الإجمالي</th>
                  <th className="p-3">المقدم</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{lead.name}</td>
                    <td className="p-3 dir-ltr text-right font-semibold text-blue-600">{lead.phone}</td>
                    <td className="p-3">{lead.project}</td>
                    <td className="p-3">{lead.area} م²</td>
                    <td className="p-3 font-bold">{lead.total_price ? lead.total_price.toLocaleString() : 0} ج.م</td>
                    <td className="p-3 text-emerald-600 font-bold">{lead.down_payment ? lead.down_payment.toLocaleString() : 0} ج.م</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}