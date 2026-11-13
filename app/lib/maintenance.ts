import { SITE_NAME } from "./site";

/**
 * The site-wide maintenance switch. While it is on, the proxy answers every
 * page request with the holding page below instead of rendering the app.
 * Flip it back to `false` (or set MAINTENANCE_MODE=false in the environment)
 * to bring the site back; nothing else needs undoing.
 */
export const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE !== "false";

// How long crawlers are told to wait before trying again, in seconds. Paired
// with the 503 it tells search engines the outage is temporary, so the pages
// keep their place in the index rather than being dropped.
export const MAINTENANCE_RETRY_AFTER = 60 * 60 * 24;

/**
 * Served straight from the proxy, so it has to stand on its own: no layout, no
 * client bundle, no message catalogue. Both languages sit on the one page so
 * nobody lands on the wrong one.
 */
export const MAINTENANCE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#fafafa">
<title>${SITE_NAME} — Under maintenance</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    background:#fafafa;color:#2a2a2a;
    font-family:Archivo,ui-sans-serif,system-ui,sans-serif;font-weight:300;
    display:flex;flex-direction:column;justify-content:space-between;
    min-height:100vh;padding:clamp(16px,2vw,32px);
    -webkit-font-smoothing:antialiased;
  }
  header,footer{display:flex;justify-content:space-between;align-items:center;gap:16px;
    font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:.02em}
  .brand{display:flex;align-items:center;gap:10px}
  .brand img{width:22px;height:22px}
  main{padding:8vh 0}
  h1{font-weight:500;text-transform:uppercase;letter-spacing:-.04em;line-height:.92;
    font-size:clamp(44px,9vw,160px)}
  h1 em{font-family:"Instrument Serif",ui-serif,Georgia,serif;font-weight:400;
    text-transform:none;letter-spacing:-.02em}
  .copy{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px 4vw;
    margin-top:clamp(32px,5vw,72px);max-width:960px;font-size:clamp(16px,1.3vw,20px);line-height:1.45}
  .copy p span{display:block;font-size:12px;font-weight:500;text-transform:uppercase;
    letter-spacing:.04em;color:#949494;margin-bottom:8px}
  .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;
    background:linear-gradient(135deg,#06b6d4,#a855f7);animation:pulse 2s ease-in-out infinite}
  footer{color:#949494}
  @keyframes pulse{50%{opacity:.35}}
  @media (prefers-reduced-motion:reduce){.dot{animation:none}}
</style>
</head>
<body>
  <header>
    <div class="brand"><img src="/icon.svg" alt="">${SITE_NAME}</div>
    <div><span class="dot"></span>Maintenance</div>
  </header>
  <main>
    <h1>Back <em>very</em><br>soon</h1>
    <div class="copy">
      <p lang="en"><span>EN</span>We're making some improvements to the site. It will be back shortly.</p>
      <p lang="el"><span>EL</span>Κάνουμε κάποιες βελτιώσεις στον ιστότοπο. Θα επιστρέψουμε σύντομα.</p>
    </div>
  </main>
  <footer>
    <div>&copy; ${new Date().getFullYear()} ${SITE_NAME}</div>
  </footer>
</body>
</html>`;
