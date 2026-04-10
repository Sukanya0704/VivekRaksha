const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/modules/NetBankingSimulator.jsx');
let c = fs.readFileSync(filePath, 'utf8');

// Find the broken block boundaries more reliably using line-based approach
const lines = c.split('\n');
let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('isSimulationComplete &&') && lines[i].includes('(')) {
    startLine = i;
  }
  if (startLine !== -1 && i > startLine && lines[i].trim() === ')}') {
    endLine = i;
    break;
  }
}

if (startLine === -1 || endLine === -1) {
  console.log('Could not find block. startLine:', startLine, 'endLine:', endLine);
  process.exit(1);
}

console.log(`Replacing lines ${startLine+1} to ${endLine+1}`);

const replacement = `               {isSimulationComplete && (
                  <div className="critical-ui" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                     <div style={{ background: 'white', padding: '48px', borderRadius: '16px', width: '500px', textAlign: 'center', animation: 'scaleIn 0.5s', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <CheckCircle size={72} color="#10b981" style={{ margin: '0 auto 24px' }} />
                        <h2 style={{ marginTop: 0, color: '#065f46', fontSize: '32px' }}>Tutorial Complete!</h2>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                          <button onClick={restartTutorial} className="demo-btn critical-ui" style={{ padding: '14px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                            Restart Sandbox
                          </button>
                          <button onClick={() => markLevelComplete(5, navigate)} className="demo-btn critical-ui" style={{ padding: '14px 24px', background: '#00356b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                            Return to Safety Road &#8594;
                          </button>
                        </div>
                     </div>
                  </div>
               )}`;

lines.splice(startLine, endLine - startLine + 1, replacement);
fs.writeFileSync(filePath, lines.join('\n'));
console.log('OK - patch applied');
