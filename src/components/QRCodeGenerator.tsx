import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, AlertCircle } from 'lucide-react';
import { QRCodeOptions } from '../types/qrTypes';

interface QRCodeGeneratorProps {
  text: string;
  options: QRCodeOptions;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ text, options }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [text, options]);

  const generateQRCode = async () => {
    if (!canvasRef.current || !text.trim()) return;

    setIsGenerating(true);
    setError('');

    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: options.width,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
    } catch (err) {
      setError('Failed to generate QR code. Please check your input.');
      console.error('QR Code generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = (format: 'png' | 'svg') => {
    if (!canvasRef.current || !text.trim()) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    } else {
      QRCode.toString(text, {
        type: 'svg',
        width: options.width,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel,
      }).then((svg) => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'qrcode.svg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
      
      <div className="space-y-4">
        {/* QR Code Display */}
        <div className="relative">
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[320px]">
            {error ? (
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : text.trim() ? (
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className={`rounded-lg shadow-md transition-opacity duration-300 ${
                    isGenerating ? 'opacity-50' : 'opacity-100'
                  }`}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
                <p className="text-gray-500 text-sm">Enter text to generate QR code</p>
              </div>
            )}
          </div>
        </div>

        {/* Download Buttons */}
        {text.trim() && !error && (
          <div className="flex gap-3">
            <button
              onClick={() => downloadQRCode('png')}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={() => downloadQRCode('svg')}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              SVG
            </button>
          </div>
        )}

        {/* QR Code Info */}
        {text.trim() && !error && (
          <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{options.width}×{options.width}px</span>
            </div>
            <div className="flex justify-between">
              <span>Error Correction:</span>
              <span>{options.errorCorrectionLevel}</span>
            </div>
            <div className="flex justify-between">
              <span>Characters:</span>
              <span>{text.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;