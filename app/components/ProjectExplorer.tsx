'use client';

import React from 'react';

interface Project {
  id: string;
  name: string;
  defaultPrice: number;
  monthlyRatio: number;
  yearlyRatio: number;
}

interface ProjectExplorerProps {
  projects?: Project[];
  onSelectProject?: (projectId: string) => void;
}

export default function ProjectExplorer({ projects = [], onSelectProject }: ProjectExplorerProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6" dir="rtl">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">🏘️ دليل المشاريع المتاحة</h3>
          <p className="text-xs text-slate-500">اختر مشروعًا لعرض التفاصيل وتطبيق أسعاره في الحاسبة</p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full border border-blue-100">
          عدد المشاريع: {projects.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-slate-200 hover:border-blue-500 rounded-xl p-4 transition duration-200 bg-slate-50/50 hover:bg-white hover:shadow-md flex flex-col justify-between space-y-3"
          >
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{project.name}</h4>
              <p className="text-xs text-slate-500">
                سعر المتر المعتمد: <span className="font-bold text-blue-600">{project.defaultPrice.toLocaleString()} ج.م</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span>شهري: {project.monthlyRatio}%</span>
              <span>سنوي: {project.yearlyRatio}%</span>
            </div>

            {onSelectProject && (
              <button
                onClick={() => onSelectProject(project.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition"
              >
                تحديد المشروع واحتساب العرض 📊
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}