import React from 'react';
import { Button } from '@/components/ui/Button';

interface PaymentStatusProps {
  status: 'pending' | 'success' | 'failed';
  onRefresh?: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, onRefresh }) => {
  if (status === 'success') {
    return (
      <div className="text-center p-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
        <p className="text-gray-500 mt-2">Your enrollment is confirmed.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center p-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Payment Failed</h3>
        <p className="text-gray-500 mt-2">Please try again or contact support.</p>
        <div className="mt-4">
            <Button onClick={onRefresh} variant="outline" size="sm">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-6">
       <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Waiting for Payment</h3>
            <p className="text-gray-500 mt-1 text-sm">Please complete payment via QRIS on your mobile banking app.</p>
            
            {onRefresh && (
                <button 
                    onClick={onRefresh}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Check Status
                </button>
            )}
       </div>
    </div>
  );
};
