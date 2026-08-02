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
html, body { width: 1080px; height: 1350px; overflow: hidden; }
body { font-family: 'Bricolage', 'Noto Color Emoji', sans-serif; background: #2d1941; color: #fff; position: relative; }
.header { position: absolute; top: 48px; left: 64px; right: 64px; display: flex; justify-content: space-between; align-items: center; z-index: 10; }
.wordmark { font-weight: 600; font-size: 26px; letter-spacing: 5px; color: #EDE9FE; text-shadow: 0 2px 14px rgba(20,8,32,.9), 0 0 4px rgba(20,8,32,.7); }
.pageno { text-shadow: 0 2px 14px rgba(20,8,32,.9); }
.wordmark .mark { color: #EC4899; font-weight: 800; margin-right: 10px; }
.pageno { font-weight: 600; font-size: 24px; color: #A78BFA; letter-spacing: 2px; }
.dots { position: absolute; bottom: 48px; left: 64px; display: flex; gap: 14px; z-index: 10; }
.dot { width: 14px; height: 14px; border-radius: 50%; background: rgba(167,139,250,.30); }
.dot.on { background: linear-gradient(135deg, #7C3AED, #EC4899); transform: scale(1.45); box-shadow: 0 0 12px rgba(236,72,153,.8); }
.eyebrow { font-weight: 600; font-size: 30px; letter-spacing: 6px; color: #EC4899; text-transform: uppercase; margin-bottom: 24px; }
h1 { font-weight: 800; font-size: 108px; line-height: 1.02; letter-spacing: -2px; }
h2 { font-weight: 800; font-size: 76px; line-height: 1.05; letter-spacing: -1.5px; }
.grad { background: linear-gradient(92deg, #A78BFA 0%, #EC4899 80%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.sub { font-weight: 600; font-size: 40px; line-height: 1.35; color: #F5F3FF; margin-top: 28px; }
.body { font-weight: 400; font-size: 36px; line-height: 1.4; color: #D8CCF0; margin-top: 22px; }
.art { position: absolute; inset: 0; background-size: cover; }
.scrim-bottom { position: absolute; left: 0; right: 0; bottom: 0; height: 62%; background: linear-gradient(to bottom, rgba(45,25,65,0) 0%, rgba(45,25,65,.72) 42%, #2d1941 82%); }
.band-wrap { position: absolute; top: 0; left: 0; right: 0; height: 620px; }
.band { position: absolute; inset: 0; background-size: cover; }
.band-fade { position: absolute; left: 0; right: 0; bottom: 0; height: 240px; background: linear-gradient(to bottom, rgba(45,25,65,0), #2d1941); }
.scrim-top { position: absolute; top: 0; left: 0; right: 0; height: 230px; background: linear-gradient(to bottom, rgba(45,25,65,.92) 0%, rgba(45,25,65,.45) 55%, rgba(45,25,65,0) 100%); z-index: 2; }
.textblock { position: absolute; left: 64px; right: 64px; z-index: 5; }
.glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: .35; z-index: 1; }
`;

function dots(n) {
  return `<div class="dots">${[1,2,3,4,5].map(i => `<div class="dot${i===n?' on':''}"></div>`).join('')}</div>`;
}
function header(n) {
  return `<div class="header"><div class="wordmark"><span class="mark">&lt;/&gt;</span>WORKING DEV'S HERO</div><div class="pageno">${n} / 5</div></div>`;
}
function page(inner) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${inner}</body></html>`;
}

const slides = {
  'slide-1-cover': page(`
    <div class="art" style="background-image:url('../assets/hero-scene-1-fixed.png'); background-size: auto 1350px; background-position: right top; background-repeat: no-repeat;"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(to right, #2d1941 0%, rgba(45,25,65,.9) 10%, rgba(45,25,65,.55) 26%, rgba(45,25,65,0) 46%);"></div>
    <div class="scrim-bottom"></div>
    ${header(1)}
    <div class="textblock" style="bottom: 140px;">
      <div class="eyebrow">👋 Hi, we're</div>
      <h1>Working Dev's <span class="grad">Hero</span></h1>
      <div class="sub">We build AI-powered software that <b style="font-weight:600">ships</b>.</div>
    </div>
    ${dots(1)}
  `),
  'slide-2-what': page(`
    <div class="band-wrap"><div class="band" style="background-image:url('../assets/hero-scene-wide.png'); background-position: 78% 30%;"></div><div class="band-fade"></div></div>
    <div class="scrim-top"></div>
    ${header(2)}
    <div class="textblock" style="bottom: 150px;">
      <div class="eyebrow">What we do</div>
      <h2>From concept to <span class="grad">production</span></h2>
      <div class="body">Full-stack development, AI integrations, and strategic consulting — for startups and enterprises shipping intelligent software.</div>
    </div>
    ${dots(2)}
  `),
  'slide-3-automateit': page(`
    <div class="band-wrap"><div class="band" style="background-image:url('../assets/custom-automations.png'); background-position: 35% center;"></div><div class="band-fade"></div></div>
    <div class="scrim-top"></div>
    ${header(3)}
    <div class="textblock" style="bottom: 150px;">
      <div class="eyebrow">Our product</div>
      <h2><span class="grad">Automate It</span> ⚡</h2>
      <div class="body">Social media on autopilot. <b style="font-weight:600;color:#EDE9FE">No slop allowed.</b> AI agents draft your posts — you approve with a swipe, and only what you approve gets published.</div>
    </div>
    ${dots(3)}
  `),
  'slide-4-philosophy': page(`
    <div class="glow" style="width:700px;height:700px;top:-180px;left:-200px;background:#7C3AED;"></div>
    <div class="glow" style="width:600px;height:600px;bottom:-150px;right:-180px;background:#EC4899;opacity:.22;"></div>
    ${header(4)}
    <div style="position:absolute;top:210px;left:0;right:0;display:flex;justify-content:center;z-index:3;">
      <div style="width:400px;height:400px;border-radius:50%;overflow:hidden;border:6px solid rgba(167,139,250,.45);box-shadow:0 30px 90px rgba(0,0,0,.5), 0 0 0 18px rgba(124,58,237,.12);">
        <img src="../assets/hero-mascot.png" style="width:100%;height:100%;object-fit:cover;">
      </div>
    </div>
    <div class="textblock" style="bottom:150px;text-align:center;">
      <div class="eyebrow">Our philosophy</div>
      <h2>AI drafts. <span class="grad">Humans approve.</span></h2>
      <div class="body">Three AIs and one human rebranded this very site — not a pixel shipped without sign-off. That's not a limitation of the workflow. <b style="font-weight:600;color:#EDE9FE">That is the workflow.</b></div>
    </div>
    ${dots(4)}
  `),
  'slide-5-cta': page(`
    <div class="band-wrap"><div class="band" style="background-image:url('../assets/newsletter.png'); background-position: 62% 20%;"></div><div class="band-fade"></div></div>
    <div class="scrim-top" style="height:320px;background:linear-gradient(to bottom, rgba(45,25,65,.97) 0%, rgba(45,25,65,.6) 50%, rgba(45,25,65,0) 100%);"></div>
    ${header(5)}
    <div class="textblock" style="bottom:150px;">
      <div class="eyebrow">Join the Hero Squad&nbsp;🦸</div>
      <h2>Come <span class="grad">build with us</span></h2>
      <div class="body">The Hero Squad lives on <b style="font-weight:600;color:#EDE9FE">Discord</b> — share what you're building, get help with your projects, and swap AI dev strategies with builders who ship.</div>
    </div>
    ${dots(5)}
  `),
  'infographic': page(`
    <div class="glow" style="width:800px;height:800px;top:-260px;right:-260px;background:#7C3AED;"></div>
    <div class="glow" style="width:700px;height:700px;bottom:-240px;left:-240px;background:#EC4899;opacity:.2;"></div>
    <div style="position:absolute;top:90px;left:0;right:0;display:flex;flex-direction:column;align-items:center;z-index:3;">
      <div style="width:190px;height:190px;border-radius:50%;overflow:hidden;border:5px solid rgba(167,139,250,.5);box-shadow:0 20px 60px rgba(0,0,0,.5);">
        <img src="../assets/hero-mascot.png" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div style="margin-top:34px;font-weight:600;font-size:30px;letter-spacing:8px;color:#EDE9FE;"><span style="color:#EC4899;font-weight:800;">&lt;/&gt;</span>&nbsp; WORKING DEV'S HERO</div>
      <div style="margin-top:18px;font-weight:800;font-size:52px;letter-spacing:-1px;">We build <span class="grad">AI-powered software</span> that ships.</div>
    </div>
    <div style="position:absolute;top:515px;left:64px;right:64px;display:flex;flex-direction:column;gap:20px;z-index:3;">
      ${[
        ['🛠️','AI-Enabled Development','Full-stack builds, AI integrations & consulting — concept → production.'],
        ['⚡','Automate It','Our product: social media on autopilot. No slop allowed.'],
        ['🤖','Human Review Gate','AI drafts, humans approve. Every pixel, every post, every time.'],
        ['🦸','The Hero Squad','Join our Discord — share projects, get help, ship together.'],
      ].map(([e,t,d]) => `
      <div style="display:flex;align-items:center;gap:28px;background:rgba(124,58,237,.10);border:2px solid rgba(167,139,250,.25);border-radius:24px;padding:22px 30px;">
        <div style="flex:none;width:84px;height:84px;border-radius:20px;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-size:46px;">${e}</div>
        <div><div style="font-weight:800;font-size:36px;letter-spacing:-.5px;">${t}</div>
        <div style="font-weight:400;font-size:27px;color:#D8CCF0;margin-top:4px;line-height:1.25;">${d}</div></div>
      </div>`).join('')}
    </div>
    <div style="position:absolute;bottom:40px;left:0;right:0;text-align:center;font-weight:600;font-size:28px;letter-spacing:3px;color:#A78BFA;z-index:3;">workingdevshero.com &nbsp;•&nbsp; @workingdevshero</div>
  `),
};

const browser = await chromium.launch({ headless: true });
const pageCtx = await (await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })).newPage();

for (const [name, html] of Object.entries(slides)) {
  const htmlPath = path.join(ROOT, 'out', `${name}.html`);
  fs.writeFileSync(htmlPath, html);
  await pageCtx.goto('file://' + htmlPath);
  await pageCtx.evaluate(() => document.fonts.ready);
  await pageCtx.waitForTimeout(600);
  await pageCtx.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log('rendered', name);
}
await browser.close();
console.log('done');
