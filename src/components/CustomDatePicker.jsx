import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({ selectedDate, onChange, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate || new Date()));
  
  // Helper to get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Helper to get first day of month (0 = Sunday, 1 = Monday, etc.)
  // Adjusting for Monday start as per image (M T W T F S S)
  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 7, so Monday (1) is 1.
    return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    // Create new date in local time to avoid UTC shifts
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${d}`;
    
    onChange(dateStr);
    // Optional: Auto close if desired
  };

  // Generate grid
  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Empty cells for previous month padding
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      // Determine state
      const isSelected = selectedDate && 
        new Date(selectedDate).getDate() === day &&
        new Date(selectedDate).getMonth() === currentDate.getMonth() &&
        new Date(selectedDate).getFullYear() === currentDate.getFullYear();
      
      const isToday = today.getDate() === day && 
        today.getMonth() === currentDate.getMonth() && 
        today.getFullYear() === currentDate.getFullYear();
        
      const isPast = dateToCheck < today;

      days.push(
        <button
          key={day}
          disabled={isPast && !isToday} // Allow selecting today even if technically 'past' hours. Actually isPast usually implies date < today.
          onClick={(e) => { e.preventDefault(); handleDateClick(day); }}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all
            ${isSelected 
              ? 'bg-black text-white font-bold shadow-md transform scale-105' // Selected: Black filled circle
              : isToday
                ? 'bg-gray-200 text-black font-bold' // Today: Gray filled circle
                : isPast 
                  ? 'text-gray-200 cursor-not-allowed' // Past: Faint
                  : 'text-gray-900 hover:bg-gray-100 font-medium' // Normal
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm mx-auto border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={(e) => { e.preventDefault(); handlePrevMonth(); }}
          className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button 
          onClick={(e) => { e.preventDefault(); handleNextMonth(); }}
          className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 mb-4">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
          <div key={day} className="h-10 w-10 flex items-center justify-center text-gray-400 text-xs font-medium mx-auto">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-2 justify-items-center">
        {renderCalendarDays()}
      </div>
      
      {/* Selected Date String (Bottom) */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="text-3xl font-mono text-gray-900 tracking-wider">
           {selectedDate ? selectedDate.split('-').reverse().join('-') : '-- -- ----'}
           <span className="animate-pulse ml-1 text-yellow-400">|</span> 
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;
