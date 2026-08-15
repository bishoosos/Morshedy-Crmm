'use client';

import React, { useState } from 'react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  project: string;
  status: 'جديد' | 'متابعة' | 'تم التعاقد' | 'ملغي';
  notes: string;
  date: string;
}

export default function LeadsSection() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'أحمد محمود',
      phone: '01012345678',
      project: 'Zahra North Coast (زهرة)',
      status: 'جديد',
      notes: 'مهتم بشقة 93م، محتاج يزور المعرض',
      date: '2026-08-15',
    },
  ]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [project, setProject] = useState('Zahra North Coast (زهرة)');
  const [notes, setNotes] = useState('');

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newLead: Lead = {
      id: Date.now().toString(),
      name,
      phone,
      project,
      status: 'جديد',
      notes,
      date: new Date().toISOString().split('T')[0],
    };

    setLeads([newLead, ...leads]);
    setName('');
    setPhone('');
    setNotes('');
  };

  const handleStatusChange = (id: string, status: Lead['status']) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* نموذج إضافة عميل */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">➕ إضافة عميل جديد (Lead)</h3>
        <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1">اسم العميل:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم العميل..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">رقم الهاتف:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">المشروع المهتم به:</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="Zahra North Coast (زهرة)">Zahra (زهرة)</option>
              <option value="One Katameya (وان قطامية)">One Katameya (وان قطامية)</option>
              <option value="Degla Landmarks (دجلة لاند مارك)">Degla Landmarks</option>
              <option value="Sky Line (سكاي لاين)">Sky Line (سكاي لاين)</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-slate-600 mb-1">ملاحظات / Follow-up:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تفاصيل المكالمة..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-blue-600/20"
            >
              حفظ العميل
            </button>
          </div>
        </form>
      </div>

      {/* جدول عرض العملاء */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
        <h3 className="text-sm font-bold text-slate-800 mb-4">👥 قائمة العملاء والمتابعات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="p-3">الاسم</th>
                <th className="p-3">الهاتف</th>
                <th className="p-3">المشروع</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">الملاحظات</th>
                <th className="p-3">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">{lead.name}</td>
                  <td className="p-3 font-semibold text-blue-600 dir-ltr">{lead.phone}</td>
                  <td className="p-3 font-medium text-slate-600">{lead.project}</td>
                  <td className="p-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`p-1.5 rounded-lg text-[11px] font-bold border ${
                        lead.status === 'جديد'
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : lead.status === 'متابعة'
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : lead.status === 'تم التعاقد'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                    >
                      <option value="جديد">جديد</option>
                      <option value="متابعة">متابعة</option>
                      <option value="تم التعاقد">تم التعاقد</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </td>
                  <td className="p-3 text-slate-500">{lead.notes || '—'}</td>
                  <td className="p-3 text-slate-400 text-[10px]">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}