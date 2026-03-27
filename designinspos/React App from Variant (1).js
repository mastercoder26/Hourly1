import React, { useState } from 'react';

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
    boxSizing: 'border-box',
  },
  dashboardContainer: {
    width: '100%',
    maxWidth: '1200px',
    display: 'grid',
    gridTemplateColumns: '1fr 420px',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  viewTitle: {
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    background: '#2C2C2E',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    background: '#2C2C2E',
    padding: '6px',
    borderRadius: '999px',
    marginBottom: '32px',
    width: 'fit-content',
  },
  tabBtn: {
    padding: '10px 24px',
    borderRadius: '999px',
    border: 'none',
    background: 'transparent',
    color: '#8E8E93',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  tabBtnActive: {
    padding: '10px 24px',
    borderRadius: '999px',
    border: 'none',
    background: '#1C1C1E',
    color: '#FFFFFF',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  inputGroup: {
    marginBottom: '32px',
  },
  textHeader: {
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#8E8E93',
  },
  amountInputWrapper: {
    background: '#2C2C2E',
    borderRadius: '28px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px',
  },
  amountDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  currencySymbol: {
    fontSize: '32px',
    color: '#8E8E93',
  },
  rawInput: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '48px',
    fontWeight: '400',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textSub: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#8E8E93',
  },
  methodSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px',
  },
  methodOption: {
    background: '#2C2C2E',
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'background 0.2s',
    border: '2px solid transparent',
  },
  methodOptionSelected: {
    background: '#3A3A3C',
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'background 0.2s',
    border: '2px solid #636366',
  },
  methodInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  methodIcon: {
    width: '44px',
    height: '44px',
    background: '#1C1C1E',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  radioCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #636366',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDot: {
    width: '10px',
    height: '10px',
    background: '#FFFFFF',
    borderRadius: '50%',
  },
  infoPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    gap: '16px',
  },
  infoDot: {
    color: '#8E8E93',
    marginTop: '2px',
    flexShrink: 0,
  },
  textCaption: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: '1.5',
  },
  summaryHeader: {
    marginBottom: '24px',
  },
  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #2C2C2E',
  },
  summaryRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
  },
  totalRow: {
    marginTop: '8px',
    padding: '20px',
    background: '#2C2C2E',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRowLabel: {
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#8E8E93',
    marginBottom: '0',
  },
  totalRowValue: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  pillButtonPrimary: {
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '999px',
    padding: '18px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    marginTop: '24px',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  pillButton: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '18px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    marginTop: '24px',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  disclaimerWrapper: {
    marginTop: '32px',
    textAlign: 'center',
  },
};

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [amount, setAmount] = useState('2,500.00');
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const networkFee = '0.00';
  const estimatedArrival = selectedMethod === 'card' ? 'Instant' : '1-3 business days';

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  };

  const handleCancel = () => {
    setCancelled(true);
    setAmount('0.00');
    setSelectedMethod('card');
    setTimeout(() => setCancelled(false), 2000);
  };

  return (
    <div style={styles.body}>
      <div style={styles.dashboardContainer}>
        {/* Main Column */}
        <div>
          <div style={styles.card}>
            <div style={styles.viewTitle}>
              <button style={styles.backBtn}>
                <BackIcon />
              </button>
              Transfer Funds
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              <button
                style={activeTab === 'deposit' ? styles.tabBtnActive : styles.tabBtn}
                onClick={() => setActiveTab('deposit')}
              >
                Deposit
              </button>
              <button
                style={activeTab === 'withdraw' ? styles.tabBtnActive : styles.tabBtn}
                onClick={() => setActiveTab('withdraw')}
              >
                Withdraw
              </button>
            </div>

            {/* Amount Input */}
            <div style={styles.inputGroup}>
              <span style={styles.textHeader}>
                {activeTab === 'deposit' ? 'Amount to Deposit' : 'Amount to Withdraw'}
              </span>
              <div style={styles.amountInputWrapper}>
                <div style={styles.amountDisplay}>
                  <span style={styles.currencySymbol}>$</span>
                  <input
                    type="text"
                    style={styles.rawInput}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    autoFocus
                  />
                </div>
                <span style={styles.textSub}>Available: $36,200.00</span>
              </div>
            </div>

            {/* Payment Method */}
            <div style={styles.inputGroup}>
              <span style={styles.textHeader}>Payment Method</span>
              <div style={styles.methodSelector}>
                <div
                  style={selectedMethod === 'card' ? styles.methodOptionSelected : styles.methodOption}
                  onClick={() => setSelectedMethod('card')}
                >
                  <div style={styles.methodInfo}>
                    <div style={styles.methodIcon}>
                      <CardIcon />
                    </div>
                    <div>
                      <p style={styles.textLabel}>Visa Card •••• 4242</p>
                      <p style={styles.textSub}>Instant deposit</p>
                    </div>
                  </div>
                  <div style={styles.radioCircle}>
                    {selectedMethod === 'card' && <div style={styles.radioDot}></div>}
                  </div>
                </div>

                <div
                  style={selectedMethod === 'bank' ? styles.methodOptionSelected : styles.methodOption}
                  onClick={() => setSelectedMethod('bank')}
                >
                  <div style={styles.methodInfo}>
                    <div style={styles.methodIcon}>
                      <BankIcon />
                    </div>
                    <div>
                      <p style={styles.textLabel}>Bank Transfer (ACH)</p>
                      <p style={styles.textSub}>1-3 business days</p>
                    </div>
                  </div>
                  <div style={styles.radioCircle}>
                    {selectedMethod === 'bank' && <div style={styles.radioDot}></div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div style={styles.infoPanel}>
              <div style={styles.infoDot}>
                <InfoIcon />
              </div>
              <span style={styles.textCaption}>
                {selectedMethod === 'card'
                  ? 'Deposits via linked cards are processed instantly. Bank transfers may take longer depending on your financial institution\'s processing times.'
                  : 'Bank transfers (ACH) typically take 1-3 business days to process. Ensure your bank details are correct before proceeding.'}
              </span>
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div>
          <div style={styles.card}>
            <div style={styles.summaryHeader}>
              <span style={styles.textHeader}>Transaction Summary</span>
            </div>

            <div style={styles.summaryList}>
              <div style={styles.summaryRow}>
                <span style={styles.textSub}>{activeTab === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}</span>
                <span style={styles.textLabel}>${amount || '0.00'}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.textSub}>Network Fee</span>
                <span style={styles.textLabel}>${networkFee}</span>
              </div>
              <div style={styles.summaryRowLast}>
                <span style={styles.textSub}>Estimated Arrival</span>
                <span style={styles.textLabel}>{estimatedArrival}</span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalRowLabel}>You will receive</span>
                <span style={styles.totalRowValue}>${amount || '0.00'}</span>
              </div>
            </div>

            {confirmed && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.15)',
                border: '1px solid #4CAF50',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                marginBottom: '8px',
                color: '#4CAF50',
                fontSize: '14px',
                fontWeight: '500',
              }}>
                ✓ {activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'} confirmed successfully!
              </div>
            )}

            {cancelled && (
              <div style={{
                background: 'rgba(255, 59, 48, 0.1)',
                border: '1px solid rgba(255, 59, 48, 0.4)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                marginBottom: '8px',
                color: '#FF3B30',
                fontSize: '14px',
                fontWeight: '500',
              }}>
                Transaction cancelled.
              </div>
            )}

            <button
              style={styles.pillButtonPrimary}
              onClick={handleConfirm}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E5E5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              {activeTab === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
            </button>
            <button
              style={styles.pillButton}
              onClick={handleCancel}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A3A3C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2C2C2E'}
            >
              Cancel
            </button>

            <div style={styles.disclaimerWrapper}>
              <p style={styles.textCaption}>
                By confirming, you agree to our terms of service and acknowledge the transfer of funds from your selected source.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;