'use client';

import React, { useEffect, useState } from 'react';
import { BillCard } from '@/components/billing/BillCard';
import { Bill } from '@/types';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function BillingPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
        if (!user?.id) return;
        
        try {
            const res = await fetch(`/api/bills?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setBills(data);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.id) {
        fetchBills();
    } else {
        setIsLoading(false);
    }
  }, [user]);

  const unpaidBills = bills.filter(b => b.status === 'unpaid' || b.status === 'overdue');
  const paidBills = bills.filter(b => b.status === 'paid');

  if (isLoading) {
      return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Payments</h1>
        <p className="text-gray-400">Kelola biaya kuliah bulanan Anda dan lihat riwayat pembayaran.</p>
      </div>

      {unpaidBills.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-l-4 border-l-yellow-500 border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Tagihan Belum Dibayar</h2>
            <div className="space-y-4">
              {unpaidBills.map(bill => (
                <BillCard key={bill.id} bill={bill} />
              ))}
            </div>
        </div>
      )}

      {unpaidBills.length === 0 && paidBills.length === 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-8 text-center">
              <p className="text-gray-400">Anda belum memiliki tagihan.</p>
          </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Riwayat Pembayaran</h2>
        <div className="space-y-4">
          {paidBills.length > 0 ? (
             paidBills.map(bill => (
               <BillCard key={bill.id} bill={bill} />
             ))
          ) : (
            <p className="text-gray-500 text-sm italic">Belum ada riwayat pembayaran.</p>
          )}
        </div>
      </div>
    </div>
  );
}
