import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const styles = {
  body: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    minHeight: '100vh',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  dashboardContainer: {
    width: '100%',
    maxWidth: '1400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  navHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#8E8E93',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.2s',
    background: 'none',
    border: 'none',
  },
  textTitle: {
    fontSize: '32px',
    fontWeight: 500,
    letterSpacing: '-0.5px',
  },
  textSub: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#8E8E93',
    marginTop: '8px',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    padding: '32px',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  filterGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  filterSelect: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 44px 10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
  },
  filterChevron: {
    position: 'absolute',
    right: '16px',
    pointerEvents: 'none',
    stroke: '#8E8E93',
  },
  pillButton: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pillButtonTransparent: {
    background: 'transparent',
    color: '#8E8E93',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pillButtonOutline: {
    background: 'transparent',
    border: '1px solid #2C2C2E',
    color: '#FFFFFF',
    borderRadius: '999px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pillButtonActive: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 0',
    width: '40px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pillButtonPage: {
    background: 'transparent',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 0',
    width: '40px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '1px solid #2C2C2E',
  },
  th: {
    textAlign: 'left',
    padding: '16px 24px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tdRow: {
    padding: '24px',
    fontSize: '15px',
  },
  typeIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#2C2C2E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    flexShrink: 0,
  },
  cellContent: {
    display: 'flex',
    alignItems: 'center',
  },
  cellStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  textLabel: {
    fontSize: '15px',
    fontWeight: 500,
  },
  textCaption: {
    fontSize: '12px',
    color: '#8E8E93',
  },
  statusPill: {
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: '#4CAF50',
    display: 'inline-block',
  },
  statusPillPending: {
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#FFC107',
    display: 'inline-block',
  },
  detailContent: {
    padding: '0 24px 32px 72px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: '14px',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
};

const transactions = [
  {
    id: 1,
    icon: 'exchange',
    label: 'Exchange USD to EUR',
    caption: 'Conversion Rate: 1.104',
    date: 'Oct 24, 2023',
    time: '14:32:05',
    amount: '-$1,000.00',
    amountSub: '+€904.90',
    amountColor: '#FFFFFF',
    status: 'Completed',
    details: [
      { label: 'Transaction ID', value: 'TXN-984205112-X' },
      { label: 'From Account', value: 'Cash Balance (USD)' },
      { label: 'Fee Paid', value: '$0.00 (Standard)' },
      { label: 'Network Hash', value: 'Internal Transfer' },
    ],
  },
  {
    id: 2,
    icon: 'deposit',
    label: 'Deposit via Wire',
    caption: 'Chase Bank ****9021',
    date: 'Oct 23, 2023',
    time: '09:15:22',
    amount: '+$5,000.00',
    amountSub: 'USD',
    amountColor: '#4CAF50',
    status: 'Completed',
    details: [
      { label: 'Transaction ID', value: 'DEP-11029384-W' },
      { label: 'Settlement', value: 'Instant' },
      { label: 'Reference', value: 'Monthly Savings' },
      { label: 'Bank Confirmation', value: '#CH-92011' },
    ],
  },
  {
    id: 3,
    icon: 'withdrawal',
    label: 'Withdrawal to Wallet',
    caption: 'External Address (SOL)',
    date: 'Oct 21, 2023',
    time: '18:40:11',
    amount: '-120.00 SOL',
    amountSub: '~$2,520.00 USD',
    amountColor: '#FFFFFF',
    status: 'Processing',
    details: [
      { label: 'Transaction ID', value: 'WD-00921-S' },
      { label: 'Destination', value: 'H9qZ...x4P2' },
      { label: 'Gas Fee', value: '0.000005 SOL' },
      { label: 'Confirmations', value: '12 / 32' },
    ],
  },
  {
    id: 4,
    icon: 'buy',
    label: 'Buy Bitcoin',
    caption: 'Spot Market Order',
    date: 'Oct 20, 2023',
    time: '11:02:45',
    amount: '+0.05 BTC',
    amountSub: '-$1,422.50 USD',
    amountColor: '#FFFFFF',
    status: 'Completed',
    details: [
      { label: 'Order ID', value: 'BUY-BTC-827' },
      { label: 'Price per BTC', value: '$28,450.00' },
      { label: 'Trading Fee', value: '$1.42 (0.1%)' },
      { label: 'Filled At', value: 'Coinbase Exchange' },
    ],
  },
];

const ExchangeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

const DepositIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const WithdrawalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const BuyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

const getIcon = (type) => {
  switch (type) {
    case 'exchange': return <ExchangeIcon />;
    case 'deposit': return <DepositIcon />;
    case 'withdrawal': return <WithdrawalIcon />;
    case 'buy': return <BuyIcon />;
    default: return <ExchangeIcon />;
  }
};

const ChevronDown = ({ isOpen }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transition: 'transform 0.3s ease',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const TransactionRow = ({ transaction, isOpen, onToggle }) => {
  const rowStyle = {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: isOpen ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
  };

  const detailRowStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    display: isOpen ? 'table-row' : 'none',
  };

  return (
    <>
      <tr
        style={rowStyle}
        onClick={onToggle}
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <td style={styles.tdRow}>
          <div style={styles.cellContent}>
            <div style={styles.typeIcon}>
              {getIcon(transaction.icon)}
            </div>
            <div style={styles.cellStack}>
              <span style={styles.textLabel}>{transaction.label}</span>
              <span style={styles.textCaption}>{transaction.caption}</span>
            </div>
          </div>
        </td>
        <td style={styles.tdRow}>
          <div style={styles.cellStack}>
            <span style={styles.textLabel}>{transaction.date}</span>
            <span style={styles.textCaption}>{transaction.time}</span>
          </div>
        </td>
        <td style={styles.tdRow}>
          <div style={styles.cellStack}>
            <span style={{ ...styles.textLabel, color: transaction.amountColor }}>{transaction.amount}</span>
            <span style={styles.textCaption}>{transaction.amountSub}</span>
          </div>
        </td>
        <td style={styles.tdRow}>
          <span style={transaction.status === 'Processing' ? styles.statusPillPending : styles.statusPill}>
            {transaction.status}
          </span>
        </td>
        <td style={styles.tdRow}>
          <ChevronDown isOpen={isOpen} />
        </td>
      </tr>
      <tr style={detailRowStyle}>
        <td colSpan={5}>
          <div style={styles.detailContent}>
            {transaction.details.map((detail, idx) => (
              <div key={idx} style={styles.detailItem}>
                <span style={styles.detailLabel}>{detail.label}</span>
                <span style={styles.detailValue}>{detail.value}</span>
              </div>
            ))}
          </div>
        </td>
      </tr>
    </>
  );
};

const App = () => {
  const [openRow, setOpenRow] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [dateFilter, setDateFilter] = useState('Date: Last 30 Days');
  const [typeFilter, setTypeFilter] = useState('Type: All Transactions');
  const [currencyFilter, setCurrencyFilter] = useState('Currency: All');
  const [backLinkHovered, setBackLinkHovered] = useState(false);

  const handleToggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const handleReset = () => {
    setDateFilter('Date: Last 30 Days');
    setTypeFilter('Type: All Transactions');
    setCurrencyFilter('Currency: All');
  };

  return (
    <Router basename="/">
      <div style={styles.body}>
        <div style={styles.dashboardContainer}>
          <div style={styles.navHeader}>
            <button
              style={{
                ...styles.backLink,
                color: backLinkHovered ? '#FFFFFF' : '#8E8E93',
              }}
              onMouseEnter={() => setBackLinkHovered(true)}
              onMouseLeave={() => setBackLinkHovered(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Dashboard
            </button>
            <button
              style={styles.pillButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A3A3C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C2C2E'}
            >
              Download CSV
            </button>
          </div>

          <div>
            <h1 style={styles.textTitle}>Transaction History</h1>
            <p style={styles.textSub}>View and manage all your past activities and exchanges.</p>
          </div>

          <div style={styles.card}>
            <div style={styles.filterBar}>
              <div style={styles.filterGroup}>
                <select
                  style={styles.filterSelect}
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option>Date: Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>Last 3 Months</option>
                  <option>Custom Range</option>
                </select>
                <svg style={styles.filterChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <div style={styles.filterGroup}>
                <select
                  style={styles.filterSelect}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>Type: All Transactions</option>
                  <option>Deposits</option>
                  <option>Exchanges</option>
                  <option>Withdrawals</option>
                </select>
                <svg style={styles.filterChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <div style={styles.filterGroup}>
                <select
                  style={styles.filterSelect}
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                >
                  <option>Currency: All</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
                <svg style={styles.filterChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <button
                style={styles.pillButtonOutline}
                onClick={handleReset}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Reset Filters
              </button>
            </div>

            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Transaction</th>
                  <th style={styles.th}>Date &amp; Time</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    transaction={tx}
                    isOpen={openRow === tx.id}
                    onToggle={() => handleToggleRow(tx.id)}
                  />
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                style={styles.pillButtonTransparent}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E93'}
                onClick={() => setActivePage(Math.max(1, activePage - 1))}
              >
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  style={activePage === page ? styles.pillButtonActive : styles.pillButtonPage}
                  onClick={() => setActivePage(page)}
                  onMouseEnter={(e) => { if (activePage !== page) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { if (activePage !== page) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {page}
                </button>
              ))}
              <button
                style={styles.pillButtonTransparent}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E93'}
                onClick={() => setActivePage(Math.min(3, activePage + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;