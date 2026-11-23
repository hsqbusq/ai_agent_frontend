import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('file:///D:/uid02897/Desktop/project/ai_agent/ai_agent_frontend-master/.verify/stress-summary.html');
await p.waitForTimeout(2500);
await p.screenshot({ path: 'shot-narrow.png' });
// 缩到 900 宽复现窄窗口
await p.setViewportSize({ width: 900, height: 700 });
await p.waitForTimeout(800);
await p.screenshot({ path: 'shot-900.png' });
// 滚动到表格底部验证最后一行完整可见
const tbl = p.locator('.el-table__body-wrapper');
await tbl.evaluate(el => el.scrollTop = el.scrollHeight);
await p.waitForTimeout(600);
await p.screenshot({ path: 'shot-bottom.png' });
await b.close();
