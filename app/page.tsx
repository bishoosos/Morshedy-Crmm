'use client';

import LeadsSection from './components/LeadsSection';
import ProjectExplorer from './components/ProjectExplorer';
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
  { id: 'zahra', name: 'Zahra North Coast (زهرة)', defaultPrice: 111000, monthlyRatio: 30, yearlyRatio: 70 },
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

  const receiptAfterMonths = receiptUnit === 'years' ? receiptValue * 12 : receiptValue;

  const effectiveArea = area + (roofArea * (roofRatio / 100)) + (gardenArea * (gardenRatio / 100)) + (terraceArea * (terraceRatio / 100));
  const totalPriceBeforeDiscount = effectiveArea * pricePerMeter;
  const discountAmount = totalPriceBeforeDiscount * (discountPercent / 100);
  const totalPriceAfterDiscount = totalPriceBeforeDiscount - discountAmount;

  const downPaymentAmount = totalPriceBeforeDiscount * (downPaymentPercent / 100);
  const receiptPaymentAmount = totalPriceBeforeDiscount * (receiptPaymentPercent / 100);

  const remainingTotal = totalPriceBeforeDiscount - downPaymentAmount - receiptPaymentAmount - discountAmount;
  
  const maintenanceAmount = totalPriceAfterDiscount * 0.10;
  const totalPriceWithMaintenance = totalPriceAfterDiscount + maintenanceAmount;

  const totalQuarters = years * 4;
  const quartersBeforeReceipt = Math.floor(receiptAfterMonths / 3);
  const quarterlyInstallmentVal = remainingTotal > 0 ? remainingTotal / (totalQuarters || 1) : 0;

  const totalMonths = years * 12;
  // السطور الجديدة المطبقة لمنطق شيت الشركة الرسمي
const totalBeforeDiscountRemaining = totalPriceBeforeDiscount - downPaymentAmount - receiptPaymentAmount;

const monthlyPoolBeforeDiscount = totalBeforeDiscountRemaining * (selectedProject.monthlyRatio / 100);
const yearlyPoolBeforeDiscount = totalBeforeDiscountRemaining * (selectedProject.yearlyRatio / 100);

const monthlyDiscountPerTerm = discountAmount / (totalMonths || 1);

const monthlyInstallmentVal = totalBeforeDiscountRemaining > 0 
  ? (monthlyPoolBeforeDiscount / (totalMonths || 1)) - monthlyDiscountPerTerm 
  : 0;

const yearlyInstallmentVal = totalBeforeDiscountRemaining > 0 
  ? (yearlyPoolBeforeDiscount / (years || 1)) 
  : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col md:flex-row w-full max-w-full overflow-x-hidden" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l border-slate-200 p-3 md:p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between md:justify-start gap-3 px-2 py-2 md:py-4 border-b border-slate-100 mb-3 md:mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">🏢</span>
              <div>
                <h1 className="font-bold text-xs md:text-sm text-blue-600">Morshedy CRM</h1>
                <p className="text-[9px] md:text-[10px] text-slate-500">نظام المبيعات الداخلي</p>
              </div>
            </div>
          </div>

          <nav className="flex md:flex-col gap-1.5 md:gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`whitespace-nowrap flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl text-[11px] md:text-xs font-bold transition ${
                activeTab === 'calculator' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 bg-slate-50 md:bg-transparent'
              }`}
            >
              📊 حاسبة العروض
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`whitespace-nowrap flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl text-[11px] md:text-xs font-bold transition ${
                activeTab === 'leads' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 bg-slate-50 md:bg-transparent'
              }`}
            >
              👥 إدارة العملاء
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`whitespace-nowrap flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl text-[11px] md:text-xs font-bold transition ${
                activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 bg-slate-50 md:bg-transparent'
              }`}
            >
              🏘️ المشاريع
            </button>
          </nav>
        </div>

        <div className="hidden md:block border-t border-slate-100 pt-4 px-2 text-[11px] text-slate-400">
          فريق المبيعات المعتمد © 2026
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-5 md:p-8 bg-slate-100 w-full max-w-full overflow-x-hidden">
        <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-800">
              {activeTab === 'calculator' && 'حاسبة عروض الأسعار السريعة'}
              {activeTab === 'leads' && 'قاعدة بيانات العملاء والتواصل'}
              {activeTab === 'inventory' && 'دليل مشاريع معمار المرشدي'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">لوحة تحكم مسؤول المبيعات</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold">المحرك شغال</span>
          </div>
        </div>

        {/* CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full">
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between shadow-xs">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold text-left"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-slate-100 gap-3">
                <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-xs text-slate-700 font-bold whitespace-nowrap">المشروع المحدد:</label>
                  <select 
                    value={selectedProjectId} 
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full sm:w-auto bg-slate-50 border border-blue-500/30 text-blue-700 text-xs font-bold rounded-xl p-2.5 focus:outline-none shadow-xs"
                  >
                    {PROJECTS_DATA.map((proj) => (
                      <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* تفاصيل المساحات والنسب */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 mb-3">📐 تفاصيل المساحات (م²) ونسب الملحقات</h3>
                <div className="flex flex-wrap gap-2.5 sm:gap-3 text-sm mb-3">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[11px] text-slate-500 mb-1">الشقة:</label>
                    <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold text-xs" />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[11px] text-slate-500 mb-1">الروف:</label>
                    <input type="number" value={roofArea} onChange={(e) => setRoofArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs font-semibold" />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[11px] text-slate-500 mb-1">الحديقة:</label>
                    <input type="number" value={gardenArea} onChange={(e) => setGardenArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs font-semibold" />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[11px] text-slate-500 mb-1">التراس:</label>
                    <input type="number" value={terraceArea} onChange={(e) => setTerraceArea(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs font-semibold" />
                  </div>
                  <div className="w-full sm:flex-1 sm:min-w-[140px]">
                    <label className="block text-[11px] text-blue-600 mb-1 font-bold">سعر المتر (جنية):</label>
                    <input type="number" value={pricePerMeter} onChange={(e) => setPricePerMeter(Number(e.target.value))} className="w-full bg-white border border-blue-300 rounded-lg p-2 text-blue-700 font-bold text-xs" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 text-xs">
                  <div className="flex-1 min-w-[140px] flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-600">نسبة الروف: </span>
                    <div>
                      <input type="number" value={roofRatio} onChange={(e) => setRoofRatio(Number(e.target.value))} className="w-12 bg-slate-50 border border-slate-200 rounded p-1 text-center text-amber-600 font-bold" /> %
                    </div>
                  </div>
                  <div className="flex-1 min-w-[140px] flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-600">نسبة الحديقة: </span>
                    <div>
                      <input type="number" value={gardenRatio} onChange={(e) => setGardenRatio(Number(e.target.value))} className="w-12 bg-slate-50 border border-slate-200 rounded p-1 text-center text-amber-600 font-bold" /> %
                    </div>
                  </div>
                  <div className="flex-1 min-w-[140px] flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-600">نسبة التراس: </span>
                    <div>
                      <input type="number" value={terraceRatio} onChange={(e) => setTerraceRatio(Number(e.target.value))} className="w-12 bg-slate-50 border border-slate-200 rounded p-1 text-center text-amber-600 font-bold" /> %
                    </div>
                  </div>
                </div>
              </div>

              {/* شروط الدفع والخصومات */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 mb-3">⚙️ شروط الدفع والخصومات</h3>
                <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs">
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-slate-500 mb-1">السنوات:</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-bold" />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-slate-500 mb-1">التعاقد (%):</label>
                    <input type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-semibold" />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-slate-500 mb-1">الاستلام (%):</label>
                    <input type="number" value={receiptPaymentPercent} onChange={(e) => setReceiptPaymentPercent(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-semibold" />
                  </div>

                  <div className="flex-1 min-w-[130px]">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-purple-700 font-bold text-[10px]">الاستلام بعد:</label>
                      <div className="flex bg-slate-200 p-0.5 rounded text-[9px]">
                        <button
                          type="button"
                          onClick={() => setReceiptUnit('months')}
                          className={`px-1 py-0.5 rounded font-bold transition ${
                            receiptUnit === 'months' ? 'bg-purple-600 text-white' : 'text-slate-600'
                          }`}
                        >
                          شهر
                        </button>
                        <button
                          type="button"
                          onClick={() => setReceiptUnit('years')}
                          className={`px-1 py-0.5 rounded font-bold transition ${
                            receiptUnit === 'years' ? 'bg-purple-600 text-white' : 'text-slate-600'
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
                      <span className="absolute left-2 top-2 text-[9px] text-purple-400 font-semibold pointer-events-none">
                        {receiptUnit === 'months' ? 'شهور' : 'سنوات'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[110px]">
                    <label className="block text-emerald-700 mb-1 font-semibold">نسبة الخصم (%):</label>
                    <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="w-full bg-white border border-emerald-200 rounded p-2 text-emerald-700 font-bold" />
                  </div>
                </div>
              </div>

              {/* CARD TO GENERATE IMAGE */}
              <div ref={cardRef} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 gap-2">
                  <div>
                    {clientName && (
                      <span className="text-xs text-blue-600 font-bold block mb-1">مقدم للعميل: {clientName}</span>
                    )}
                    <span className="text-[10px] sm:text-xs text-slate-500 block">مشروع:</span>
                    <h3 className="text-base sm:text-xl font-bold text-blue-600">{selectedProject.name}</h3>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-[10px] sm:text-xs text-slate-500 block">المساحة الإجمالية:</span>
                    <span className="text-sm sm:text-md font-bold text-slate-800">{effectiveArea.toFixed(1)} م²</span>
                  </div>
                  {/* شريط المساحات والملحقات الجديد */}
<div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap justify-between items-center text-xs gap-2 mt-4">
  <div className="flex items-center gap-1">
    <span className="text-slate-500">المساحة الإجمالية:</span>
    <span className="font-bold text-slate-800">{area} م²</span>
  </div>
  <div className="flex items-center gap-1">
    <span className="text-slate-500">الروف:</span>
    <span className="font-bold text-slate-800">{roofArea > 0 ? `${roofArea} م² (${roofRatio}%)` : '-'}</span>
  </div>
  <div className="flex items-center gap-1">
    <span className="text-slate-500">الحديقة:</span>
    <span className="font-bold text-slate-800">{gardenArea > 0 ? `${gardenArea} م² (${gardenRatio}%)` : '-'}</span>
  </div>
  <div className="flex items-center gap-1">
    <span className="text-slate-500">التراس:</span>
    <span className="font-bold text-slate-800">{terraceArea > 0 ? `${terraceArea} م² (${terraceRatio}%)` : '-'}</span>
  </div>
</div>
                </div>

                {/* كروت الحسابات بمرونة Flexbox لتفادي الخروج من الشاشة */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-wrap gap-2 text-center justify-between">
                  <div className="flex-1 min-w-[100px] bg-white p-2 rounded border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 block">قبل الخصم</span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-400 line-through">{Math.round(totalPriceBeforeDiscount).toLocaleString()}</span>
                  </div>
                  <div className="flex-1 min-w-[100px] bg-white p-2 rounded border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-emerald-600 block font-semibold">الخصم ({discountPercent}%)</span>
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-600">-{Math.round(discountAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex-1 min-w-[100px] bg-white p-2 rounded border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-emerald-700 block font-bold">بعد الخصم</span>
                    <span className="text-[11px] sm:text-xs font-extrabold text-emerald-700">{Math.round(totalPriceAfterDiscount).toLocaleString()}</span>
                  </div>
                  <div className="flex-1 min-w-[100px] bg-white p-2 rounded border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-blue-600 block font-semibold">التعاقد ({downPaymentPercent}%)</span>
                    <span className="text-[11px] sm:text-xs font-bold text-blue-600">{Math.round(downPaymentAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex-1 min-w-[100px] bg-white p-2 rounded border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-purple-600 block font-semibold">الاستلام ({receiptPaymentPercent}%)</span>
                    <span className="text-[11px] sm:text-xs font-bold text-purple-600">{Math.round(receiptPaymentAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex-1 min-w-[110px] bg-orange-50 border border-orange-200 p-2 rounded">
                    <span className="text-[9px] sm:text-[10px] text-orange-700 block font-bold">المتبقي للأقساط</span>
                    <span className="text-[11px] sm:text-xs font-extrabold text-orange-800">{Math.round(remainingTotal).toLocaleString()}</span>
                  </div>
                  <div className="flex-1 min-w-[100px] bg-white p-2 rounded border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-amber-600 block font-semibold">الوديعة (10%)</span>
                    <span className="text-[11px] sm:text-xs font-bold text-amber-600">{Math.round(maintenanceAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex-1 min-w-[110px] bg-indigo-50 border border-indigo-200 p-2 rounded">
                    <span className="text-[9px] sm:text-[10px] text-indigo-700 block font-extrabold">بعد الصيانة</span>
                    <span className="text-[11px] sm:text-xs font-extrabold text-indigo-900">{Math.round(totalPriceWithMaintenance).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* النظام الأول */}
                  <div className="bg-slate-50 border border-blue-100 rounded-xl p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-blue-700 text-xs">النظام الأول: أقساط ربع سنوية متساوية</span>
                      <span className="text-[9px] sm:text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">كل 3 شهور</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-center mt-3 bg-white p-2.5 sm:p-3 rounded-lg border border-slate-100 text-xs">
                      <div className="flex-1 min-w-[120px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">المتبقي للتقسيط</span>
                        <span className="font-bold text-[11px] sm:text-xs text-orange-700">{Math.round(remainingTotal).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex-1 min-w-[100px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">عدد الأقساط</span>
                        <span className="font-bold text-[11px] sm:text-xs text-slate-800">{totalQuarters} قسط</span>
                      </div>
                      <div className="flex-1 min-w-[120px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">القسط الربع سنوي</span>
                        <span className="font-bold text-[11px] sm:text-xs text-blue-600">{Math.round(quarterlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex-1 min-w-[120px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">أقساط قبل الاستلام</span>
                        <span className="font-bold text-[11px] sm:text-xs text-amber-600">{quartersBeforeReceipt} أقساط</span>
                      </div>
                    </div>
                  </div>

                  {/* النظام الثاني */}
                  <div className="bg-slate-50 border border-purple-100 rounded-xl p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-purple-700 text-xs">النظام الثاني: أقساط شهرية + دفعات سنوية</span>
                      <span className="text-[9px] sm:text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">مزدوج</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-center mt-3 bg-white p-2.5 sm:p-3 rounded-lg border border-slate-100 text-xs">
                      <div className="flex-1 min-w-[130px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">القسط الشهري ({totalMonths} قسط)</span>
                        <span className="font-bold text-[11px] sm:text-xs text-purple-600">{Math.round(monthlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex-1 min-w-[130px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">القسط السنوي ({years} أقساط)</span>
                        <span className="font-bold text-[11px] sm:text-xs text-purple-700">{Math.round(yearlyInstallmentVal).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex-1 min-w-[130px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">دفعة الاستلام ({receiptAfterMonths} شهر)</span>
                        <span className="font-bold text-[11px] sm:text-xs text-slate-800">{Math.round(receiptPaymentAmount).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex-1 min-w-[130px] p-1">
                        <span className="text-slate-500 block text-[9px] sm:text-[10px]">الإجمالي شامل الصيانة</span>
                        <span className="font-bold text-[11px] sm:text-xs text-indigo-700">{Math.round(totalPriceWithMaintenance).toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                  onClick={handleDownloadImage}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  📥 تحميل كارت العرض للعميل (صورة)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && <LeadsSection />}

        {/* INVENTORY TAB */}
        
        {activeTab === 'inventory' && ( 
          <div className="max-w-5xl mx-auto flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
            {PROJECTS_DATA.map((proj) => (
              <div key={proj.id} className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-xl flex justify-between items-center shadow-xs">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-blue-600">{proj.name}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                    سعر المتر الافتراضي: <span className="text-slate-800 font-bold">{proj.defaultPrice.toLocaleString()} ج.م</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    handleProjectChange(proj.id);
                    setActiveTab('calculator');
                  }}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition border border-blue-200 shrink-0"
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