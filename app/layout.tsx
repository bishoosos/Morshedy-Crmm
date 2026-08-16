
'use client';

import './globals.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

function WelcomeScreen({ onEnter }: { onEnter: (name: string) => void }) {
  const [nameInput, setNameInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setIsSubmitted(true);
    setTimeout(() => {
      onEnter(nameInput);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 transition-opacity duration-500" dir="rtl">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full mx-auto text-center transform transition-all relative overflow-hidden">
        
        {isSubmitted && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-fade-in p-4">
            <div className="relative">
              <span className="absolute -top-12 -right-8 text-3xl animate-ping">💖</span>
              <span className="absolute -top-10 -left-8 text-4xl animate-bounce">❤️</span>
              <div className="text-5xl mb-3 animate-bounce">😍</div>
            </div>
            <h3 className="text-base md:text-lg font-extrabold text-slate-800 mt-2 text-center">
              منورة السيستم يا مريووم ✨
            </h3>
          </div>
        )}

        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl md:text-3xl mb-4 shadow-inner">
          👋
        </div>

        <h2 className="text-lg md:text-xl font-extrabold text-slate-800 mb-2">
          أهلاً بيكي فى معمار المرشدي 😍
        </h2>
        <p className="text-xs text-slate-500 mb-6">
           اكتبي اسمك عشان السيستم يشتغل
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="مريووم"
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEnter = (name: string) => {
    setUserName(name);
  };

  if (!isMounted) {
    return (
      <html lang="ar" dir="rtl">
        <body className="bg-slate-100 min-h-screen flex flex-col"></body>
      </html>
    );
  }

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-100 min-h-screen flex flex-col font-sans">
        {!userName && <WelcomeScreen onEnter={handleEnter} />}

        {/* الهيدر معدل ليكون متجاوباً تماماً مع الموبايل */}
        <header className="bg-white border-b border-slate-200 py-3 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Morshedy Group Logo"
              width={220}
              height={65}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-[10px] md:text-xs text-slate-500 font-semibold block">معمار المرشدي</span>
            <span className="text-xs md:text-sm text-blue-600 font-bold">
              {userName ? `مرحباً، ${userName}` : 'بوابة المبيعات الداخلية'}
            </span>
          </div>
        </header>

        <div className="flex-1 p-2 md:p-4">
          {children}
        </div>
      </body>
    </html>
  );
}