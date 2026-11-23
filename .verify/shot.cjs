const { chromium } = require('playwright-core');
const candidates = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];
const fs = require('fs');
const exe = candidates.find(fs.existsSync);
if (!exe) { console.error('no browser found'); process.exit(1); }
(async () => {
  const b = await chromium.launch({ executablePath: exe });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('file:///D:/uid02897/Desktop/project/ai_agent/ai_agent_frontend-master/.verify/stress-summary-local.html');
  await p.waitForTimeout(3000);
  await p.screenshot({ path: 'shot-1440.png' });
  await p.setViewportSize({ width: 960, height: 700 });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: 'shot-960.png' });
  // 滚动到表格底部，验证最后一行完整可见
  const tbl = p.locator('.el-table__body-wrapper');
  await tbl.evaluate(el => el.scrollTop = el.scrollHeight);
  await p.waitForTimeout(600);
  await p.screenshot({ path: 'shot-bottom.png' });
  await b.close();
  console.log('done, exe =', exe);
})().catch(e => { console.error(e.message); process.exit(1); });
