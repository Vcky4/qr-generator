import React, { useState, useEffect, useRef } from 'react';
import { Download, QrCode, Palette, Settings, Copy, Check } from 'lucide-react';
import QRCodeGenerator from './components/QRCodeGenerator';
import ColorPicker from './components/ColorPicker';
import { QRCodeOptions } from './types/qrTypes';

function App() {
  const [text, setText] = useState('https://example.com');
  const [options, setOptions] = useState<QRCodeOptions>({
    width: 256,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  });
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const updateOptions = (newOptions: Partial<QRCodeOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  const updateColor = (type: 'dark' | 'light', color: string) => {
    setOptions(prev => ({
      ...prev,
      color: {
        ...prev.color,
        [type]: color
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
              <p className="text-sm text-gray-600">Create beautiful, customizable QR codes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Text Input */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Content</h2>
              </div>
              <div className="space-y-3">
                <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700">
                  Enter text or URL
                </label>
                <div className="relative">
                  <textarea
                    id="qr-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Enter text, URL, or any content..."
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Size Settings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Size & Quality</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size: {options.width}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={options.width}
                    onChange={(e) => updateOptions({ width: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>128px</span>
                    <span>512px</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margin: {options.margin}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={options.margin}
                    onChange={(e) => updateOptions({ margin: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>4</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Error Correction Level
                  </label>
                  <select
                    value={options.errorCorrectionLevel}
                    onChange={(e) => updateOptions({ errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="L">Low (~7%)</option>
                    <option value="M">Medium (~15%)</option>
                    <option value="Q">Quartile (~25%)</option>
                    <option value="H">High (~30%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Color Settings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Colors</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  label="Foreground"
                  color={options.color.dark}
                  onChange={(color) => updateColor('dark', color)}
                />
                <ColorPicker
                  label="Background"
                  color={options.color.light}
                  onChange={(color) => updateColor('light', color)}
                />
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <QRCodeGenerator text={text} options={options} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;