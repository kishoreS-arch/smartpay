const fs = require('fs');
const file = 'c:/Users/kisho/Downloads/newsmarbank-main/newsmarbank-main/frontend/src/pages/dashboard/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /if \(isSenior\) \{[\s\S]*?return \[[\s\S]*?\];\s*\}/,
    `if (isSenior) {
            return [
                { icon: <Send size={40} />, label: "Pay", path: "/transfer", color: "#6366f1" },
                { icon: <QrCode size={40} />, label: "Scan", path: "/scan", color: "#f59e0b" },
                { icon: <Wallet size={40} />, label: "Balance", action: () => setShowMpinModal(true), color: "#10b981" },
                { icon: <History size={40} />, label: "History", path: "/transactions", color: "#8b5cf6" },
            ];
        }`
);

content = content.replace(
    /if \(isVisual\) \{[\s\S]*?return \[[\s\S]*?\];\s*\}/,
    `if (isVisual) {
            return [
                { icon: <Wallet size={48} />, label: "CHECK BALANCE", action: () => setShowMpinModal(true), color: "#10b981" },
                { icon: <Send size={48} />, label: "SEND MONEY", path: "/transfer", color: "#6366f1" },
                { icon: <QrCode size={48} />, label: "SCAN QR", path: "/scan", color: "#f59e0b" },
                { icon: <History size={48} />, label: "HISTORY", path: "/transactions", color: "#8b5cf6" },
            ];
        }`
);

// Remove Senior Safety Section
content = content.replace(/\{\/\* Senior Safety Section \*\/\}\s*\{isSenior && \([\s\S]*?<\/section>\s*\)\}/, '');

// Balance Card - hide for Senior
content = content.replace(/\{!isVisual && \(/, '{!isVisual && !isSenior && (');

// And remove the isSenior flag that shows quick actions instead of "Normal People Row" etc
// Oh wait, Quick Actions grid is shown for Normal too, but it has `!isVisual && (` on line 404
// Let's change line 404 to conditionally show Quick Actions for normal/senior which it currently does.
// But we need to make sure Senior has ONLY Quick Actions and nothing else.
// Change `{!isVisual && (` above Quick actions Grid! Wait, line 404 is `{ !isVisual && (`
// Wait, I just modified `!isVisual && (` on line 280 (Balance Card) and made it `!isVisual && !isSenior && (`.
// There is a second `!isVisual && (` at line 404 (Quick actions Grid). I SHOULD KEEP IT as `!isVisual && (` so Senior CAN see it. I did this.

// Transactions section
content = content.replace(/\{\/\* Transactions Section \*\/\}\s*<section className="section mb-5">[\s\S]*?<\/section>/, `
            {/* Transactions Section */}
            {!isSenior && !isVisual && (
                <section className="section mb-5">
                    <div className="section-header">
                        <h3>{t("recentTransactions")}</h3>
                        <button onClick={() => navigate("/transactions")}>{t("seeAll")}</button>
                    </div>
                    <div className="transactions-list">
                        {recentTransactions.map((tx) => (
                            <div 
                                key={tx.id} 
                                className="tx-item glass-card"
                                aria-label={\`\${tx.name}, \${tx.amount} Rupees, \${new Date(tx.date).toLocaleDateString()}\`}
                            >
                                <div className={\`tx-icon \${tx.amount > 0 ? 'credit' : 'debit'}\`}>
                                    {tx.amount > 0 ? <ArrowDownLeft /> : <ArrowUpRight />}
                                </div>
                                <div className="tx-info">
                                    <div className="tx-name-row">
                                        <div className="tx-name">{tx.name}</div>
                                        {tx.isVerified && <span className="verified-badge">✔</span>}
                                    </div>
                                    <div className="tx-date">{new Date(tx.date).toLocaleDateString()}</div>
                                </div>
                                <div className={\`tx-amount \${tx.amount > 0 ? 'credit' : 'debit'}\`}>
                                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
`);

// Mpin verify
content = content.replace(/setEnteredMpin\(""\);\s*speak\(`Verification successful\. Your balance is \$\{data\.balance\} Rupees\.`\);/g, 
`setEnteredMpin("");
                speak(\`Verification successful. Your balance is \${data.balance} Rupees.\`);
                if (isSenior || isVisual) alert(\`Your Balance is: ₹ \${data.balance}\`);`);

content = content.replace(/speak\("Verification successful\. Your balance is 1 Lakh 24 Thousand 500 Rupees\."\);/g,
`speak("Verification successful. Your balance is 1 Lakh 24 Thousand 500 Rupees.");
                if (isSenior || isVisual) alert("Your Balance is: ₹ 1,24,500");`);

fs.writeFileSync(file, content);
console.log('Done patching Home.jsx');
