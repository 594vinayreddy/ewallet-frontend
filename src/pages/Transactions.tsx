import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { transfer } from '../api/transactionApi';
import type { Transaction } from '../types';

export default function Transactions() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ from: '', to: '', amount: 0 });

  const { data, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await getTransactions();
      return res.data as Transaction[];
    },
  });

  const mutation = useMutation({
    mutationFn: transfer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  });

  const handleTransfer = () => {
    mutation.mutate({ from: form.from, to: form.to, amount: Number(form.amount) });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Transactions</h1>

      {/* Transfer Form */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          placeholder="From User ID"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          placeholder="To User ID"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleTransfer}
          disabled={mutation.isPending}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {mutation.isPending ? 'Sending...' : 'Transfer'}
        </button>
      </div>

      {/* Transaction List */}
      {isLoading && <p>Loading transactions...</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>ID</th>
            <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>From</th>
            <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>To</th>
            <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Amount</th>
            <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Status</th>
            <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((tx) => (
            <tr key={tx.id}>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{tx.id}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{tx.fromUserId}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>{tx.toUserId}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>${tx.amount}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  backgroundColor:
                    tx.status === 'COMPLETED' ? '#d1fae5' :
                    tx.status === 'FAILED' ? '#fee2e2' : '#fef3c7',
                  color:
                    tx.status === 'COMPLETED' ? '#065f46' :
                    tx.status === 'FAILED' ? '#991b1b' : '#92400e',
                }}>
                  {tx.status}
                </span>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                {new Date(tx.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}