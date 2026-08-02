import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/.openclaw/workspace-claudius/tmp/wdh-carousel';
const OUT = path.join(ROOT, 'out');
fs.mkdirSync(OUT, { recursive: true });

const CSS = `
@font-face { font-family: 'Bricolage'; src: url('../fonts/bricolage-400.woff2') format('woff2'); font-weight: 400; }
@font-face { font-family: 'Bricolage'; src: url('../fonts/bricolage-600.woff2') format('woff2'); font-weight: 600; }
@font-face { font-family: 'Bricolage'; src: url('../fonts/bricolage-800.woff2') format('woff2'); font-weight: 800; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1080px; overflow: hidden; }
body { font-family: 'Bricolage', 'Noto Color Emoji', sans-serif; background: #2d1941; color: #fff; position: relative; }
.grad { background: linear-gradient(92deg, #A78BFA 0%, #EC4899 80%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: .35; z-index: 1; }
`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <div class="glow" style="width:700px;height:700px;top:-240px;right:-240px;background:#7C3AED;"></div>
  <div class="glow" style="width:600px;height:600px;bottom:-220px;left:-220px;background:#EC4899;opacity:.2;"></div>

  <div style="position:absolute;top:56px;left:0;right:0;display:flex;flex-direction:column;align-items:center;z-index:3;">
    <div style="display:flex;align-items:center;gap:28px;">
      <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;border:4px solid rgba(167,139,250,.5);box-shadow:0 16px 44px rgba(0,0,0,.5);flex:none;">
        <img src="../assets/hero-mascot.png" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div>
        <div style="font-weight:600;font-size:24px;letter-spacing:6px;color:#EDE9FE;"><span style="color:#EC4899;font-weight:800;">&lt;/&gt;</span>&nbsp; WORKING DEV'S HERO</div>
        <div style="margin-top:10px;font-weight:800;font-size:48px;letter-spacing:-1px;line-height:1.08;">We build <span class="grad">AI-powered software</span><br>that ships.</div>
      </div>
    </div>
  </div>

  <div style="position:absolute;top:300px;left:56px;right:56px;display:grid;grid-template-columns:1fr 1fr;gap:18px;z-index:3;">
    ${[
      ['🛠️','AI-Enabled Development','Full-stack builds, AI integrations & consulting — concept → production.'],
      ['⚡','Automate It','Our product: social media on autopilot. No slop allowed.'],
      ['🤖','Human Review Gate','AI drafts, humans approve. Every pixel, every post.'],
      ['🦸','The Hero Squad','Join our Discord — share projects, get help, ship together.'],
    ].map(([e,t,d]) => `
    <div style="display:flex;align-items:center;gap:20px;background:rgba(124,58,237,.10);border:2px solid rgba(167,139,250,.25);border-radius:20px;padding:20px 24px;">
      <div style="flex:none;width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-size:34px;">${e}</div>
      <div><div style="font-weight:800;font-size:28px;letter-spacing:-.5px;">${t}</div>
      <div style="font-weight:400;font-size:21px;color:#D8CCF0;margin-top:4px;line-height:1.25;">${d}</div></div>
    </div>`).join('')}
  </div>

  <div style="position:absolute;bottom:56px;left:0;right:0;text-align:center;z-index:3;">
    <div style="font-weight:600;font-size:26px;letter-spacing:3px;color:#A78BFA;">workingdevshero.com &nbsp;•&nbsp; @workingdevshero</div>
  </div>
</body></html>`;

const browser = await chromium.launch({ headless: true });
const pageCtx = await (await browser.newContext({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const htmlPath = path.join(OUT, 'infographic-linkedin.html');
fs.writeFileSync(htmlPath, html);
await pageCtx.goto('file://' + htmlPath);
await pageCtx.evaluate(() => document.fonts.ready);
await pageCtx.waitForTimeout(600);
await pageCtx.screenshot({ path: path.join(OUT, 'infographic-linkedin.png') });
console.log('rendered infographic-linkedin.png');
await browser.close();
console.log('done');
