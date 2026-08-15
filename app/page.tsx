'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { supabase } from '@/lib/supabase';

const DEFAULT_PROJECTS = [
  { id: 'zahra', name: 'Zahra North Coast (زهرة)', defaultPrice: 111000, monthlyRatio: 25, yearlyRatio: 75 },
  { id: 'one_katameya', name: 'One Katameya (وان قطامية)', defaultPrice: 72700, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'degla_landmarks', name: 'Degla Landmarks (دجلة لاند مارك)', defaultPrice: 52800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'katameya_gate', name: 'Katameya Gate (قطامية جيت)', defaultPrice: 57800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'sky_line', name: 'Sky Line (سكاي لاين)', defaultPrice: 57800, monthlyRatio: 20, yearlyRatio: 80 },
  { id: 'degla_towers', name: 'Degla Towers (دجلة تاورز)', defaultPrice: 58000, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'grand_gate', name: 'Grand Gate (جراند جيت)', defaultPrice: 67400, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'bavaria_town', name: 'Bavaria Town (بافاريا تاون)', defaultPrice: 50500, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'rayhana_plaza', name: 'Rayhana Plaza (ريحانة بلازا)', defaultPrice: 70800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'rayhana_avenue', name: 'Rayhana Avenue (ريحانة أفينيو)', defaultPrice: 76000, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'rayhana_residence', name: 'Rayhana Residence (ريحانة ريزيدنس)', defaultPrice: 73700, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'degla_view', name: 'Degla View (دجلة فيو)', defaultPrice: 48600, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'crystal_plaza', name: 'Crystal Plaza (كريستال بلازا)', defaultPrice: 56800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'grand_city', name: 'Grand City (جراند سيتي)', defaultPrice: 51100, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'lake_front', name: 'Lake Front (ليك فرونت)', defaultPrice: 48400, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'degla_palms', name: 'Degla Palms / Gardens (دجلة بالمز / جاردنز)', defaultPrice: 14100, monthlyRatio: 20, yearlyRatio: 80 },
  { id: 'west_courts', name: 'West Courts (وست كورتس)', defaultPrice: 44000, monthlyRatio: 30, yearlyRatio: 70 },
];

interface Lead {
  id: number;
  client_name: string;
  phone: string;
  project_id: string;
  status: string;
  notes: string;
  created_at?: string;
}

interface Project {
  id: string;
  name: string;
  location: string;
  master_plan_url: string;
}

interface Unit {
  id: string;
  project_id: string;
  unit_type: string;
  title: string;
  area: number;
  price: number;
  image_url: string;
  description: string;
}

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'calculator' | 'leads' | 'projects'>('calculator');

  // --- 1. حالة العملاء (Leads) ---
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadProject, setNewLeadProject] = useState('zahra');
  const [newLeadStatus, setNewLeadStatus] = useState('جديد');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // --- 2. حالة المشاريع والوحدات (Projects & Units) ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedProjectMedia, setSelectedProjectMedia] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [masterPlanFile, setMasterPlanFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [unitType, setUnitType] = useState('شقة');
  const [unitTitle, setUnitTitle] = useState('');
  const [unitArea, setUnitArea] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [unitImageFile, setUnitImageFile] = useState<File | null>(null);

  // --- 3. حالة الحاسبة (Calculator) ---
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('zahra');
  const selectedProjectCalc = DEFAULT_PROJECTS.find((p) => p.id === selectedProjectId) || DEFAULT_PROJECTS[0];

  const [area, setArea] = useState(93);
  const [roofArea, setRoofArea] = useState(0);
  const [gardenArea, setGardenArea] = useState(0);
  const [terraceArea, setTerraceArea] = useState(0);
  const [pricePerMeter, setPricePerMeter] = useState(selectedProjectCalc.defaultPrice);

  const [roofRatio, setRoofRatio] = useState(20); 
  const [gardenRatio, setGardenRatio] = useState(33); 
  const [terraceRatio, setTerraceRatio] = useState(25); 

  const [years, setYears] = useState(7);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [downPaymentPercent, setDownPaymentPercent] = useState(5);
  const [receiptPaymentPercent, setReceiptPaymentPercent] = useState(10);
  const [receiptAfterMonths, setReceiptAfterMonths] = useState(10);

  // جلب البيانات
  useEffect(() => {
    fetchLeads();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectMedia) {
      fetchUnits(selectedProjectMedia.id);
    }
  }, [selectedProjectMedia]);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    const { data } = await supabase.from('leads').select('*').order('id', { ascending: false });
    setLeads(data || []);
    setLoadingLeads(false);
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setProjects(data);
      if (!selectedProjectMedia) setSelectedProjectMedia(data[0]);
    }
  };

  const fetchUnits = async (projectId: string) => {
    const { data } = await supabase.from('units').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
    setUnits(data || []);
  };

  // وظائف العملاء
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return alert('أدخل اسم العميل');
    const { error } = await supabase.from('leads').insert([
      { client_name: newLeadName, phone: newLeadPhone, project_id: newLeadProject, status: newLeadStatus, notes: newLeadNotes }
    ]);
    if (error) alert('خطأ في الحفظ!');
    else {
      setNewLeadName(''); setNewLeadPhone(''); setNewLeadNotes('');
      fetchLeads();
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (confirm('تأكيد الحذف؟')) {
      await supabase.from('leads').delete().eq('id', id);
      fetchLeads();
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    fetchLeads();
  };

  // وظائف رفع الصور والمشاريع
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from('crm-media').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('crm-media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return alert('أدخل اسم المشروع');
    setUploading(true);
    try {
      let masterPlanUrl = '';
      if (masterPlanFile) masterPlanUrl = await uploadImage(masterPlanFile);
      const { data, error } = await supabase.from('projects').insert([
        { name: projectName, location: projectLocation, master_plan_url: masterPlanUrl }
      ]).select();
      if (error) throw error;
      setProjectName(''); setProjectLocation(''); setMasterPlanFile(null);
      fetchProjects();
      if (data) setSelectedProjectMedia(data[0]);
      alert('تم إضافة المشروع!');
    } catch (err: any) { alert(err.message); } 
    finally { setUploading(false); }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectMedia) return alert('اختر مشروعاً أولاً');
    if (!unitTitle) return alert('أدخل نموذج الوحدة');
    setUploading(true);
    try {
      let imageUrl = '';
      if (unitImageFile) imageUrl = await uploadImage(unitImageFile);
      const { error } = await supabase.from('units').insert([
        {
          project_id: selectedProjectMedia.id,
          unit_type: unitType,
          title: unitTitle,
          area: Number(unitArea),
          price: Number(unitPrice),
          image_url: imageUrl,
        }
      ]);
      if (error) throw error;
      setUnitTitle(''); setUnitArea(''); setUnitPrice(''); setUnitImageFile(null);
      fetchUnits(selectedProjectMedia.id);
      alert('تم إضافة النموذج!');
    } catch (err: any) { alert(err.message); }
    finally { setUploading(false); }
  };

  // وظائف الحاسبة
  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    const proj = DEFAULT_PROJECTS.find((p) => p.id === projectId);
    if (proj) setPricePerMeter(proj.defaultPrice);
  };

  const handleDownloadImage = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `عرض_سعر_${selectedProjectCalc.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error(err); }
  };

  // حسابات الأسعار
  const effectiveArea = area + (roofArea * (roofRatio / 100)) + (gardenArea * (gardenRatio / 100)) + (terraceArea * (terraceRatio / 100));
  const totalPriceBeforeDiscount = effectiveArea * pricePerMeter;
  const discountAmount = totalPriceBeforeDiscount * (discountPercent / 100);
  const totalPriceAfterDiscount = totalPriceBeforeDiscount - discountAmount;
  const downPaymentAmount = totalPriceBeforeDiscount * (downPaymentPercent / 100);
  const receiptPaymentAmount = totalPriceBeforeDiscount * (receiptPaymentPercent / 100);
  const maintenanceAmount = totalPriceAfterDiscount * 0.10;
  const remainingTotal = totalPriceAfterDiscount - downPaymentAmount - receiptPaymentAmount;

  const totalQuarters = years * 4;
  const quartersBeforeReceipt = Math.floor(receiptAfterMonths / 3);
  const quarterlyInstallmentVal = remainingTotal > 0 ? remainingTotal / (totalQuarters || 1) : 0;
  const totalMonths = years * 12;
  const monthlyPool = remainingTotal * (selectedProjectCalc.monthlyRatio / 100);
  const yearlyPool = remainingTotal * (selectedProjectCalc.yearlyRatio / 100);
  const monthlyInstallmentVal = remainingTotal > 0 ? monthlyPool / (totalMonths || 1) : 0;
  const yearlyInstallmentVal = remainingTotal > 0 ? yearlyPool / (years || 1) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex dir-rtl" dir="rtl">
      
      {/* Sidebar القائمة الجانبية للتنقل */}
      <aside className="w-64 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
            <span className="text-2xl">🏢</span>
            <div>
              <h1 className="font-bold text-sm text-blue-400">Morshedy CRM</h1>
              <p className="text-[10px] text-slate-400">المنصة الشاملة</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === 'calculator' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              📊 حاسبة العروض والخصومات
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === 'leads' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              👥 إدارة العملاء ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              🗺️ الماستر بلان ونماذج الشقق
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {activeTab === 'calculator' && 'حاسبة عروض الأسعار السريعة'}
              {activeTab === 'leads' && 'قاعدة بيانات العملاء والتواصل'}
              {activeTab === 'projects' && 'إدارة الماستر بلان ونماذج الوحدات'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-emerald-400 font-semibold">متصل بالقاعدة</span>
          </div>
        </div>

        {/* TAB 1: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-1/2">
                <label className="block text-xs text-slate-400 mb-1">اسم العميل:</label>
                <input type="text" placeholder="أدخل اسم العميل..." value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-xs text-slate-400 mb-1">رقم تليفون العميل:</label>
                <input type="text" placeholder="01xxxxxxxxx" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-400 font-bold">المشروع المحدد:</label>
                  <select value={selectedProjectId} onChange={(e) => handleProjectChange(e.target.value)} className="bg-slate-800 border border-blue-500/50 text-blue-300 text-xs font-bold rounded-xl p-2.5">
                    {DEFAULT_PROJECTS.map((proj) => (
                      <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* مدخلات المساحات */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 mb-6">
                <h3 className="text-xs font-bold text-slate-300 mb-3">📐 تفاصيل المساحات (م²) ونسب الملحقات</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">الشقة:</label>
                    <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">الروف:</label>
                    <input type="number" value={roofArea} onChange={(e) => setRoofArea(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">الحديقة:</label>
                    <input type="number" value={gardenArea} onChange={(e) => setGardenArea(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">التراس:</label>
                    <input type="number" value={terraceArea} onChange={(e) => setTerraceArea(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-300 mb-1">سعر المتر (جنية):</label>
                    <input type="number" value={pricePerMeter} onChange={(e) => setPricePerMeter(Number(e.target.value))} className="w-full bg-slate-900 border border-blue-500/50 rounded p-2 text-blue-300 font-bold text-xs" />
                  </div>
                </div>
              </div>

              {/* مدخلات الشروط */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 mb-6">
                <h3 className="text-xs font-bold text-slate-300 mb-3">⚙️ شروط الدفع والخصومات</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">السنوات:</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">التعاقد (%):</label>
                    <input type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">الاستلام (%):</label>
                    <input type="number" value={receiptPaymentPercent} onChange={(e) => setReceiptPaymentPercent(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-purple-300 mb-1">الاستلام بعد (شهر):</label>
                    <input type="number" value={receiptAfterMonths} onChange={(e) => setReceiptAfterMonths(Number(e.target.value))} className="w-full bg-slate-900 border border-purple-500/50 rounded p-2 text-purple-300 font-bold" />
                  </div>
                  <div>
                    <label className="block text-green-400 mb-1">نسبة الخصم (%):</label>
                    <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="w-full bg-slate-900 border border-green-500/50 rounded p-2 text-green-400 font-bold" />
                  </div>
                </div>
              </div>

              {/* الكارت المصدر كصورة */}
              <div ref={cardRef} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    {clientName && <span className="text-xs text-blue-400 font-bold block mb-1">مقدم للعميل: {clientName}</span>}
                    <h3 className="text-xl font-bold text-blue-400">{selectedProjectCalc.name}</h3>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block">المساحة الإجمالية:</span>
                    <span className="text-md font-bold text-slate-200">{effectiveArea.toFixed(1)} م²</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 grid grid-cols-2 md:grid-cols-6 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">الإجمالي قبل الخصم</span>
                    <span className="text-xs font-bold text-slate-400 line-through">{Math.round(totalPriceBeforeDiscount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block">مبلغ الخصم ({discountPercent}%)</span>
                    <span className="text-xs font-bold text-emerald-400">-{Math.round(discountAmount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-green-400 block">الإجمالي بعد الخصم</span>
                    <span className="text-sm font-extrabold text-green-400">{Math.round(totalPriceAfterDiscount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 block">مقدم التعاقد ({downPaymentPercent}%)</span>
                    <span className="text-xs font-bold text-blue-400">{Math.round(downPaymentAmount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block">دفعة الاستلام ({receiptPaymentPercent}%)</span>
                    <span className="text-xs font-bold text-purple-400">{Math.round(receiptPaymentAmount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-yellow-400 block">المتبقي للتقسيط</span>
                    <span className="text-xs font-bold text-yellow-400">{Math.round(remainingTotal).toLocaleString()} ج.م</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-blue-400 text-xs">النظام الأول: أقساط ربع سنوية متساوية</span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded">كل 3 شهور</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center mt-3 bg-slate-950/60 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">إجمالي الأقساط</span>
                        <span className="font-bold text-xs text-white">{totalQuarters} قسط</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">قيمة القسط الربع سنوي</span>
                        <span className="font-bold text-xs text-blue-400">{Math.round(quarterlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">أقساط قبل الاستلام</span>
                        <span className="font-bold text-xs text-yellow-400">{quartersBeforeReceipt} أقساط</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-purple-400 text-xs">النظام الثاني: أقساط شهرية + دفعات سنوية</span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">مزدوج</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center mt-3 bg-slate-950/60 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">القسط الشهري ({totalMonths} قسط)</span>
                        <span className="font-bold text-xs text-purple-300">{Math.round(monthlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">القسط السنوي ({years} أقساط)</span>
                        <span className="font-bold text-xs text-purple-400">{Math.round(yearlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">دفعة الاستلام (بعد {receiptAfterMonths} شهر)</span>
                        <span className="font-bold text-xs text-slate-200">{Math.round(receiptPaymentAmount).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">وديعة الصيانة (10% بعد الخصم)</span>
                        <span className="font-bold text-xs text-yellow-400">{Math.round(maintenanceAmount).toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleDownloadImage} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg">
                  📥 تحميل كارت العرض للعميل (صورة)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS (إدارة العملاء) */}
        {activeTab === 'leads' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <form onSubmit={handleAddLead} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-blue-400 mb-4">➕ إضافة عميل جديد للقاعدة</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input type="text" required placeholder="اسم العميل *" value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                <input type="text" placeholder="رقم الهاتف" value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                <select value={newLeadProject} onChange={(e) => setNewLeadProject(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                  {DEFAULT_PROJECTS.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
                <select value={newLeadStatus} onChange={(e) => setNewLeadStatus(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                  <option value="جديد">جديد</option>
                  <option value="تم التواصل">تم التواصل</option>
                  <option value="ميتينج">ميتينج</option>
                  <option value="جاد">جاد جداً</option>
                  <option value="تم البيع">تم البيع 🎉</option>
                  <option value="غير مهتم">غير مهتم</option>
                </select>
              </div>
              <input type="text" placeholder="ملاحظات المكالمة..." value={newLeadNotes} onChange={(e) => setNewLeadNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white mb-4" />
              <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl">💾 حفظ العميل في القاعدة</button>
            </form>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-200 mb-4">سجل العملاء المسجلين ({leads.length})</h3>
              {loadingLeads ? (
                <div className="text-center py-8 text-xs text-slate-500">جاري تحميل العملاء...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">الاسم</th>
                        <th className="pb-3">التليفون والتواصل</th>
                        <th className="pb-3">المشروع</th>
                        <th className="pb-3">الحالة</th>
                        <th className="pb-3">الملاحظات</th>
                        <th className="pb-3 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-800/30">
                          <td className="py-3 font-bold text-white">{lead.client_name}</td>
                          <td className="py-3">
                            <span className="text-slate-300 block mb-1">{lead.phone || '-'}</span>
                            {lead.phone && (
                              <div className="flex gap-2">
                                <a href={`tel:${lead.phone}`} className="text-[10px] text-blue-400">📞 اتصال</a>
                                <a href={`https://wa.me/2${lead.phone}`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-400">💬 واتساب</a>
                              </div>
                            )}
                          </td>
                          <td className="py-3 text-slate-300">{lead.project_id}</td>
                          <td className="py-3">
                            <select value={lead.status} onChange={(e) => handleUpdateStatus(lead.id, e.target.value)} className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-yellow-400 font-bold">
                              <option value="جديد">جديد</option>
                              <option value="تم التواصل">تم التواصل</option>
                              <option value="ميتينج">ميتينج</option>
                              <option value="جاد">جاد جداً</option>
                              <option value="تم البيع">تم البيع 🎉</option>
                              <option value="غير مهتم">غير مهتم</option>
                            </select>
                          </td>
                          <td className="py-3 text-slate-400">{lead.notes || '-'}</td>
                          <td className="py-3 text-center">
                            <button onClick={() => handleDeleteLead(lead.id)} className="text-red-400 text-[11px] bg-red-500/10 px-2 py-1 rounded">حذف</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS & MEDIA (الماستر بلان ونماذج الشقق) */}
        {activeTab === 'projects' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <form onSubmit={handleAddProject} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-blue-400">➕ إضافة مشروع جديد</h3>
                <input type="text" placeholder="اسم المشروع (مثال: زهرة)" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                <input type="text" placeholder="الموقع" value={projectLocation} onChange={(e) => setProjectLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">صورة الماستر بلان (Master Plan):</label>
                  <input type="file" accept="image/*" onChange={(e) => setMasterPlanFile(e.target.files?.[0] || null)} className="w-full text-xs text-slate-400" />
                </div>
                <button disabled={uploading} className="w-full bg-blue-600 py-2 rounded text-xs font-bold">{uploading ? 'جاري الرفع...' : 'حفظ المشروع'}</button>
              </form>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-slate-300 mb-2">اختر مشروع لاستعراضه:</h3>
                {projects.map((p) => (
                  <button key={p.id} onClick={() => setSelectedProjectMedia(p)} className={`w-full text-right p-3 rounded-lg text-xs font-bold transition flex justify-between items-center ${selectedProjectMedia?.id === p.id ? 'bg-blue-600/20 border border-blue-500 text-blue-300' : 'bg-slate-950 hover:bg-slate-800'}`}>
                    <span>{p.name}</span>
                    <span className="text-[10px] text-slate-500">{p.location}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedProjectMedia && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-blue-400 mb-2">🗺️ الماستر بلان - {selectedProjectMedia.name}</h3>
                  {selectedProjectMedia.master_plan_url ? (
                    <img src={selectedProjectMedia.master_plan_url} alt="Master Plan" className="w-full h-64 object-cover rounded-lg border border-slate-800" />
                  ) : (
                    <div className="h-40 bg-slate-950 rounded-lg flex items-center justify-center text-xs text-slate-600">لا توجد صورة ماستر بلان مضافة</div>
                  )}
                </div>

                <form onSubmit={handleAddUnit} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400">🏠 إضافة نموذج شقة/شاليه للمشروع</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select value={unitType} onChange={(e) => setUnitType(e.target.value)} className="bg-slate-950 border border-slate-800 rounded p-2 text-xs">
                      <option value="شقة">شقة</option>
                      <option value="شاليه">شاليه</option>
                      <option value="دوبلكس">دوبلكس</option>
                      <option value="بنتهاوس">بنتهاوس</option>
                    </select>
                    <input type="text" placeholder="عنوان النموذج" value={unitTitle} onChange={(e) => setUnitTitle(e.target.value)} className="bg-slate-950 border border-slate-800 rounded p-2 text-xs" />
                    <input type="number" placeholder="المساحة (م²)" value={unitArea} onChange={(e) => setUnitArea(e.target.value)} className="bg-slate-950 border border-slate-800 rounded p-2 text-xs" />
                    <input type="number" placeholder="السعر (جنية)" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="bg-slate-950 border border-slate-800 rounded p-2 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">صورة النموذج الداخلي:</label>
                    <input type="file" accept="image/*" onChange={(e) => setUnitImageFile(e.target.files?.[0] || null)} className="w-full text-xs text-slate-400" />
                  </div>
                  <button disabled={uploading} className="w-full bg-emerald-600 py-2 rounded text-xs font-bold">{uploading ? 'جاري الرفع...' : 'حفظ النموذج'}</button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {units.map((u) => (
                    <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3 space-y-2">
                      {u.image_url && <img src={u.image_url} alt={u.title} className="w-full h-40 object-cover rounded-lg" />}
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-blue-300">{u.title} ({u.unit_type})</span>
                        <span className="text-xs text-emerald-400 font-bold">{u.price?.toLocaleString()} ج.م</span>
                      </div>
                      <p className="text-[11px] text-slate-400">المساحة: {u.area} م²</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}