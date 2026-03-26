import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
    boxSizing: 'border-box',
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
    opacity: 0.6,
  },
  metricCardActive: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    opacity: 1,
    border: '1px dashed #3A3A3C',
  },
  textHeader: {
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#8E8E93',
  },
  textValueHuge: {
    fontSize: '48px',
    fontWeight: 400,
    letterSpacing: '-1px',
    color: '#FFFFFF',
    lineHeight: 1.1,
  },
  textValueLarge: {
    fontSize: '32px',
    fontWeight: 500,
    letterSpacing: '-0.5px',
    color: '#FFFFFF',
  },
  textLabel: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#FFFFFF',
  },
  textSub: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: '0.2px',
  },
  textCaption: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#8E8E93',
    lineHeight: 1.5,
  },
  chartCard: {
    minHeight: '400px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartBgOverlay: {
    position: 'absolute',
    bottom: '32px',
    left: '32px',
    right: '32px',
    top: '100px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    opacity: 0.05,
    pointerEvents: 'none',
  },
  chartBar: {
    flex: 1,
    backgroundColor: '#8E8E93',
    borderRadius: '4px 4px 0 0',
  },
  emptyStateContent: {
    textAlign: 'center',
    maxWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    background: '#2C2C2E',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  pillButton: {
    backgroundColor: '#2C2C2E',
    color: '#8E8E93',
    border: 'none',
    borderRadius: '999px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  pillButtonPrimary: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    border: 'none',
    borderRadius: '999px',
    padding: '18px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  pillButtonPrimarySmall: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    border: 'none',
    borderRadius: '999px',
    padding: '12px 32px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    width: 'auto',
  },
  pillButtonSecondary: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
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
    opacity: 0.5,
  },
  onboardingStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#2C2C2E',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  stepNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1.5px solid #8E8E93',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#8E8E93',
    flexShrink: 0,
  },
  stepNumberCompleted: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#4CAF50',
    border: '1.5px solid #4CAF50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: 'white',
    flexShrink: 0,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  quickActionsCard: {
    padding: '24px',
    border: '1px solid #2C2C2E',
    display: 'flex',
    flexDirection: 'column',
  },
  exchangeWidget: {
    background: 'transparent',
    padding: 0,
    gap: '8px',
    opacity: 0.5,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    borderRadius: '28px',
  },
  exchangeInnerCard: {
    opacity: 0.4,
    pointerEvents: 'none',
    padding: '28px',
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    display: 'flex',
    flexDirection: 'column',
  },
};

const chartBarHeights = ['15%', '10%', '12%', '8%', '14%', '11%', '16%', '9%'];

const MetricCard = ({ label, value, caption, active }) => {
  const cardStyle = active
    ? { ...styles.card, ...styles.metricCardActive }
    : { ...styles.card, ...styles.metricCard };
  return (
    <div style={cardStyle}>
      <span style={styles.textSub}>{label}</span>
      {label === 'Total Balance' ? (
        <span style={styles.textValueHuge}>{value}</span>
      ) : (
        <span style={styles.textValueLarge}>{value}</span>
      )}
      <span style={styles.textCaption}>{caption}</span>
    </div>
  );
};

const OnboardingStep = ({ number, completed, title, description }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.onboardingStep,
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        background: hovered ? '#3A3A3C' : '#2C2C2E',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={completed ? styles.stepNumberCompleted : styles.stepNumber}>
        {completed ? '✓' : number}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={styles.textLabel}>{title}</span>
        <span style={styles.textCaption}>{description}</span>
      </div>
    </div>
  );
};

const DepositModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setAmount('');
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.card,
          width: '400px',
          gap: '20px',
          padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...styles.textHeader }}>Deposit Funds</span>
          <button
            onClick={onClose}
            style={{
              ...styles.iconButton,
              opacity: 1,
              fontSize: '18px',
              color: '#8E8E93',
            }}
          >
            ✕
          </button>
        </div>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#4CAF50', fontSize: '15px', fontWeight: 500 }}>
            ✓ Deposit initiated successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={styles.textCaption}>Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={{
                  backgroundColor: '#2C2C2E',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: 400,
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                ...styles.pillButtonPrimary,
                opacity: amount && parseFloat(amount) > 0 ? 1 : 0.5,
              }}
            >
              Confirm Deposit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const LinkBankModal = ({ isOpen, onClose }) => {
  const [bankName, setBankName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bankName && accountNum) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setBankName('');
        setAccountNum('');
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.card,
          width: '400px',
          gap: '20px',
          padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={styles.textHeader}>Link Bank Account</span>
          <button
            onClick={onClose}
            style={{ ...styles.iconButton, opacity: 1, fontSize: '18px', color: '#8E8E93' }}
          >
            ✕
          </button>
        </div>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#4CAF50', fontSize: '15px', fontWeight: 500 }}>
            ✓ Bank account linked successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={styles.textCaption}>Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Chase, Wells Fargo"
                style={{
                  backgroundColor: '#2C2C2E',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={styles.textCaption}>Account Number</label>
              <input
                type="text"
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
                placeholder="••••••••"
                style={{
                  backgroundColor: '#2C2C2E',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                ...styles.pillButtonPrimary,
                opacity: bankName && accountNum ? 1 : 0.5,
              }}
            >
              Link Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [depositOpen, setDepositOpen] = useState(false);
  const [linkBankOpen, setLinkBankOpen] = useState(false);
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);
  const [depositSmallHovered, setDepositSmallHovered] = useState(false);

  return (
    <div style={styles.body}>
      <div style={styles.dashboard}>
        <div style={styles.mainColumn}>
          <div style={styles.overviewGrid}>
            <MetricCard label="Total Balance" value="$0.00" caption="No activity yet" />
            <MetricCard label="Available Cash" value="$0.00" caption="0 funds available" />
            <MetricCard label="24h Volume" value="$0.00" caption="0 transactions" />
          </div>

          <div style={{ ...styles.card, ...styles.chartCard }}>
            <div style={styles.chartBgOverlay}>
              {chartBarHeights.map((h, i) => (
                <div key={i} style={{ ...styles.chartBar, height: h }} />
              ))}
            </div>
            <div style={styles.emptyStateContent}>
              <div style={styles.emptyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              </div>
              <span style={{ fontSize: '17px', fontWeight: 500, color: '#FFFFFF' }}>Your portfolio is empty</span>
              <p style={{ ...styles.textCaption, marginBottom: '8px' }}>
                Add funds to start tracking your performance and market movements in real-time.
              </p>
              <button
                style={{
                  ...styles.pillButtonPrimarySmall,
                  backgroundColor: depositSmallHovered ? '#E5E5E5' : '#FFFFFF',
                }}
                onMouseEnter={() => setDepositSmallHovered(true)}
                onMouseLeave={() => setDepositSmallHovered(false)}
                onClick={() => setDepositOpen(true)}
              >
                Deposit Funds
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={styles.textHeader}>Get Started</span>
            </div>
            <div style={styles.listContainer}>
              <OnboardingStep
                completed
                title="Verify Identity"
                description="Your account is verified and ready."
              />
              <OnboardingStep
                number="2"
                title="Add funds to get started"
                description="Connect a bank account or card to deposit."
              />
              <OnboardingStep
                number="3"
                title="Make your first trade"
                description="Buy Bitcoin, Ethereum, or swap currencies."
              />
            </div>
          </div>
        </div>

        <div style={styles.sideColumn}>
          <div style={{ ...styles.card, ...styles.quickActionsCard }}>
            <span style={{ ...styles.textHeader, marginBottom: '20px', display: 'block' }}>Quick Actions</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                style={{
                  ...styles.pillButtonPrimary,
                  backgroundColor: primaryHovered ? '#E5E5E5' : '#FFFFFF',
                }}
                onMouseEnter={() => setPrimaryHovered(true)}
                onMouseLeave={() => setPrimaryHovered(false)}
                onClick={() => setDepositOpen(true)}
              >
                Deposit Cash
              </button>
              <button
                style={{
                  ...styles.pillButtonSecondary,
                  backgroundColor: secondaryHovered ? '#3A3A3C' : '#2C2C2E',
                  color: secondaryHovered ? '#FFFFFF' : '#FFFFFF',
                }}
                onMouseEnter={() => setSecondaryHovered(true)}
                onMouseLeave={() => setSecondaryHovered(false)}
                onClick={() => setLinkBankOpen(true)}
              >
                Link Bank Account
              </button>
            </div>
          </div>

          <div style={styles.exchangeWidget}>
            <div style={styles.exchangeInnerCard}>
              <div style={{ ...styles.textHeader, marginBottom: '16px' }}>Exchange</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>USD</span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>0.00</span>
              </div>
              <span style={styles.textSub}>Balance $0.00</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '-10px 0', zIndex: 2 }}>
              <div style={styles.iconButton}>↓</div>
            </div>

            <div style={styles.exchangeInnerCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>EUR</span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>0.00</span>
              </div>
              <span style={styles.textSub}>Balance €0.00</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={styles.textHeader}>Recent Activity</span>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={styles.textCaption}>No transactions yet.</span>
            </div>
          </div>
        </div>
      </div>

      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
      <LinkBankModal isOpen={linkBankOpen} onClose={() => setLinkBankOpen(false)} />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #000000; }
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }
    `;
    document.head.appendChild(globalStyle);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(globalStyle);
    };
  }, []);

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;