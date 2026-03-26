import React, { useState, useEffect } from 'react';

const customStyles = {
  root: {
    '--bg-base': '#000000',
    '--bg-card': '#1C1C1E',
    '--bg-element': '#2C2C2E',
    '--bg-element-hover': '#3A3A3C',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#8E8E93',
    '--text-tertiary': '#636366',
    '--btc-color': '#F7931A',
    '--eth-color': '#627EEA',
    '--sol-color': '#14F195',
    '--cash-color': '#FFFFFF',
  }
};

const DonutChart = () => (
  <svg width="280" height="280" style={{ transform: 'rotate(-90deg)' }}>
    <circle cx="140" cy="140" r="110" fill="transparent" stroke="#2C2C2E" strokeWidth="24" />
    <circle cx="140" cy="140" r="110" fill="transparent" stroke="#F7931A" strokeWidth="24" strokeLinecap="round" strokeDasharray="276 691" strokeDashoffset="0" />
    <circle cx="140" cy="140" r="110" fill="transparent" stroke="#627EEA" strokeWidth="24" strokeLinecap="round" strokeDasharray="172 691" strokeDashoffset="-276" />
    <circle cx="140" cy="140" r="110" fill="transparent" stroke="#14F195" strokeWidth="24" strokeLinecap="round" strokeDasharray="103 691" strokeDashoffset="-448" />
    <circle cx="140" cy="140" r="110" fill="transparent" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeDasharray="140 691" strokeDashoffset="-551" />
  </svg>
);

const LegendItem = ({ color, label, percentage }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
      <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>{label}</span>
    </div>
    <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>{percentage}</span>
  </div>
);

const SuggestionIcon = ({ type }) => (
  <div style={{
    width: '20px', height: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: '2px'
  }}>
    {type === 'sell' ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F44336" strokeWidth="3">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )}
  </div>
);

const AllocationCard = () => (
  <div style={{
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
      <div>
        <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#8E8E93' }}>Portfolio Strategy</span>
        <h1 style={{ fontSize: '32px', fontWeight: 500, letterSpacing: '-0.5px', color: '#FFFFFF', marginTop: '8px' }}>Asset Allocation</h1>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <PillButton onClick={() => {}}>Export Data</PillButton>
        <PillButton onClick={() => {}}>View History</PillButton>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', padding: '20px 0' }}>
      <div style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto' }}>
        <DonutChart />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 400, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.2px' }}>Total value</span>
          <div style={{ fontSize: '24px', fontWeight: 500, letterSpacing: '-0.5px', color: '#FFFFFF' }}>$142.5k</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LegendItem color="#F7931A" label="Bitcoin (BTC)" percentage="40%" />
        <LegendItem color="#627EEA" label="Ethereum (ETH)" percentage="25%" />
        <LegendItem color="#14F195" label="Solana (SOL)" percentage="15%" />
        <LegendItem color="#FFFFFF" label="Cash (USD/EUR)" percentage="20%" />
      </div>
    </div>
  </div>
);

const AllocationDetailsCard = () => (
  <div style={{ backgroundColor: '#1C1C1E', borderRadius: '28px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#8E8E93', marginBottom: '24px' }}>Allocation Details</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #000000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>High Performance Assets</span>
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5 }}>BTC, SOL showing high relative strength compared to your average.</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>55% Total</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>Risk Tolerance</span>
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5 }}>Portfolio currently categorized as "Aggressive Growth".</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#4CAF50' }}>Optimal</span>
        </div>
      </div>
    </div>
  </div>
);

const PillButton = ({ children, onClick, primary, style }) => {
  const [hovered, setHovered] = useState(false);
  const base = {
    backgroundColor: primary ? '#FFFFFF' : '#2C2C2E',
    color: primary ? '#000000' : '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    textAlign: 'center',
    ...style,
  };
  const hoverStyle = primary
    ? { ...base, opacity: 0.9 }
    : { ...base, backgroundColor: '#3A3A3C' };

  return (
    <button
      style={hovered ? hoverStyle : base}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

const RebalanceSuggestionCard = ({ onApply, onIgnore }) => (
  <div style={{
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255,255,255,0.1)'
  }}>
    <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '20px' }}>✨ Rebalance Suggestion</span>
    <p style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5, marginBottom: '24px' }}>
      Your SOL allocation has increased by 5% due to price appreciation. Consider rebalancing to maintain your risk profile.
    </p>

    <div style={{ backgroundColor: '#2C2C2E', borderRadius: '20px', padding: '24px', marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
        <SuggestionIcon type="sell" />
        <div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>Sell 120.5 SOL</span>
          <div style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5, marginTop: '2px' }}>Approx. $2,450.00</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <SuggestionIcon type="buy" />
        <div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>Buy 0.04 BTC</span>
          <div style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5, marginTop: '2px' }}>Approx. $2,450.00</div>
        </div>
      </div>
    </div>

    <PillButton primary onClick={onApply} style={{ marginTop: '24px', width: '100%', padding: '12px 24px', fontSize: '15px' }}>
      Apply Smart Rebalance
    </PillButton>
    <PillButton onClick={onIgnore} style={{ marginTop: '12px', width: '100%', padding: '12px 24px', fontSize: '15px', backgroundColor: 'transparent', border: '1px solid #2C2C2E' }}>
      Ignore Suggestion
    </PillButton>
  </div>
);

const AssetDriftsCard = () => (
  <div style={{ backgroundColor: '#1C1C1E', borderRadius: '28px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#8E8E93', marginBottom: '16px' }}>Asset Drifts</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5 }}>SOL Target: 10%</span>
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#F44336', lineHeight: 1.5 }}>+5.0% Drift</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: '#2C2C2E', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '75%', height: '100%', background: '#14F195' }} />
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5 }}>BTC Target: 42%</span>
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#8E8E93', lineHeight: 1.5 }}>-2.0% Drift</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: '#2C2C2E', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '40%', height: '100%', background: '#F7931A' }} />
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [rebalanceVisible, setRebalanceVisible] = useState(true);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      body { background-color: #000000; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleApply = () => {
    setApplySuccess(true);
    setRebalanceVisible(false);
  };

  const handleIgnore = () => {
    setRebalanceVisible(false);
  };

  return (
    <div style={{
      backgroundColor: '#000000',
      color: '#FFFFFF',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
      padding: '40px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '24px',
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AllocationCard />
          <AllocationDetailsCard />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '40px' }}>
          {applySuccess && (
            <div style={{
              backgroundColor: '#1C1C1E',
              borderRadius: '28px',
              padding: '24px',
              border: '1px solid rgba(76,175,80,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>Rebalance applied successfully!</span>
            </div>
          )}

          {rebalanceVisible && (
            <RebalanceSuggestionCard onApply={handleApply} onIgnore={handleIgnore} />
          )}

          {!rebalanceVisible && !applySuccess && (
            <div style={{
              backgroundColor: '#1C1C1E',
              borderRadius: '28px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '13px', color: '#8E8E93', textAlign: 'center' }}>No pending rebalance suggestions.</span>
              <PillButton onClick={() => setRebalanceVisible(true)} style={{ padding: '10px 20px', fontSize: '14px' }}>
                Check Again
              </PillButton>
            </div>
          )}

          <AssetDriftsCard />
        </div>
      </div>
    </div>
  );
};

export default App;