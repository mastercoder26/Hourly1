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
    '--accent-green': '#4CAF50',
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
  dashboardContainer: {
    width: '100%',
    maxWidth: '1200px',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '40px',
  },
  textHeader: {
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#8E8E93',
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
  settingsNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    padding: '12px 20px',
    borderRadius: '12px',
    color: '#8E8E93',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    width: '100%',
  },
  navItemActive: {
    padding: '12px 20px',
    borderRadius: '12px',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    backgroundColor: '#1C1C1E',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    textAlign: 'left',
    width: '100%',
  },
  contentArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: '28px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
  },
  avatarLarge: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#2C2C2E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '600',
    flexShrink: 0,
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    backgroundColor: '#000000',
  },
  settingRow: {
    backgroundColor: '#1C1C1E',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #2C2C2E',
  },
  settingRowLast: {
    backgroundColor: '#1C1C1E',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  pillButton: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  selectInput: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    cursor: 'pointer',
    fontSize: '14px',
  },
  backNav: {
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#8E8E93',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  bankGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  bankCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  bankIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#1C1C1E',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  switchContainer: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '28px',
    flexShrink: 0,
  },
  sliderBase: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: '.4s',
    borderRadius: '34px',
  },
};

const Toggle = ({ checked, onChange }) => {
  const sliderStyle = {
    ...customStyles.sliderBase,
    backgroundColor: checked ? '#4CAF50' : '#2C2C2E',
  };

  const knobStyle = {
    position: 'absolute',
    content: '""',
    height: '20px',
    width: '20px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%',
    transform: checked ? 'translateX(22px)' : 'translateX(0)',
  };

  return (
    <label style={customStyles.switchContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
      <span style={sliderStyle}>
        <span style={knobStyle}></span>
      </span>
    </label>
  );
};

const BankCardItem = ({ name, last4 }) => (
  <div style={customStyles.bankCard}>
    <div style={customStyles.bankIcon}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    </div>
    <div style={customStyles.settingInfo}>
      <span style={customStyles.textLabel}>{name}</span>
      <span style={customStyles.textCaption}>{last4}</span>
    </div>
  </div>
);

const PillButton = ({ children, style = {}, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...customStyles.pillButton,
        backgroundColor: hovered ? '#3A3A3C' : '#2C2C2E',
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

const NavItem = ({ label, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const baseStyle = active ? customStyles.navItemActive : customStyles.navItem;
  return (
    <button
      style={{
        ...baseStyle,
        backgroundColor: active ? '#1C1C1E' : hovered ? '#2C2C2E' : 'transparent',
        color: active || hovered ? '#FFFFFF' : '#8E8E93',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
};

const AccountDetailsSection = () => {
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState('John Doe');
  const [tempName, setTempName] = useState('John Doe');

  return (
    <>
      <div style={customStyles.card}>
        <div style={customStyles.profileHeader}>
          <div style={customStyles.avatarLarge}>JD</div>
          <div>
            <h1 style={{ ...customStyles.textValueLarge, margin: 0 }}>{name}</h1>
            <span style={customStyles.textSub}>Member since August 2021</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <PillButton onClick={() => { setTempName(name); setEditProfileOpen(true); }}>Edit Profile</PillButton>
          </div>
        </div>

        <div style={customStyles.settingsList}>
          <div style={customStyles.settingRow}>
            <div style={customStyles.settingInfo}>
              <span style={customStyles.textLabel}>Email Address</span>
              <span style={customStyles.textCaption}>john.doe@example.com</span>
            </div>
            <span style={{ ...customStyles.textCaption, color: '#4CAF50' }}>Verified</span>
          </div>
          <div style={customStyles.settingRowLast}>
            <div style={customStyles.settingInfo}>
              <span style={customStyles.textLabel}>Phone Number</span>
              <span style={customStyles.textCaption}>+1 (555) 000-0000</span>
            </div>
            <PillButton style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setPhoneModalOpen(true)}>Change</PillButton>
          </div>
        </div>
      </div>

      {phoneModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setPhoneModalOpen(false)}
        >
          <div
            style={{ backgroundColor: '#1C1C1E', borderRadius: '28px', padding: '32px', minWidth: '360px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ ...customStyles.textValueLarge, fontSize: '20px', margin: 0 }}>Change Phone Number</h2>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '15px', fontFamily: 'inherit', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <PillButton onClick={() => setPhoneModalOpen(false)}>Cancel</PillButton>
              <PillButton style={{ backgroundColor: '#4CAF50' }} onClick={() => setPhoneModalOpen(false)}>Save</PillButton>
            </div>
          </div>
        </div>
      )}

      {editProfileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setEditProfileOpen(false)}
        >
          <div
            style={{ backgroundColor: '#1C1C1E', borderRadius: '28px', padding: '32px', minWidth: '360px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ ...customStyles.textValueLarge, fontSize: '20px', margin: 0 }}>Edit Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={customStyles.textCaption}>Full Name</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '15px', fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <PillButton onClick={() => setEditProfileOpen(false)}>Cancel</PillButton>
              <PillButton style={{ backgroundColor: '#4CAF50' }} onClick={() => { setName(tempName); setEditProfileOpen(false); }}>Save</PillButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SecuritySection = () => {
  const [twoFA, setTwoFA] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  return (
    <div style={customStyles.card}>
      <div style={{ marginBottom: '24px' }}>
        <span style={customStyles.textHeader}>Security &amp; Privacy</span>
      </div>
      <div style={customStyles.settingsList}>
        <div style={customStyles.settingRow}>
          <div style={customStyles.settingInfo}>
            <span style={customStyles.textLabel}>Two-Factor Authentication (2FA)</span>
            <span style={customStyles.textCaption}>Secure your account with a secondary verification code</span>
          </div>
          <Toggle checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
        </div>
        <div style={customStyles.settingRowLast}>
          <div style={customStyles.settingInfo}>
            <span style={customStyles.textLabel}>Push Notifications</span>
            <span style={customStyles.textCaption}>Receive alerts for trades and security events</span>
          </div>
          <Toggle checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
        </div>
      </div>
    </div>
  );
};

const BankAccountsSection = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [banks, setBanks] = useState([
    { id: 1, name: 'Chase Bank', last4: '•••• 4242' },
    { id: 2, name: 'Wells Fargo', last4: '•••• 8810' },
  ]);
  const [newBankName, setNewBankName] = useState('');
  const [newBankLast4, setNewBankLast4] = useState('');

  const handleAdd = () => {
    if (newBankName.trim()) {
      setBanks([...banks, { id: Date.now(), name: newBankName, last4: `•••• ${newBankLast4 || '0000'}` }]);
      setNewBankName('');
      setNewBankLast4('');
      setAddModalOpen(false);
    }
  };

  return (
    <>
      <div style={customStyles.card}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={customStyles.textHeader}>Connected Bank Accounts</span>
          <PillButton style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setAddModalOpen(true)}>+ Add New</PillButton>
        </div>
        <div style={customStyles.bankGrid}>
          {banks.map(bank => (
            <BankCardItem key={bank.id} name={bank.name} last4={bank.last4} />
          ))}
        </div>
      </div>

      {addModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setAddModalOpen(false)}
        >
          <div
            style={{ backgroundColor: '#1C1C1E', borderRadius: '28px', padding: '32px', minWidth: '360px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ ...customStyles.textValueLarge, fontSize: '20px', margin: 0 }}>Add Bank Account</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={customStyles.textCaption}>Bank Name</label>
              <input
                type="text"
                placeholder="e.g. Bank of America"
                value={newBankName}
                onChange={e => setNewBankName(e.target.value)}
                style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '15px', fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={customStyles.textCaption}>Last 4 Digits</label>
              <input
                type="text"
                placeholder="e.g. 1234"
                maxLength={4}
                value={newBankLast4}
                onChange={e => setNewBankLast4(e.target.value.replace(/\D/g, ''))}
                style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '15px', fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <PillButton onClick={() => setAddModalOpen(false)}>Cancel</PillButton>
              <PillButton style={{ backgroundColor: '#4CAF50' }} onClick={handleAdd}>Add Account</PillButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PreferencesSection = () => {
  const [currency, setCurrency] = useState('USD ($)');
  const [timezoneModalOpen, setTimezoneModalOpen] = useState(false);
  const [timezone, setTimezone] = useState('Automatic (EST - New York)');

  return (
    <>
      <div style={customStyles.card}>
        <div style={{ marginBottom: '24px' }}>
          <span style={customStyles.textHeader}>Preferences</span>
        </div>
        <div style={customStyles.settingsList}>
          <div style={customStyles.settingRow}>
            <div style={customStyles.settingInfo}>
              <span style={customStyles.textLabel}>Display Currency</span>
              <span style={customStyles.textCaption}>Select your primary currency for balances</span>
            </div>
            <select
              style={customStyles.selectInput}
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div style={customStyles.settingRowLast}>
            <div style={customStyles.settingInfo}>
              <span style={customStyles.textLabel}>Timezone</span>
              <span style={customStyles.textCaption}>{timezone}</span>
            </div>
            <PillButton style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setTimezoneModalOpen(true)}>Change</PillButton>
          </div>
        </div>
      </div>

      {timezoneModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setTimezoneModalOpen(false)}
        >
          <div
            style={{ backgroundColor: '#1C1C1E', borderRadius: '28px', padding: '32px', minWidth: '360px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ ...customStyles.textValueLarge, fontSize: '20px', margin: 0 }}>Change Timezone</h2>
            <select
              style={{ ...customStyles.selectInput, width: '100%', borderRadius: '12px', padding: '12px 16px', fontSize: '15px' }}
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              <option>Automatic (EST - New York)</option>
              <option>PST - Los Angeles</option>
              <option>CST - Chicago</option>
              <option>GMT - London</option>
              <option>CET - Paris</option>
              <option>JST - Tokyo</option>
            </select>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <PillButton onClick={() => setTimezoneModalOpen(false)}>Cancel</PillButton>
              <PillButton style={{ backgroundColor: '#4CAF50' }} onClick={() => setTimezoneModalOpen(false)}>Save</PillButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NotificationsSection = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [marketUpdates, setMarketUpdates] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const rows = [
    { label: 'Email Alerts', desc: 'Receive important account notifications via email', value: emailAlerts, set: setEmailAlerts },
    { label: 'SMS Alerts', desc: 'Get text messages for urgent security events', value: smsAlerts, set: setSmsAlerts },
    { label: 'Market Updates', desc: 'Daily updates on market movements and your portfolio', value: marketUpdates, set: setMarketUpdates },
    { label: 'Weekly Report', desc: 'Summary of your weekly financial activity', value: weeklyReport, set: setWeeklyReport },
  ];

  return (
    <div style={customStyles.card}>
      <div style={{ marginBottom: '24px' }}>
        <span style={customStyles.textHeader}>Notifications</span>
      </div>
      <div style={customStyles.settingsList}>
        {rows.map((row, i) => (
          <div key={row.label} style={i === rows.length - 1 ? customStyles.settingRowLast : customStyles.settingRow}>
            <div style={customStyles.settingInfo}>
              <span style={customStyles.textLabel}>{row.label}</span>
              <span style={customStyles.textCaption}>{row.desc}</span>
            </div>
            <Toggle checked={row.value} onChange={() => row.set(!row.value)} />
          </div>
        ))}
      </div>
    </div>
  );
};

const navItems = [
  { label: 'Account Details' },
  { label: 'Notifications' },
  { label: 'Security' },
  { label: 'Bank Accounts' },
  { label: 'Preferences' },
];

const SettingsPage = () => {
  const [activeNav, setActiveNav] = useState('Account Details');

  const renderContent = () => {
    switch (activeNav) {
      case 'Account Details':
        return (
          <>
            <AccountDetailsSection />
            <SecuritySection />
            <BankAccountsSection />
            <PreferencesSection />
          </>
        );
      case 'Notifications':
        return <NotificationsSection />;
      case 'Security':
        return <SecuritySection />;
      case 'Bank Accounts':
        return <BankAccountsSection />;
      case 'Preferences':
        return <PreferencesSection />;
      default:
        return null;
    }
  };

  return (
    <div style={customStyles.body}>
      <div style={customStyles.dashboardContainer}>
        <aside style={customStyles.settingsNav}>
          <button style={customStyles.backNav}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div style={{ ...customStyles.textHeader, padding: '0 20px 12px' }}>Settings</div>
          {navItems.map(item => (
            <NavItem
              key={item.label}
              label={item.label}
              active={activeNav === item.label}
              onClick={() => setActiveNav(item.label)}
            />
          ))}
        </aside>

        <main style={customStyles.contentArea}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #000000; }
      select option { background-color: #2C2C2E; color: #FFFFFF; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<SettingsPage />} />
        <Route path="*" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;