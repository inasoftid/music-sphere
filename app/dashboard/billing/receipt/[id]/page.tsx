'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface BillDetail {
  id: string;
  courseName: string;
  month: string;
  amount: number;
  status: string;
  dueDate: string;
  paymentDate: string | null;
  paymentMethod: string | null;
  studentName: string;
  studentEmail: string;
  studentAddress: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/bills?billId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setBill(data);
        }
      } catch (error) {
        console.error('Error fetching receipt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  useEffect(() => {
    if (bill && !loading) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [bill, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Receipt not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <div className="max-w-3xl mx-auto border border-gray-200 p-8 shadow-sm print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KWITANSI PEMBAYARAN</h1>
            <p className="text-gray-500 mt-1">MusicSphere Course</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-red-600">LUNAS</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tanggal Bayar: {bill.paymentDate ? new Date(bill.paymentDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
            </p>
            <p className="text-sm text-gray-500">
              No. Transaksi: #{bill.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Ditagihkan Kepada:</h3>
            <p className="font-bold text-lg">{bill.studentName}</p>
            <p className="text-gray-600">{bill.studentEmail}</p>
            <p className="text-gray-600">{bill.studentAddress}</p>
          </div>
          <div className="text-right">
             <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Metode Pembayaran:</h3>
             <p className="font-medium">{bill.paymentMethod || '-'}</p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-3 font-bold">Deskripsi</th>
              <th className="text-right py-3 font-bold">Periode</th>
              <th className="text-right py-3 font-bold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4">
                <p className="font-bold">{bill.courseName}</p>
                <p className="text-sm text-gray-500">Biaya Pendidikan Bulanan</p>
              </td>
              <td className="text-right py-4">{bill.month}</td>
              <td className="text-right py-4 font-bold">Rp {bill.amount.toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">Rp {bill.amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-black">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-red-600">Rp {bill.amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
          <p>Terima kasih telah melakukan pembayaran.</p>
          <p>Bukti pembayaran ini sah dan diterbitkan secara otomatis oleh sistem.</p>
          <p className="mt-4 font-mono text-xs text-gray-400">ID: {bill.id}</p>
        </div>
      </div>
      
      <div className="text-center mt-8 print:hidden">
        <button 
            onClick={() => window.print()} 
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
            Cetak Kwitansi
        </button>
      </div>
    </div>
  );
}
