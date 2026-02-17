'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface Payment {
    id: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    type: string;
    amount: number;
    lateFee: number;
    month: number;
    dueDate: string;
    status: string;
    paymentDate: string | null;
    date: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/admin/payments');
            if (res.ok) {
                const data = await res.json();
                setPayments(data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchPayments();
  }, []);

  // Filter payments based on search
  const filteredPayments = payments.filter(payment =>
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment Monitoring</h1>
      </div>

      <Card>
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show</label>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <label className="text-sm text-gray-600">entries</label>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.length > 0 ? (
                  currentPayments.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                          {tx.id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(tx.studentName)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{tx.studentName}</div>
                            <div className="text-xs text-gray-500">{tx.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tx.courseTitle}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-indigo-600 font-semibold">Rp {tx.amount.toLocaleString('id-ID')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{tx.date}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status.toLowerCase() === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : ['pending', 'unpaid'].includes(tx.status.toLowerCase())
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedPayment(tx);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-gray-400 text-4xl">💳</div>
                          <div className="text-gray-500 font-medium">No payments found</div>
                          <div className="text-gray-400 text-sm">Try adjusting your search</div>
                        </div>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === page 
                    ? 'bg-indigo-600 text-white' 
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* Payment Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Transaction ID</label>
                <p className="text-sm font-mono text-gray-900 break-all">{selectedPayment.id}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Date</label>
                <p className="text-sm text-gray-900">{selectedPayment.date}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 my-2"></div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Student Name</label>
                <p className="text-sm font-semibold text-gray-900">{selectedPayment.studentName}</p>
                <p className="text-xs text-gray-500">{selectedPayment.studentEmail}</p>
              </div>
              <div>
                 <label className="text-xs font-medium text-gray-500 uppercase">Course</label>
                 <p className="text-sm text-gray-900">{selectedPayment.courseTitle}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 my-2"></div>

             <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
                 <p className="text-sm text-gray-900 capitalize">{selectedPayment.type?.toLowerCase()}</p>
              </div>
              <div>
                 <label className="text-xs font-medium text-gray-500 uppercase">Month</label>
                 <p className="text-sm text-gray-900">{selectedPayment.month || '-'}</p>
              </div>
              <div>
                 <label className="text-xs font-medium text-gray-500 uppercase">Due Date</label>
                 <p className="text-sm text-gray-900">{selectedPayment.dueDate}</p>
              </div>
              <div>
                 <label className="text-xs font-medium text-gray-500 uppercase">Payment Date</label>
                 <p className="text-sm text-gray-900">{selectedPayment.paymentDate || '-'}</p>
              </div>
             </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Amount</span>
                    <span className="font-medium">Rp {selectedPayment.amount.toLocaleString('id-ID')}</span>
                </div>
                {selectedPayment.lateFee > 0 && (
                     <div className="flex justify-between text-sm text-red-600">
                        <span>Late Fee</span>
                        <span>+ Rp {selectedPayment.lateFee.toLocaleString('id-ID')}</span>
                    </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                     <span className="font-bold text-indigo-600 text-lg">
                        Rp {(selectedPayment.amount + (selectedPayment.lateFee || 0)).toLocaleString('id-ID')}
                     </span>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                 <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide ${
                          selectedPayment.status.toLowerCase() === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : ['pending', 'unpaid'].includes(selectedPayment.status.toLowerCase())
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                    {selectedPayment.status}
                 </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
