'use client';
import { useState } from 'react';
import { AVAILABLE_ICONS } from '@/lib/icons';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedIcon = AVAILABLE_ICONS.find(i => i.name === value) || AVAILABLE_ICONS[0];
  const SelectedIconComponent = selectedIcon.icon;

  const filteredIcons = search
    ? AVAILABLE_ICONS.filter(i => 
        i.label.toLowerCase().includes(search.toLowerCase()) ||
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    : AVAILABLE_ICONS;

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-900 mb-2">Icono</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500 focus:outline-none text-left flex items-center gap-3"
      >
        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
          <SelectedIconComponent size={24} />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{selectedIcon.label}</div>
          <div className="text-xs text-gray-500">{selectedIcon.name}</div>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-4 max-h-[500px] overflow-y-auto">
            <input
              type="text"
              placeholder="Buscar icono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:border-blue-500 focus:outline-none"
            />
            
            <div className="text-xs text-gray-500 mb-2">
              {filteredIcons.length} iconos disponibles
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map((iconData) => {
                const IconComponent = iconData.icon;
                return (
                  <button
                    key={iconData.name}
                    type="button"
                    onClick={() => {
                      onChange(iconData.name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`p-3 rounded-lg border-2 hover:border-blue-500 transition-all flex flex-col items-center gap-2 ${
                      value === iconData.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <IconComponent size={28} className="text-gray-700" />
                    <span className="text-xs text-gray-600 text-center leading-tight">
                      {iconData.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
