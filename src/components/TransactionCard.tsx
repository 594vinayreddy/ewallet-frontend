interface Transaction {

  id: string;
  type:  | 'CREDIT'  | 'DEBIT'  | 'TRANSFER';
  amount: number;
  description?: string;
  senderEmail?: string;
  receiverEmail?: string;
  date: string;
  status:  | 'SUCCESS'  | 'FAILED'  | 'PENDING';
}

export default function TransactionCard({tx,}: {tx: Transaction;}) {
  const isCredit = tx.type === 'CREDIT';
  const color = isCredit  ? '#4ade80'  : tx.type === 'TRANSFER' ? '#60a5fa'  : '#f87171';
  const icon =  tx.type === 'CREDIT'   ? '↑'   : tx.type === 'TRANSFER'   ? '⇄'   : '↓';

  return (
    <div style={{display: 'flex',alignItems: 'center',justifyContent:'space-between',padding: '14px 18px',background:'rgba(255,255,255,0.035)',border:'1px solid rgba(255,255,255,0.07)',borderRadius: 14,marginBottom: 10,transition:'background .2s',}}
      onMouseEnter={(e) => (e.currentTarget.style.background ='rgba(255,255,255,0.06)')}
      onMouseLeave={(e) => (e.currentTarget.style.background ='rgba(255,255,255,0.035)')}>

      {/* LEFT SECTION */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14,}}>

        {/* ICON */}

        <div style={{width: 38,height: 38,borderRadius: 10,background:tx.type === 'CREDIT'? 'rgba(74,222,128,0.12)': tx.type === 'TRANSFER'? 'rgba(96,165,250,0.12)': 'rgba(248,113,113,0.12)',
            display: 'flex',alignItems: 'center',justifyContent: 'center',fontSize: '1.1rem',color,}}>{icon}
        </div>

        {/* DETAILS */}

        <div>

          {/* DESCRIPTION */}

          <div style={{fontSize: '.88rem',color: '#f5f7ff',fontWeight: 500,}}>{tx.description || tx.type}</div>

          {/* SENDER EMAIL */}

          {tx.senderEmail && (
            <div style={{fontSize: '.72rem',color:'rgba(245,247,255,0.52)',marginTop: 4,}}>
              From: {tx.senderEmail}
            </div>
          )}

          {/* RECEIVER EMAIL */}

          {tx.receiverEmail && (
            <div style={{fontSize: '.72rem',color:'rgba(245,247,255,0.52)',marginTop: 2,}}>
              To: {tx.receiverEmail}
            </div>
          )}

          {/* DATE */}

          <div style={{fontSize: '.74rem',color:'rgba(245,247,255,0.38)',marginTop: 6,}}>
            {new Date(tx.date).toLocaleDateString(
              'en-IN',
              { day: 'numeric',  month: 'short',  year: 'numeric',}
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}

      <div style={{textAlign: 'right',}} >
        <div style={{fontWeight: 700,fontSize: '.95rem',color,}}> {tx.type === 'CREDIT'? '+': '-'}₹ {tx.amount.toLocaleString('en-IN')}</div>
        <div style={{fontSize: '.7rem',marginTop: 2,color: tx.status === 'SUCCESS' ? '#4ade80' : tx.status === 'FAILED' ? '#f87171' : '#facc15',}}>
          {tx.status}
        </div>
      </div>
    </div>
  );
}