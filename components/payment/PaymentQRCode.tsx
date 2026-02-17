import React, { useEffect, useState } from 'react';

interface PaymentQRCodeProps {
  amount: number;
}

export const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ amount }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide">Scan QRIS to Pay</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          Rp {amount.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="relative p-2 bg-white border-2 border-gray-900 rounded-lg">
        {/* Placeholder QR Code */}
        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
           <svg className="w-full h-full text-gray-800" fill="currentColor" viewBox="0 0 24 24">
             <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 2h2v2h-2v-2zm3 2h2v2h-2v-2zm-3 2h2v2h-2v-2zm3 2h3v2h-3v-2z"/>
             {/* Simple visual mock, not a real QR */}
             <rect x="10" y="3" width="2" height="2" />
             <rect x="3" y="10" width="2" height="2" />
             <rect x="10" y="10" width="6" height="6" fillOpacity="0.5"/>
           </svg>
        </div>
        
        {/* QRIS Logo mock */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
            <span className="font-bold text-xs">QRIS</span>
        </div>
      </div>

      <div className="mt-6 w-full text-center">
        <p className="text-sm text-gray-500">
          Payment expires in <span className="font-mono font-medium text-red-500">{formatTime(timeLeft)}</span>
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-400">
        <span>Supported by:</span>
        <span className="font-semibold text-gray-500">GOPAY, OVO, DANA, BCA</span>
      </div>
    </div>
  );
};
