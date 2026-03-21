The code below contains a design. This design should be used to create a new app or be added to an existing one.

Look at the current open project to determine if a project exists. If no project is open, create a new Vite project then create this view in React after componentizing it.

If a project does exist, determine the framework being used and implement the design within that framework. Identify whether reusable components already exist that can be used to implement the design faithfully and if so use them, otherwise create new components. If other views already exist in the project, make sure to place the view in a sensible route and connect it to the other views.

Ensure the visual characteristics, layout, and interactions in the design are preserved with perfect fidelity.

Run the dev command so the user can see the app once finished.

```
<html lang="en" vid="0"><head vid="1">
    <meta charset="UTF-8" vid="2">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" vid="3">
    <title vid="4">Financial Dashboard</title>
    <style vid="5">
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
            --bg-base: #000000;
            --bg-card: #1C1C1E;
            --bg-element: #2C2C2E;
            --bg-element-hover: #3A3A3C;
            --text-primary: #FFFFFF;
            --text-secondary: #8E8E93;
            --text-tertiary: #636366;
            
            --radius-card: 28px;
            --radius-pill: 999px;
            --radius-small: 12px;
            
            --space-xs: 4px;
            --space-sm: 8px;
            --space-md: 16px;
            --space-lg: 24px;
            --space-xl: 32px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        body {
            background-color: var(--bg-base);
            color: var(--text-primary);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            padding: 40px;
            display: flex;
            justify-content: center;
        }

        
        .text-header {
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: var(--text-secondary);
        }

        .text-value-huge {
            font-size: 48px;
            font-weight: 400;
            letter-spacing: -1px;
            color: var(--text-primary);
            line-height: 1.1;
        }

        .text-value-large {
            font-size: 32px;
            font-weight: 500;
            letter-spacing: -0.5px;
            color: var(--text-primary);
        }

        .text-value-medium {
            font-size: 20px;
            font-weight: 500;
            color: var(--text-primary);
        }

        .text-label {
            font-size: 15px;
            font-weight: 500;
            color: var(--text-primary);
        }

        .text-sub {
            font-size: 13px;
            font-weight: 400;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.2px;
        }

        .text-caption {
            font-size: 12px;
            font-weight: 400;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        
        .dashboard {
            width: 100%;
            max-width: 1400px;
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 24px;
            align-items: start;
        }

        .main-column {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .side-column {
            display: flex;
            flex-direction: column;
            gap: 24px;
            position: sticky;
            top: 40px;
        }

        
        .card {
            background-color: var(--bg-card);
            border-radius: var(--radius-card);
            padding: 32px;
            display: flex;
            flex-direction: column;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-xl);
        }

        .pill-button {
            background-color: var(--bg-element);
            color: var(--text-secondary);
            border: none;
            border-radius: var(--radius-pill);
            padding: 12px 24px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }

        .pill-button:hover {
            background-color: var(--bg-element-hover);
            color: var(--text-primary);
        }

        .pill-button.primary {
            width: 100%;
            padding: 16px;
            margin-top: var(--space-xl);
        }

        .icon-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--bg-element);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-primary);
            transition: background-color 0.2s;
        }

        .icon-button:hover {
            background-color: var(--bg-element-hover);
        }

        
        
        
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }

        .metric-card {
            padding: 28px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        
        .chart-card {
            min-height: 400px;
        }

        .chart-placeholder {
            flex-grow: 1;
            display: flex;
            align-items: flex-end;
            padding-top: 40px;
            gap: 8px;
        }

        .chart-bar {
            flex: 1;
            background-color: var(--bg-element);
            border-radius: 4px 4px 0 0;
            transition: background-color 0.3s ease;
        }
        
        .chart-bar:hover {
            background-color: var(--text-secondary);
        }

        
        .list-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid var(--bg-base);
        }

        .list-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .list-item-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .list-icon {
            width: 40px;
            height: 40px;
            border-radius: var(--radius-pill);
            background-color: var(--bg-element);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 500;
        }

        .list-text {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        
        .exchange-widget {
            background: transparent;
            padding: 0;
            gap: 8px; 
        }

        .exchange-block {
            background-color: var(--bg-card);
            border-radius: var(--radius-card);
            padding: 28px 24px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            position: relative;
        }

        .exchange-header {
            text-align: center;
            margin-bottom: 16px;
        }

        .currency-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .currency-selector {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        .currency-code {
            font-size: 24px;
            font-weight: 500;
        }

        .chevron-down {
            width: 12px;
            height: 12px;
            fill: none;
            stroke: var(--text-secondary);
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .exchange-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0 16px;
            margin: -4px 0; 
            z-index: 10;
        }

        .rate-pill {
            background-color: var(--bg-element);
            padding: 10px 16px;
            border-radius: var(--radius-pill);
            font-size: 13px;
            font-weight: 500;
            color: var(--text-primary);
            flex-grow: 1;
        }

        .rate-pill span {
            color: var(--text-secondary);
        }

        .exchange-footer {
            background-color: transparent;
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .fee-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .info-box {
            display: flex;
            gap: 12px;
            align-items: flex-start;
        }

        .info-icon {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: var(--bg-element);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
            font-family: serif;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        
        .color-dim { color: var(--text-secondary); }

    </style>
</head>
<body vid="6">

<div class="dashboard" vid="7">
    
    <div class="main-column" vid="8">
        
        
        <div class="overview-grid" vid="9">
            <div class="card metric-card" vid="10">
                <span class="text-sub" vid="11">Total Balance</span>
                <span class="text-value-huge" vid="12">$142,500.00</span>
                <span class="text-caption" vid="13">+2.4% today</span>
            </div>
            <div class="card metric-card" vid="14">
                <span class="text-sub" vid="15">Available Cash</span>
                <span class="text-value-large" vid="16">$36,200.00</span>
                <span class="text-caption color-dim" vid="17">Ready to trade</span>
            </div>
            <div class="card metric-card" vid="18">
                <span class="text-sub" vid="19">24h Volume</span>
                <span class="text-value-large" vid="20">$12,450.00</span>
                <span class="text-caption color-dim" vid="21">8 transactions</span>
            </div>
        </div>

        
        <div class="card chart-card" vid="22">
            <div class="card-header" vid="23">
                <span class="text-header" vid="24">Portfolio Performance</span>
                <div style="display: flex; gap: 8px;" vid="25">
                    <button class="pill-button" style="padding: 6px 12px; font-size: 13px; background: transparent;" vid="26">1W</button>
                    <button class="pill-button" style="padding: 6px 12px; font-size: 13px;" vid="27">1M</button>
                    <button class="pill-button" style="padding: 6px 12px; font-size: 13px; background: transparent;" vid="28">1Y</button>
                </div>
            </div>
            
            <div class="chart-placeholder" vid="29">
                <div class="chart-bar" style="height: 30%;" vid="30"></div>
                <div class="chart-bar" style="height: 45%;" vid="31"></div>
                <div class="chart-bar" style="height: 35%;" vid="32"></div>
                <div class="chart-bar" style="height: 60%;" vid="33"></div>
                <div class="chart-bar" style="height: 50%;" vid="34"></div>
                <div class="chart-bar" style="height: 75%;" vid="35"></div>
                <div class="chart-bar" style="height: 65%;" vid="36"></div>
                <div class="chart-bar" style="height: 85%;" vid="37"></div>
                <div class="chart-bar" style="height: 70%;" vid="38"></div>
                <div class="chart-bar" style="height: 90%;" vid="39"></div>
                <div class="chart-bar" style="height: 100%;" vid="40"></div>
            </div>
        </div>

        
        <div class="card" vid="41">
            <div class="card-header" vid="42">
                <span class="text-header" vid="43">Your Assets</span>
            </div>
            <div class="list-container" vid="44">
                <div class="list-item" vid="45">
                    <div class="list-item-left" vid="46">
                        <div class="list-icon" vid="47">BTC</div>
                        <div class="list-text" vid="48">
                            <span class="text-label" vid="49">Bitcoin</span>
                            <span class="text-sub" vid="50">0.45 BTC</span>
                        </div>
                    </div>
                    <div class="list-text" style="text-align: right;" vid="51">
                        <span class="text-value-medium" vid="52">$28,450.00</span>
                        <span class="text-caption" style="color: #4CAF50;" vid="53">+5.2%</span>
                    </div>
                </div>
                <div class="list-item" vid="54">
                    <div class="list-item-left" vid="55">
                        <div class="list-icon" vid="56">ETH</div>
                        <div class="list-text" vid="57">
                            <span class="text-label" vid="58">Ethereum</span>
                            <span class="text-sub" vid="59">12.5 ETH</span>
                        </div>
                    </div>
                    <div class="list-text" style="text-align: right;" vid="60">
                        <span class="text-value-medium" vid="61">$22,100.00</span>
                        <span class="text-caption" style="color: #4CAF50;" vid="62">+1.8%</span>
                    </div>
                </div>
                <div class="list-item" vid="63">
                    <div class="list-item-left" vid="64">
                        <div class="list-icon" vid="65">SOL</div>
                        <div class="list-text" vid="66">
                            <span class="text-label" vid="67">Solana</span>
                            <span class="text-sub" vid="68">450 SOL</span>
                        </div>
                    </div>
                    <div class="list-text" style="text-align: right;" vid="69">
                        <span class="text-value-medium" vid="70">$9,450.00</span>
                        <span class="text-caption" style="color: #F44336;" vid="71">-2.1%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <div class="side-column" vid="72">
        
        
        <div class="card exchange-widget" vid="73">
            
            <div class="exchange-block" vid="74">
                <div class="exchange-header" vid="75">
                    <span class="text-header" vid="76">Exchange</span>
                </div>
                <div class="currency-row" vid="77">
                    <div class="currency-selector" vid="78">
                        <span class="currency-code" vid="79">USD</span>
                        <svg class="chevron-down" viewBox="0 0 24 24" vid="80">
                            <polyline points="6 9 12 15 18 9" vid="81"></polyline>
                        </svg>
                    </div>
                    <span class="text-value-large" vid="82">1</span>
                </div>
                <span class="text-sub" vid="83">Balance $36,200.00</span>
            </div>

            <div class="exchange-divider" vid="84">
                <button class="icon-button" vid="85">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vid="86">
                        <line x1="12" y1="5" x2="12" y2="19" vid="87"></line>
                        <polyline points="19 12 12 19 5 12" vid="88"></polyline>
                    </svg>
                </button>
                <div class="rate-pill" vid="89">
                    $1 = €0.9049 <span vid="90">US dollars in Euro</span>
                </div>
            </div>

            <div class="exchange-block" vid="91">
                <div class="currency-row" vid="92">
                    <div class="currency-selector" vid="93">
                        <span class="currency-code" vid="94">EUR</span>
                        <svg class="chevron-down" viewBox="0 0 24 24" vid="95">
                            <polyline points="6 9 12 15 18 9" vid="96"></polyline>
                        </svg>
                    </div>
                    <span class="text-value-large" vid="97">0.90</span>
                </div>
                <span class="text-sub" vid="98">Balance €10,586.00</span>
            </div>

            <div class="exchange-footer" vid="99">
                <div class="fee-row" vid="100">
                    <span class="text-label color-dim" vid="101">Aditional Fee</span>
                    <span class="text-label" vid="102">$0</span>
                </div>
                
                <div class="info-box" vid="103">
                    <div class="info-icon" vid="104">i</div>
                    <span class="text-caption" vid="105">Our fees include a fee to exchange uncommon currencies or outside market hours. You can find out more in our fees page and confirm exact fees at the time of transaction</span>
                </div>

                <button class="pill-button primary" vid="106">Exchange →</button>
            </div>
        </div>

        
        <div class="card" vid="107">
            <div class="card-header" style="margin-bottom: 16px;" vid="108">
                <span class="text-header" vid="109">Recent Activity</span>
            </div>
            <div class="list-container" vid="110">
                <div class="list-item" style="padding: 8px 0;" vid="111">
                    <div class="list-text" vid="112">
                        <span class="text-label" vid="113">Exchanged USD to EUR</span>
                        <span class="text-caption" vid="114">Today, 14:32</span>
                    </div>
                    <span class="text-label" vid="115">-$1,000.00</span>
                </div>
                <div class="list-item" style="padding: 8px 0;" vid="116">
                    <div class="list-text" vid="117">
                        <span class="text-label" vid="118">Deposit</span>
                        <span class="text-caption" vid="119">Yesterday, 09:15</span>
                    </div>
                    <span class="text-label" style="color: #FFFFFF;" vid="120">+$5,000.00</span>
                </div>
            </div>
        </div>

    </div>
</div>


</body></html>
```
