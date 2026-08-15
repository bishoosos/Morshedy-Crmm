'use client';

import React, { useState } from 'react';

interface WelcomeScreenProps {
  onEnter: (name: string) => void;
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [nameInput, setNameInput] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setIsFadingOut(true);
    setTimeout(() => {
      onEnter(nameInput);
    }, 500); // مدة أنيميشن الخروج
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`} dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center transform transition-all animate-bounce-short">
        
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-inner">
          👋
        </div>

        <h2 className="text-xl font-extrabold text-slate-800 mb-2">
          أهلاً بك في نظام معمار المرشدي 😍
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          من فضلك أدخل اسمك لتبدأ العمل على السيستم
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="اكتب اسمك هنا (مثال: بيشو)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-center font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl transition duration-200 shadow-lg shadow-blue-600/30 text-sm"
          >
            دخول للسيستم 🚀
          </button>
        </form>
      </div>
    </div>
  );
}