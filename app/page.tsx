'use client';

import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

interface Project {
  id: string;
  name: string;
  defaultPrice: number;
  monthlyRatio: number;
  yearlyRatio: number;
}

const PROJECTS_DATA: Project[] = [
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
  const [activeTab, setActiveTab] = useState<'calculator' | 'leads' | 'inventory'>('calculator');
  const cardRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const [selectedProjectId, setSelectedProjectId] = useState<string>('zahra');
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
  
  // الخيار الجديد: تحديد وحدة الاستلام وقيمتها
  const [receiptUnit, setReceiptUnit] = useState<'months' | 'years'>('months');
  const [receiptValue, setReceiptValue] = useState(10);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    const proj = PROJECTS_DATA.find((p) => p.id === projectId);
    if (proj) setPricePerMeter(proj.defaultPrice);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
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

  // تحويل فترة الاستلام لشهر تلقائياً في جميع الحسابات
  const receiptAfterMonths = receiptUnit === 'years' ? receiptValue * 12 : receiptValue;

  const effectiveArea = area + (roofArea * (roofRatio / 100)) + (gardenArea * (gardenRatio / 100)) + (terraceArea * (terraceRatio / 100));
  const totalPriceBeforeDiscount = effectiveArea * pricePerMeter;
  const discountAmount = totalPriceBeforeDiscount * (discountPercent / 100);
  const totalPriceAfterDiscount = totalPriceBeforeDiscount - discountAmount;

  const downPaymentAmount = totalPriceBeforeDiscount * (downPaymentPercent / 100);
  const receiptPaymentAmount = totalPriceBeforeDiscount * (receiptPaymentPercent / 100);

  const remainingTotal = totalPriceBeforeDiscount - downPaymentAmount - receiptPaymentAmount - discountAmount;
  const maintenanceAmount = totalPriceAfterDiscount * 0.10;

  const totalQuarters = years * 4;
  const quartersBeforeReceipt = Math.floor(receiptAfterMonths / 3);
  const quarterlyInstallmentVal = remainingTotal > 0 ? remainingTotal / (totalQuarters || 1) : 0;

  const totalMonths = years * 12;
  const monthlyPool = remainingTotal * (selectedProject.monthlyRatio / 100);
  const yearlyPool = remainingTotal * (selectedProject.yearlyRatio / 100);

  const monthlyInstallmentVal = remainingTotal > 0 ? monthlyPool / (totalMonths || 1) : 0;
  const yearlyInstallmentVal = remainingTotal > 0 ? yearlyPool / (years || 1) : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex dir-rtl" dir="rtl">
      
      {/* Sidebar - القائمة الجانبية */}
      <aside className="w-64 bg-white border-l border-slate-200 p-4 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-100 mb-6">
            <span className="text-2xl">🏢</span>
            <div>
              <h1 className="font-bold text-sm text-blue-600">Morshedy CRM</h1>
              <p className="text-[10px] text-slate-500">نظام المبيعات الداخلي</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === 'calculator' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              📊 حاسبة العروض والخصومات
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === 'leads' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              👥 إدارة العملاء (Leads)
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              🏘️ قائمة أسعار المشاريع
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-100 pt-4 px-2 text-[11px] text-slate-400">
          فريق المبيعات المعتمد © 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'calculator' && 'حاسبة عروض الأسعار السريعة'}
              {activeTab === 'leads' && 'قاعدة بيانات العملاء والتواصل'}
              {activeTab === 'inventory' && 'دليل مشاريع معمار المرشدي'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">لوحة تحكم مسؤول المبيعات</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-emerald-600 font-semibold">المحرك شغال</span>
          </div>
        </div>

        {/* CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
              <div className="w-full md:w-1/2">
                <label className="block text-xs text-slate-600 font-medium mb-1">اسم العميل:</label>
                <input 
                  type="text" 
                  placeholder="أدخل اسم العميل..." 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-xs text-slate-600 font-medium mb-1">رقم تليفون العميل:</label>
                <input 
                  type="text" 
                  placeholder="01xxxxxxxxx" 
                  value={clientPhone} 
                  onChange={(e) => setClientPhone(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-700 font-bold">المشروع المحدد:</label>
                  <select 
                    value={selectedProjectId} 
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="bg-slate-50 border border-blue-500/30 text-blue-700 text-xs font-bold rounded-xl p-2.5 focus:outline-none shadow-sm"
                  >
                    {PROJECTS_DATA.map((proj) => (
                      <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <h3 className="text-xs font-bold text-slate-700 mb-3">📐 تفاصيل المساحات (م²) ونسب الملحقات</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">الشقة:</label>
                    <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-bold text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">الروف:</label>
                    <input type="number" value={roofArea} onChange={(e) => setRoofArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 text-xs font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">الحديقة:</label>
                    <input type="number" value={gardenArea} onChange={(e) => setGardenArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 text-xs font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">التراس:</label>
                    <input type="number" value={terraceArea} onChange={(e) => setTerraceArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 text-xs font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-600 mb-1 font-bold">سعر المتر (جنية):</label>
                    <input type="number" value={pricePerMeter} onChange={(e) => setPricePerMeter(Number(e.target.value))} className="w-full bg-white border border-blue-300 rounded p-2 text-blue-700 font-bold text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-600">نسبة الروف: </span>
                    <input type="number" value={roofRatio} onChange={(e) => setRoofRatio(Number(e.target.value))} className="w-12 bg-white border border-slate-200 rounded p-1 text-center text-amber-600 font-bold" /> %
                  </div>
                  <div>
                    <span className="text-slate-600">نسبة الحديقة: </span>
                    <input type="number" value={gardenRatio} onChange={(e) => setGardenRatio(Number(e.target.value))} className="w-12 bg-white border border-slate-200 rounded p-1 text-center text-amber-600 font-bold" /> %
                  </div>
                  <div>
                    <span className="text-slate-600">نسبة التراس: </span>
                    <input type="number" value={terraceRatio} onChange={(e) => setTerraceRatio(Number(e.target.value))} className="w-12 bg-white border border-slate-200 rounded p-1 text-center text-amber-600 font-bold" /> %
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <h3 className="text-xs font-bold text-slate-700 mb-3">⚙️ شروط الدفع والخصومات</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">السنوات:</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">التعاقد (%):</label>
                    <input type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-semibold" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">الاستلام (%):</label>
                    <input type="number" value={receiptPaymentPercent} onChange={(e) => setReceiptPaymentPercent(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-semibold" />
                  </div>

                  {/* خانة مدة الاستلام المحدثة بتبديل شهر/سنة */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-purple-700 font-bold text-[11px]">الاستلام بعد:</label>
                      <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10px]">
                        <button
                          type="button"
                          onClick={() => setReceiptUnit('months')}
                          className={`px-1.5 py-0.5 rounded font-bold transition ${
                            receiptUnit === 'months' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          شهر
                        </button>
                        <button
                          type="button"
                          onClick={() => setReceiptUnit('years')}
                          className={`px-1.5 py-0.5 rounded font-bold transition ${
                            receiptUnit === 'years' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          سنة
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={receiptValue} 
                        onChange={(e) => setReceiptValue(Number(e.target.value))} 
                        className="w-full bg-white border border-purple-200 rounded p-2 text-purple-700 font-bold text-xs focus:outline-none focus:border-purple-500" 
                      />
                      <span className="absolute left-2 top-2 text-[10px] text-purple-400 font-semibold pointer-events-none">
                        {receiptUnit === 'months' ? 'شهور' : 'سنوات'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-emerald-700 mb-1 font-semibold">نسبة الخصم (%):</label>
                    <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="w-full bg-white border border-emerald-200 rounded p-2 text-emerald-700 font-bold" />
                  </div>
                </div>
              </div>

              {/* CARD TO GENERATE IMAGE */}
              <div ref={cardRef} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    {clientName && (
                      <span className="text-xs text-blue-600 font-bold block mb-1">مقدم للعميل: {clientName}</span>
                    )}
                    <span className="text-xs text-slate-500 block">مشروع:</span>
                    <h3 className="text-xl font-bold text-blue-600">{selectedProject.name}</h3>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-slate-500 block">المساحة الإجمالية:</span>
                    <span className="text-md font-bold text-slate-800">{effectiveArea.toFixed(1)} م²</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-6 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">الإجمالي قبل الخصم</span>
                    <span className="text-xs font-bold text-slate-400 line-through">{Math.round(totalPriceBeforeDiscount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 block font-semibold">مبلغ الخصم ({discountPercent}%)</span>
                    <span className="text-xs font-bold text-emerald-600">-{Math.round(discountAmount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-700 block font-bold">الإجمالي بعد الخصم</span>
                    <span className="text-sm font-extrabold text-emerald-700">{Math.round(totalPriceAfterDiscount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-600 block font-semibold">مقدم التعاقد ({downPaymentPercent}%)</span>
                    <span className="text-xs font-bold text-blue-600">{Math.round(downPaymentAmount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 block font-semibold">دفعة الاستلام ({receiptPaymentPercent}%)</span>
                    <span className="text-xs font-bold text-purple-600">{Math.round(receiptPaymentAmount).toLocaleString()} ج.م</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-600 block font-semibold">المتبقي للتقسيط</span>
                    <span className="text-xs font-bold text-amber-600">{Math.round(remainingTotal).toLocaleString()} ج.م</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-blue-700 text-xs">النظام الأول: أقساط ربع سنوية متساوية</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">كل 3 شهور</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center mt-3 bg-white p-3 rounded-lg border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">إجمالي الأقساط</span>
                        <span className="font-bold text-xs text-slate-800">{totalQuarters} قسط</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">قيمة القسط الربع سنوي</span>
                        <span className="font-bold text-xs text-blue-600">{Math.round(quarterlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">أقساط قبل الاستلام</span>
                        <span className="font-bold text-xs text-amber-600">{quartersBeforeReceipt} أقساط</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-purple-100 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-purple-700 text-xs">النظام الثاني: أقساط شهرية + دفعات سنوية</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">مزدوج</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center mt-3 bg-white p-3 rounded-lg border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">القسط الشهري ({totalMonths} قسط)</span>
                        <span className="font-bold text-xs text-purple-600">{Math.round(monthlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">القسط السنوي ({years} أقساط)</span>
                        <span className="font-bold text-xs text-purple-700">{Math.round(yearlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">دفعة الاستلام (بعد {receiptAfterMonths} شهر)</span>
                        <span className="font-bold text-xs text-slate-800">{Math.round(receiptPaymentAmount).toLocaleString()} ج.م</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">وديعة الصيانة (10% بعد الخصم)</span>
                        <span className="font-bold text-xs text-amber-600">{Math.round(maintenanceAmount).toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDownloadImage}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition duration-200 flex items-center justify-center gap-2"
                >
                  📥 تحميل كارت العرض للعميل (صورة)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-blue-600">قسم إدارة سجلات العملاء (Leads Management)</h3>
            <p className="text-slate-500 text-xs">هنا سيتم إضافة وتتبع العملاء ومراحل التواصل والمتابعة (Follow-up)</p>
            <div className="p-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              🚧 جاهز لبناء السيكشن واستقبال البيانات 🚀
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
            {PROJECTS_DATA.map((proj) => (
              <div key={proj.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-sm text-blue-600">{proj.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    سعر المتر الافتراضي: <span className="text-slate-800 font-bold">{proj.defaultPrice.toLocaleString()} ج.م</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    handleProjectChange(proj.id);
                    setActiveTab('calculator');
                  }}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition border border-blue-200"
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