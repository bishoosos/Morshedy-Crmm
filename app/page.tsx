'use client';

import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

const PROJECTS_DATA = [
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

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // بيانات العميل المخصص للعرض
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // بيانات الحاسبة
  const [selectedProjectId, setSelectedProjectId] = useState('zahra');
  const selectedProject = PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];

  const [area, setArea] = useState(93);
  const [roofArea, setRoofArea] = useState(0);
  const [gardenArea, setGardenArea] = useState(0);
  const [terraceArea, setTerraceArea] = useState(0);
  const [pricePerMeter, setPricePerMeter] = useState(selectedProject.defaultPrice);

  const [roofRatio, setRoofRatio] = useState(20); 
  const [gardenRatio, setGardenRatio] = useState(33); 
  const [terraceRatio, setTerraceRatio] = useState(25); 

  const [years, setYears] = useState(7);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [downPaymentPercent, setDownPaymentPercent] = useState(5);
  const [receiptPaymentPercent, setReceiptPaymentPercent] = useState(10);
  const [receiptAfterMonths, setReceiptAfterMonths] = useState(10);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    const proj = PROJECTS_DATA.find((p) => p.id === projectId);
    if (proj) {
      setPricePerMeter(proj.defaultPrice);
    }
  };

  const handleDownloadImage = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      const filename = clientName ? `عرض_سعر_${clientName}_${selectedProject.name}.png` : `عرض_سعر_${selectedProject.name}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('خطأ أثناء استخراج الصورة:', err);
    }
  };

  // الحسابات
  const effectiveArea = 
    area + 
    (roofArea * (roofRatio / 100)) + 
    (gardenArea * (gardenRatio / 100)) + 
    (terraceArea * (terraceRatio / 100));

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
  const monthlyPool = remainingTotal * (selectedProject.monthlyRatio / 100);
  const yearlyPool = remainingTotal * (selectedProject.yearlyRatio / 100);

  const monthlyInstallmentVal = remainingTotal > 0 ? monthlyPool / (totalMonths || 1) : 0;
  const yearlyInstallmentVal = remainingTotal > 0 ? yearlyPool / (years || 1) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex dir-rtl" dir="rtl">
      
      {/* Sidebar - القائمة الجانبية للتنقل جوة الـ CRM */}
      <aside className="w-64 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
            <span className="text-2xl">🏢</span>
            <div>
              <h1 className="font-bold text-sm text-blue-400">Morshedy CRM</h1>
              <p className="text-[10px] text-slate-400">نظام المبيعات الداخلي</p>
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
              👥 إدارة العملاء (Leads)
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              🏘️ قائمة أسعار المشاريع
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 px-2 text-[11px] text-slate-500">
          فريق المبيعات المعتمد © 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* Header - الشريط العلوي */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {activeTab === 'calculator' && 'حاسبة عروض الأسعار السريعة'}
              {activeTab === 'leads' && 'قاعدة بيانات العملاء والتواصل'}
              {activeTab === 'inventory' && 'دليل مشاريع معمار المرشدي'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">لوحة تحكم مسؤول المبيعات</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-emerald-400 font-semibold">المحرك شغال</span>
          </div>
        </div>

        {/* TAB 1: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* بيانات العميل للحاسبة */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-1/2">
                <label className="block text-xs text-slate-400 mb-1">اسم العميل (ليظهر في عرض السعر):</label>
                <input 
                  type="text" 
                  placeholder="أدخل اسم العميل..." 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-xs text-slate-400 mb-1">رقم تليفون العميل:</label>
                <input 
                  type="text" 
                  placeholder="01xxxxxxxxx" 
                  value={clientPhone} 
                  onChange={(e) => setClientPhone(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* أدوات الحاسبة */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-400 font-bold">المشروع المحدد:</label>
                  <select 
                    value={selectedProjectId} 
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="bg-slate-800 border border-blue-500/50 text-blue-300 text-xs font-bold rounded-xl p-2.5 focus:outline-none"
                  >
                    {PROJECTS_DATA.map((proj) => (
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

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-700/40 text-xs">
                  <div>
                    <span className="text-slate-400">نسبة الروف: </span>
                    <input type="number" value={roofRatio} onChange={(e) => setRoofRatio(Number(e.target.value))} className="w-12 bg-slate-900 border border-slate-700 rounded p-1 text-center text-yellow-400 font-bold" /> %
                  </div>
                  <div>
                    <span className="text-slate-400">نسبة الحديقة: </span>
                    <input type="number" value={gardenRatio} onChange={(e) => setGardenRatio(Number(e.target.value))} className="w-12 bg-slate-900 border border-slate-700 rounded p-1 text-center text-yellow-400 font-bold" /> %
                  </div>
                  <div>
                    <span className="text-slate-400">نسبة التراس: </span>
                    <input type="number" value={terraceRatio} onChange={(e) => setTerraceRatio(Number(e.target.value))} className="w-12 bg-slate-900 border border-slate-700 rounded p-1 text-center text-yellow-400 font-bold" /> %
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
                    {clientName && (
                      <span className="text-xs text-blue-400 font-bold block mb-1">مقدم للعميل: {clientName}</span>
                    )}
                    <span className="text-xs text-slate-400 block">مشروع:</span>
                    <h3 className="text-xl font-bold text-blue-400">{selectedProject.name}</h3>
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

              {/* زرار تحميل الصورة - أصبح بالأسفل بعد الكارت */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDownloadImage}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition duration-200 flex items-center justify-center gap-2"
                >
                  📥 تحميل كارت العرض للعميل (صورة)
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: LEADS (إدارة العملاء) */}
        {activeTab === 'leads' && (
          <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-blue-400 mb-2">قسم إدارة سجلات العملاء (Leads Management)</h3>
            <p className="text-slate-400 text-xs mb-6">هنا هنبني الجدول الخاص بإضافة وتتبع العملاء ومراحل المكالمات</p>
            <div className="p-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              جاهز لبناء سكشن التسجيل وحفظ البيانات في التحديث القادم 🚀
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY (قائمة الأسعار) */}
        {activeTab === 'inventory' && (
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
            {PROJECTS_DATA.map((proj) => (
              <div key={proj.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-blue-400">{proj.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">سعر المتر الافتراضي: <span className="text-white font-bold">{proj.defaultPrice.toLocaleString()} ج.م</span></p>
                </div>
                <button 
                  onClick={() => {
                    handleProjectChange(proj.id);
                    setActiveTab('calculator');
                  }}
                  className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  حساب السعر ←
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  );
}