import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const customStyles = {
  root: {
    '--bg-base': '#000000',
    '--bg-card': '#1C1C1E',
    '--bg-element': '#2C2C2E',
    '--bg-element-hover': '#3A3A3C',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#8E8E93',
    '--text-tertiary': '#636366',
  },
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
  dashboard: {
    width: '100%',
    maxWidth: '1400px',
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px',
    alignItems: 'start',
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sideColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'sticky',
    top: '40px',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  textHeader: {
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#8E8E93',
  },
  textValueHuge: {
    fontSize: '48px',
    fontWeight: '400',
    letterSpacing: '-1px',
    color: '#FFFFFF',
    lineHeight: '1.1',
  },
  textValueLarge: {
    fontSize: '32px',
    fontWeight: '500',
    letterSpacing: '-0.5px',
    color: '#FFFFFF',
  },
  textValueMedium: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  textLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  textSub: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: '0.2px',
  },
  textCaption: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: '1.5',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  metricCard: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  chartCard: {
    minHeight: '400px',
  },
  chartPlaceholder: {
    flexGrow: '1',
    display: 'flex',
    alignItems: 'flex-end',
    paddingTop: '40px',
    gap: '8px',
  },
  chartBar: {
    flex: '1',
    backgroundColor: '#2C2C2E',
    borderRadius: '4px 4px 0 0',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #000000',
  },
  listItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  listIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '999px',
    backgroundColor: '#2C2C2E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  listText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  pillButton: {
    backgroundColor: '#2C2C2E',
    color: '#8E8E93',
    border: 'none',
    borderRadius: '999px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
  pillButtonPrimary: {
    backgroundColor: '#2C2C2E',
    color: '#8E8E93',
    border: 'none',
    borderRadius: '999px',
    width: '100%',
    padding: '16px',
    marginTop: '32px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#2C2C2E',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    transition: 'background-color 0.2s',
    flexShrink: 0,
  },
  exchangeWidget: {
    background: 'transparent',
    padding: '0',
    gap: '8px',
    backgroundColor: 'transparent',
  },
  exchangeBlock: {
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'relative',
  },
  exchangeHeader: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  currencyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencySelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  currencyCode: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  exchangeDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px',
    margin: '-4px 0',
    zIndex: 10,
  },
  ratePill: {
    backgroundColor: '#2C2C2E',
    padding: '10px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#FFFFFF',
    flexGrow: 1,
  },
  exchangeFooter: {
    backgroundColor: 'transparent',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  feeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#2C2C2E',
    color: '#8E8E93',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '600',
    fontFamily: 'serif',
    flexShrink: 0,
    marginTop: '2px',
  },
};

const ChartBar = ({ height }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...customStyles.chartBar,
        height: height,
        backgroundColor: hovered ? '#8E8E93' : '#2C2C2E',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
};

const PillButton = ({ children, style, onClick, transparent }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...customStyles.pillButton,
        ...(transparent ? { background: 'transparent' } : {}),
        ...(hovered ? { backgroundColor: '#3A3A3C', color: '#FFFFFF' } : {}),
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const IconButton = ({ children, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...customStyles.iconButton,
        backgroundColor: hovered ? '#3A3A3C' : '#2C2C2E',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const MetricsSection = () => (
  <div style={customStyles.overviewGrid}>
    <div style={{ ...customStyles.card, ...customStyles.metricCard }}>
      <span style={customStyles.textSub}>Total Balance</span>
      <span style={customStyles.textValueHuge}>$142,500.00</span>
      <span style={customStyles.textCaption}>+2.4% today</span>
    </div>
    <div style={{ ...customStyles.card, ...customStyles.metricCard }}>
      <span style={customStyles.textSub}>Available Cash</span>
      <span style={customStyles.textValueLarge}>$36,200.00</span>
      <span style={{ ...customStyles.textCaption, color: '#8E8E93' }}>Ready to trade</span>
    </div>
    <div style={{ ...customStyles.card, ...customStyles.metricCard }}>
      <span style={customStyles.textSub}>24h Volume</span>
      <span style={customStyles.textValueLarge}>$12,450.00</span>
      <span style={{ ...customStyles.textCaption, color: '#8E8E93' }}>8 transactions</span>
    </div>
  </div>
);

const ChartSection = () => {
  const [activeRange, setActiveRange] = useState('1M');
  const bars = [
    { height: '30%' },
    { height: '45%' },
    { height: '35%' },
    { height: '60%' },
    { height: '50%' },
    { height: '75%' },
    { height: '65%' },
    { height: '85%' },
    { height: '70%' },
    { height: '90%' },
    { height: '100%' },
  ];

  return (
    <div style={{ ...customStyles.card, ...customStyles.chartCard }}>
      <div style={customStyles.cardHeader}>
        <span style={customStyles.textHeader}>Portfolio Performance</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['1W', '1M', '1Y'].map((range) => (
            <PillButton
              key={range}
              style={{ padding: '6px 12px', fontSize: '13px' }}
              transparent={activeRange !== range}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </PillButton>
          ))}
        </div>
      </div>
      <div style={customStyles.chartPlaceholder}>
        {bars.map((bar, i) => (
          <ChartBar key={i} height={bar.height} />
        ))}
      </div>
    </div>
  );
};

const AssetsSection = () => {
  const assets = [
    { code: 'BTC', name: 'Bitcoin', amount: '0.45 BTC', value: '$28,450.00', change: '+5.2%', positive: true },
    { code: 'ETH', name: 'Ethereum', amount: '12.5 ETH', value: '$22,100.00', change: '+1.8%', positive: true },
    { code: 'SOL', name: 'Solana', amount: '450 SOL', value: '$9,450.00', change: '-2.1%', positive: false },
  ];

  return (
    <div style={customStyles.card}>
      <div style={customStyles.cardHeader}>
        <span style={customStyles.textHeader}>Your Assets</span>
      </div>
      <div style={customStyles.listContainer}>
        {assets.map((asset, i) => (
          <div
            key={asset.code}
            style={{
              ...customStyles.listItem,
              ...(i === assets.length - 1 ? { borderBottom: 'none', paddingBottom: '0' } : {}),
            }}
          >
            <div style={customStyles.listItemLeft}>
              <div style={customStyles.listIcon}>{asset.code}</div>
              <div style={customStyles.listText}>
                <span style={customStyles.textLabel}>{asset.name}</span>
                <span style={customStyles.textSub}>{asset.amount}</span>
              </div>
            </div>
            <div style={{ ...customStyles.listText, textAlign: 'right' }}>
              <span style={customStyles.textValueMedium}>{asset.value}</span>
              <span style={{ ...customStyles.textCaption, color: asset.positive ? '#4CAF50' : '#F44336' }}>
                {asset.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExchangeWidget = () => {
  const [amount, setAmount] = useState('1');
  const rate = 0.9049;
  const converted = (parseFloat(amount) * rate).toFixed(2);

  return (
    <div style={{ ...customStyles.card, ...customStyles.exchangeWidget }}>
      <div style={customStyles.exchangeBlock}>
        <div style={customStyles.exchangeHeader}>
          <span style={customStyles.textHeader}>Exchange</span>
        </div>
        <div style={customStyles.currencyRow}>
          <div style={customStyles.currencySelector}>
            <span style={customStyles.currencyCode}>USD</span>
            <svg style={{ width: '12px', height: '12px', fill: 'none', stroke: '#8E8E93', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              ...customStyles.textValueLarge,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              textAlign: 'right',
              width: '120px',
              color: '#FFFFFF',
            }}
          />
        </div>
        <span style={customStyles.textSub}>Balance $36,200.00</span>
      </div>

      <div style={customStyles.exchangeDivider}>
        <IconButton>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </IconButton>
        <div style={customStyles.ratePill}>
          $1 = €{rate} <span style={{ color: '#8E8E93' }}>US dollars in Euro</span>
        </div>
      </div>

      <div style={customStyles.exchangeBlock}>
        <div style={customStyles.currencyRow}>
          <div style={customStyles.currencySelector}>
            <span style={customStyles.currencyCode}>EUR</span>
            <svg style={{ width: '12px', height: '12px', fill: 'none', stroke: '#8E8E93', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <span style={customStyles.textValueLarge}>{isNaN(converted) ? '0.00' : converted}</span>
        </div>
        <span style={customStyles.textSub}>Balance €10,586.00</span>
      </div>

      <div style={customStyles.exchangeFooter}>
        <div style={customStyles.feeRow}>
          <span style={{ ...customStyles.textLabel, color: '#8E8E93' }}>Aditional Fee</span>
          <span style={customStyles.textLabel}>$0</span>
        </div>

        <div style={customStyles.infoBox}>
          <div style={customStyles.infoIcon}>i</div>
          <span style={customStyles.textCaption}>
            Our fees include a fee to exchange uncommon currencies or outside market hours. You can find out more in our fees page and confirm exact fees at the time of transaction
          </span>
        </div>

        <button
          style={customStyles.pillButtonPrimary}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3A3A3C'; e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2C2C2E'; e.currentTarget.style.color = '#8E8E93'; }}
        >
          Exchange →
        </button>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    { label: 'Exchanged USD to EUR', time: 'Today, 14:32', amount: '-$1,000.00', positive: false },
    { label: 'Deposit', time: 'Yesterday, 09:15', amount: '+$5,000.00', positive: true },
  ];

  return (
    <div style={customStyles.card}>
      <div style={{ ...customStyles.cardHeader, marginBottom: '16px' }}>
        <span style={customStyles.textHeader}>Recent Activity</span>
      </div>
      <div style={customStyles.listContainer}>
        {activities.map((activity, i) => (
          <div
            key={i}
            style={{
              ...customStyles.listItem,
              padding: '8px 0',
              ...(i === activities.length - 1 ? { borderBottom: 'none' } : {}),
            }}
          >
            <div style={customStyles.listText}>
              <span style={customStyles.textLabel}>{activity.label}</span>
              <span style={customStyles.textCaption}>{activity.time}</span>
            </div>
            <span style={{ ...customStyles.textLabel, color: '#FFFFFF' }}>{activity.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => (
  <div style={customStyles.dashboard}>
    <div style={customStyles.mainColumn}>
      <MetricsSection />
      <ChartSection />
      <AssetsSection />
    </div>
    <div style={customStyles.sideColumn}>
      <ExchangeWidget />
      <RecentActivity />
    </div>
  </div>
);

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { margin: 0; }
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router basename="/">
      <div style={customStyles.body}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;