import React from 'react';
import Link from 'next/link';
import { Bill } from '@/types';
import { Button } from '@/components/ui/Button';

interface BillCardProps {
  bill: Bill;
}

export const BillCard: React.FC<BillCardProps> = ({ bill }) => {
  const statusColors = {
    paid: 'bg-green-500/20 text-green-400 border border-green-500/20',
    unpaid: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
    overdue: 'bg-red-500/20 text-red-400 border border-red-500/20',
  };



  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-white">{bill.month}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[bill.status]}`}>
            {bill.status === 'paid' ? 'Lunas' : bill.status === 'unpaid' ? 'Belum Bayar' : 'Terlambat'}
          </span>
        </div>
        <p className="text-sm text-gray-400">{bill.courseName}</p>
        <p className="text-xs text-gray-500">Jatuh Tempo: {new Date(bill.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
        <div className="text-right">
          <p className="text-sm text-gray-500">Jumlah Tagihan</p>
          <p className="text-xl font-bold text-white">Rp {bill.amount.toLocaleString('id-ID')}</p>
        </div>

        <div className="w-full sm:w-auto">
          {bill.status === 'paid' ? (
            <Link href={`/dashboard/billing/receipt/${bill.id}`} target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" fullWidth className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-white/5">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh Bukti
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/payment?billId=${bill.id}`} className="block w-full sm:w-auto">
                <div className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors text-center cursor-pointer">
                  Bayar Sekarang
                </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
