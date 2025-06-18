import React, { useState } from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#008000', '#FFC0CB', '#A52A2A', '#808080', '#000080'
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-10 rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200 flex items-center gap-3 px-3"
          style={{ backgroundColor: color }}
        >
          <div className="flex-1 text-left">
            <span className="text-xs font-mono text-gray-700 bg-white/80 px-2 py-1 rounded">
              {color.toUpperCase()}
            </span>
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-20 mt-1 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-full">
            <div className="space-y-3">
              {/* Color Input */}
              <div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-8 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              
              {/* Preset Colors */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Presets</p>
                <div className="grid grid-cols-5 gap-1">
                  {presetColors.map((presetColor) => (
                    <button
                      key={presetColor}
                      onClick={() => {
                        onChange(presetColor);
                        setIsOpen(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform duration-150"
                      style={{ backgroundColor: presetColor }}
                      title={presetColor}
                    />
                  ))}
                </div>
              </div>
              
              {/* Hex Input */}
              <div>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                      onChange(value);
                    }
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;