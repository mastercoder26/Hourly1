import React, { useState } from 'react';

const styles = {
  bgBase: { backgroundColor: '#000000' },
  bgCard: { backgroundColor: '#1C1C1E' },
  bgElement: { backgroundColor: '#2C2C2E' },
  bgElementHover: { backgroundColor: '#3A3A3C' },
  textPrimary: { color: '#FFFFFF' },
  textSecondary: { color: '#8E8E93' },
  textTertiary: { color: '#636366' },
  accentGreen: { color: '#4CAF50' },
  accentRed: { color: '#F44336' },
  radiusCard: { borderRadius: '28px' },
  radiusPill: { borderRadius: '999px' },
  radiusSmall: { borderRadius: '12px' },
};

const typographyStyles = {
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
};

const PillButton = ({ children, onClick, variant = 'default', style = {} }) => {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    border: 'none',
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    WebkitFontSmoothing: 'antialiased',
  };

  const variantStyles = {
    default: {
      backgroundColor: hovered ? '#3A3A3C' : '#2C2C2E',
      color: hovered ? '#FFFFFF' : '#8E8E93',
      padding: '12px 24px',
    },
    primary: {
      backgroundColor: '#FFFFFF',
      color: '#000000',
      padding: '18px',
      width: '100%',
    },
    secondary: {
      backgroundColor: '#2C2C2E',
      color: '#FFFFFF',
      padding: '18px',
      width: '100%',
    },
    ghost: {
      backgroundColor: hovered ? '#3A3A3C' : 'transparent',
      color: hovered ? '#FFFFFF' : '#8E8E93',
      padding: '6px 12px',
      fontSize: '13px',
    },
    active: {
      backgroundColor: '#2C2C2E',
      color: '#8E8E93',
      padding: '6px 12px',
      fontSize: '13px',
    },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  );
};

const ChartBars = ({ activeRange }) => {
  const barData = [
    { height: '40%', isAccent: false },
    { height: '45%', isAccent: false },
    { height: '42%', isAccent: false },
    { height: '55%', isAccent: false },
    { height: '60%', isAccent: false },
    { height: '58%', isAccent: false },
    { height: '70%', isAccent: false },
    { height: '65%', isAccent: false },
    { height: '80%', isAccent: false },
    { height: '75%', isAccent: false },
    { height: '90%', isAccent: false },
    { height: '85%', isAccent: false },
    { height: '95%', isAccent: true },
  ];

  return (
    <div
      style={{
        height: '440px',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        paddingTop: '40px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: 0,
          right: 0,
          bottom: 0,
          borderLeft: '1px dashed #2C2C2E',
          borderBottom: '1px solid #2C2C2E',
        }}
      />
      {barData.map((bar, index) => (
        <div
          key={index}
          style={{
            height: bar.height,
            flex: 1,
            backgroundColor: bar.isAccent ? '#4CAF50' : '#2C2C2E',
            opacity: bar.isAccent ? 1 : 0.5,
            borderRadius: '4px 4px 0 0',
          }}
        />
      ))}
    </div>
  );
};

const StatGrid = () => {
  const stats = [
    { label: 'Market Cap', value: '$1.24 Trillion' },
    { label: '24h High', value: '$64,120.00' },
    { label: '24h Low', value: '$61,840.00' },
    { label: 'Volume (24h)', value: '$32.5 Billion' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        backgroundColor: '#000000',
        borderRadius: '28px',
        overflow: 'hidden',
        marginTop: '24px',
      }}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#1C1C1E',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={typographyStyles.textSub}>{stat.label}</span>
          <span style={typographyStyles.textLabel}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

const HoldingsCard = () => {
  const holdingRows = [
    { label: 'Average Cost', value: '$42,150.00', valueStyle: typographyStyles.textLabel },
    { label: 'Total Return', value: '+$9,482.50 (+49.8%)', valueStyle: { ...typographyStyles.textLabel, color: '#4CAF50' } },
    { label: 'Portfolio Share', value: '21.5%', valueStyle: typographyStyles.textLabel },
  ];

  return (
    <div
      style={{
        backgroundColor: '#1C1C1E',
        borderRadius: '28px',
        padding: '32px',
      }}
    >
      <span style={{ ...typographyStyles.textHeader, display: 'block', marginBottom: '24px' }}>
        Your BTC Holdings
      </span>
      <div>
        <span style={typographyStyles.textValueLarge}>0.4500 BTC</span>
        <div style={{ ...typographyStyles.textSub, color: '#8E8E93', marginTop: '4px' }}>≈ $28,450.00</div>
      </div>

      <div style={{ marginTop: '32px' }}>
        {holdingRows.map((row, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: index === holdingRows.length - 1 ? '16px 0 0 0' : '16px 0',
              borderBottom: index === holdingRows.length - 1 ? 'none' : '1px solid #2C2C2E',
            }}
          >
            <span style={typographyStyles.textCaption}>{row.label}</span>
            <span style={row.valueStyle}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TradeCard = () => {
  const [buyHovered, setBuyHovered] = useState(false);
  const [sellHovered, setSellHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#1C1C1E',
        borderRadius: '28px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span style={{ ...typographyStyles.textHeader, marginBottom: '16px' }}>Trade Bitcoin</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <button
          onMouseEnter={() => setBuyHovered(true)}
          onMouseLeave={() => setBuyHovered(false)}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: buyHovered ? '#E0E0E0' : '#FFFFFF',
            color: '#000000',
            border: 'none',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Buy BTC
        </button>
        <button
          onMouseEnter={() => setSellHovered(true)}
          onMouseLeave={() => setSellHovered(false)}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: sellHovered ? '#3A3A3C' : '#2C2C2E',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Sell BTC
        </button>
      </div>
      <div style={{ marginTop: '24px', padding: '0 8px' }}>
        <span style={typographyStyles.textCaption}>
          Trades are executed instantly. Network fees may apply for external transfers.
        </span>
      </div>
    </div>
  );
};

const ActivityCard = () => {
  const activities = [
    { action: 'Bought BTC', date: 'Mar 12, 2024', amount: '+$1,500.00' },
    { action: 'Bought BTC', date: 'Jan 15, 2024', amount: '+$2,000.00' },
  ];

  return (
    <div
      style={{
        backgroundColor: '#1C1C1E',
        borderRadius: '28px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span style={{ ...typographyStyles.textHeader, marginBottom: '16px' }}>Recent BTC Activity</span>
      <div>
        {activities.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={typographyStyles.textLabel}>{item.action}</span>
              <span style={typographyStyles.textCaption}>{item.date}</span>
            </div>
            <span style={typographyStyles.textLabel}>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [activeRange, setActiveRange] = useState('1W');
  const [backHovered, setBackHovered] = useState(false);

  const timeRanges = ['1H', '1D', '1W', '1M', '1Y'];

  return (
    <div
      style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        minHeight: '100vh',
        padding: '40px',
        display: 'flex',
        justifyContent: 'center',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1400px',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Back Nav */}
          <a
            href="#"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
              cursor: 'pointer',
              color: backHovered ? '#FFFFFF' : '#8E8E93',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span style={typographyStyles.textLabel}>Back to Portfolio</span>
          </a>

          {/* Asset Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#F7931A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '24px',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                ₿
              </div>
              <div>
                <h1 style={typographyStyles.textValueHuge}>Bitcoin</h1>
                <span style={typographyStyles.textSub}>BTC · $63,241.50</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ ...typographyStyles.textValueLarge, color: '#4CAF50' }}>+4.28%</span>
              <div style={typographyStyles.textSub}>Past 24 Hours</div>
            </div>
          </div>

          {/* Price History Card */}
          <div
            style={{
              backgroundColor: '#1C1C1E',
              borderRadius: '28px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <span style={typographyStyles.textHeader}>Price History</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      backgroundColor: activeRange === range ? '#2C2C2E' : 'transparent',
                      color: activeRange === range ? '#8E8E93' : '#8E8E93',
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <ChartBars activeRange={activeRange} />
          </div>

          {/* Stat Grid */}
          <StatGrid />
        </div>

        {/* Side Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'sticky',
            top: '40px',
          }}
        >
          <HoldingsCard />
          <TradeCard />
          <ActivityCard />
        </div>
      </div>
    </div>
  );
};

export default App;