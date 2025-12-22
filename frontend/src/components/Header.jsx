import React from 'react';
import { Utensils, Calendar } from 'lucide-react';

export default function Header() {

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="bg-emerald-500 p-2 rounded-xl">
              <Utensils className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">NutriLog</h1>
              <p className="text-gray-600 text-sm hidden sm:block">Track your daily nutrition</p>
            </div>

          </div>

          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{today}</span>
          </div>

        </div>
      </div>
      
    </header>
  );
}