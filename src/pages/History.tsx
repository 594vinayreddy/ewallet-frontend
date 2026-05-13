import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getHistory } from '../api/walletApi';

import {
  getTransactionHistory,
} from '../api/transactionApi';

import { useAuthStore } from '../store/authStore';

import TransactionCard from '../components/TransactionCard';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *,*::before,*::after{
    box-sizing:border-box;
    margin:0;
    padding:0
  }

  body{
    font-family:'DM Sans',sans-serif;
    background:#080b12;
    color:#f5f7ff;
    min-height:100vh
  }

  .page-wrap{
    min-height:100vh;
    background:
      radial-gradient(
        ellipse at 20% 10%,
        rgba(251,113,133,0.06) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 80% 90%,
        rgba(79,124,255,0.06) 0%,
        transparent 50%
      ),
      #080b12;
    display:flex;
    flex-direction:column
  }

  .topbar{
    display:flex;
    align-items:center;
    gap:14px;
    padding:20px 40px;
    border-bottom:1px solid rgba(255,255,255,0.07);
    background:rgba(8,11,18,0.85);
    backdrop-filter:blur(16px);
    position:sticky;
    top:0;
    z-index:100
  }

  .back-btn{
    width:36px;
    height:36px;
    border-radius:10px;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    color:#f5f7ff;
    font-size:1rem;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center
  }

  .page-title{
    font-family:'Syne',sans-serif;
    font-weight:700;
    font-size:1.05rem
  }

  .content{
    max-width:680px;
    margin:0 auto;
    padding:32px 20px 60px;
    width:100%
  }

  .filters{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    margin-bottom:24px
  }

  .search-input,
  .filter-select{
    background:rgba(255,255,255,0.065);
    border:1px solid rgba(255,255,255,0.085);
    border-radius:12px;
    padding:10px 14px;
    color:#f5f7ff;
    font-family:'DM Sans',sans-serif;
    font-size:.85rem;
    outline:none
  }

  .search-input{
    flex:1;
    min-width:180px
  }

  .filter-select option{
    background:#12151e
  }

  .section-label{
    font-family:'Syne',sans-serif;
    font-size:1.1rem;
    font-weight:700;
    margin-bottom:16px
  }

  .empty{
    text-align:center;
    padding:48px 0;
    color:rgba(245,247,255,0.3)
  }

  .error-box{
    padding:12px 16px;
    border-radius:12px;
    background:rgba(248,113,113,0.1);
    border:1px solid rgba(248,113,113,0.25);
    color:#f87171;
    margin-bottom:16px
  }
`;

export default function History() {

  const navigate = useNavigate();

  const { user } = useAuthStore() as any;

  const [txs, setTxs] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [typeFilter, setType] =
    useState('ALL');

  const [statusFilter, setStatus] =
    useState('ALL');

  useEffect(() => {

    const s =
      document.createElement('style');

    s.textContent = CSS;

    document.head.appendChild(s);

    return () => {
      document.head.removeChild(s);
    };

  }, []);

  useEffect(() => {

    if (user?.id && user?.email) {
      fetchHistory();
    }

  }, [user]);

  const fetchHistory = async () => {

    try {

      setLoading(true);

      const [
        walletHistory,
        transferHistory,
      ] = await Promise.all([

        getHistory(user.id),

        getTransactionHistory(
          user.email
        ),

      ]);

      // normalize wallet tx
      const walletTxs =
        walletHistory.map((tx: any) => ({

          id: `wallet-${tx.id}`,

          type: tx.type,

          amount: tx.amount,

          date: tx.createdAt,

          description:
            'Wallet transaction',

          status: 'SUCCESS',
        }));

      // normalize transfer tx
      const transferTxs =
        transferHistory.map((tx: any) => ({

          id: `transfer-${tx.id}`,

          type: 'TRANSFER',

          amount: tx.amount,

          date: tx.createdAt,

          description:
            tx.description ||
            'Transfer',

          status:
            tx.status ||
            'SUCCESS',
        }));

      // merge + sort latest first
      const merged = [
        ...walletTxs,
        ...transferTxs,
      ].sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      );

      setTxs(merged);

    } catch (err: any) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to load history'
      );

    } finally {

      setLoading(false);
    }
  };

  const filtered = txs

    .filter(
      (tx) =>
        typeFilter === 'ALL' ||
        tx.type === typeFilter
    )

    .filter(
      (tx) =>
        statusFilter === 'ALL' ||
        tx.status === statusFilter
    )

    .filter(
      (tx) =>
        !search ||
        (
          tx.description || ''
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="page-wrap">

      <div className="topbar">

        <button
          className="back-btn"
          onClick={() =>
            navigate('/dashboard')
          }
        >
          ←
        </button>

        <span className="page-title">
          Transaction History
        </span>

      </div>

      <div className="content">

        <div className="filters">

          <input
            className="search-input"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="ALL">
              All Types
            </option>

            <option value="CREDIT">
              Credit
            </option>

            <option value="DEBIT">
              Debit
            </option>

            <option value="TRANSFER">
              Transfer
            </option>

          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="ALL">
              All Status
            </option>

            <option value="SUCCESS">
              Success
            </option>

            <option value="FAILED">
              Failed
            </option>

            <option value="PENDING">
              Pending
            </option>

          </select>

        </div>

        <div className="section-label">
          Transactions
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading ? (

          <div className="empty">
            Loading...
          </div>

        ) : filtered.length === 0 ? (

          <div className="empty">
            No transactions found.
          </div>

        ) : (

          filtered.map((tx) => (

            <TransactionCard
              key={tx.id}
              tx={tx}
            />

          ))

        )}

      </div>

    </div>
  );
}