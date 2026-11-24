/*
 * Facile Soluções em Energia · consentimento de cookies (LGPD) e medição
 *
 * CONFIGURE AQUI: cole os IDs quando as contas estiverem criadas.
 *  - ga4:  ID do Google Analytics 4 (formato G-XXXXXXXXXX)
 *  - metaPixel: ID do Pixel da Meta (Facebook/Instagram), só números
 * Sem ID, nada é carregado. Com ID, só carrega depois que o visitante aceitar a categoria.
 */
window.FACILE_ANALYTICS = {
  ga4: '',
  metaPixel: '',
  versaoPolitica: '2026-11-24'
};

(function () {
  var CFG = window.FACILE_ANALYTICS, CHAVE = 'facile-consentimento', VALIDADE_DIAS = 365;
  var estado = ler();

  function ler() {
    try {
      var s = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      if (!s || s.versao !== CFG.versaoPolitica) return null;
      if (Date.now() - s.data > VALIDADE_DIAS * 864e5) return null;
      return s;
    } catch (e) { return null; }
  }
  function salvar(analytics, marketing) {
    estado = { analytics: !!analytics, marketing: !!marketing, data: Date.now(), versao: CFG.versaoPolitica };
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
    aplicar(); fecharBanner(); fecharPainel();
  }

  // ---- Carregamento condicionado ao consentimento ----
  var gaCarregado = false, pixelCarregado = false;
  function aplicar() {
    if (!estado) return;
    if (estado.analytics && CFG.ga4 && !gaCarregado) {
      gaCarregado = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.ga4); document.head.appendChild(s);
      gtag('js', new Date()); gtag('config', CFG.ga4, { anonymize_ip: true });
    }
    if (estado.marketing && CFG.metaPixel && !pixelCarregado) {
      pixelCarregado = true;
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', CFG.metaPixel); fbq('track', 'PageView');
    }
  }

  // ---- Eventos de conversão (só disparam com consentimento) ----
  window.facileTrack = function (evento, dados, eventoMeta) {
    try {
      if (estado && estado.analytics && window.gtag) gtag('event', evento, dados || {});
      if (estado && estado.marketing && window.fbq) { if (eventoMeta) fbq('track', eventoMeta, dados || {}); else fbq('trackCustom', evento, dados || {}); }
    } catch (e) {}
  };

  // ---- Interface ----
  var css = '.ck-banner{position:fixed;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:120;max-width:620px;margin:0 auto;padding:20px 22px;border-radius:22px;background:rgba(10,31,24,.94);color:#EEF5EF;border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 24px 60px rgba(0,0,0,.35);font:400 15px/1.55 Inter,"Segoe UI",Arial,sans-serif}'
    + '.ck-banner b{display:block;font:600 16px Sora,"Segoe UI",Arial,sans-serif;margin-bottom:4px}.ck-banner p{margin:0;color:rgba(238,245,239,.82)}.ck-banner a{color:#C6F36B}'
    + '.ck-acoes{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.ck-acoes button{min-height:44px;padding:10px 18px;border-radius:999px;font:600 14.5px Inter,"Segoe UI",Arial,sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,.25);background:transparent;color:#EEF5EF}'
    + '.ck-acoes .ck-sim{background:#1FD27F;border-color:#1FD27F;color:#06140F}.ck-acoes button:focus-visible,.ck-painel button:focus-visible{outline:2px solid #C6F36B;outline-offset:2px}'
    + '.ck-fundo{position:fixed;inset:0;z-index:121;background:rgba(6,20,15,.55);backdrop-filter:blur(4px)}'
    + '.ck-painel{position:fixed;z-index:122;left:50%;top:50%;transform:translate(-50%,-50%);width:min(560px,calc(100% - 32px));max-height:calc(100% - 32px);overflow:auto;padding:24px;border-radius:24px;background:#F4F7F2;color:#0A1F17;font:400 15px/1.55 Inter,"Segoe UI",Arial,sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.35)}'
    + '.ck-painel h2{font:600 22px Sora,"Segoe UI",Arial,sans-serif;margin:0 0 6px}.ck-painel>p{margin:0 0 14px;color:rgba(10,31,23,.75)}'
    + '.ck-cat{display:grid;grid-template-columns:1fr auto;gap:4px 16px;align-items:center;padding:14px 16px;border-radius:16px;background:#fff;border:1px solid rgba(10,31,23,.12);margin-top:10px}'
    + '.ck-cat b{font:600 15.5px Sora,"Segoe UI",Arial,sans-serif}.ck-cat small{grid-column:1/-1;color:rgba(10,31,23,.68);font-size:13.5px}'
    + '.ck-sw{position:relative;width:48px;height:28px}.ck-sw input{position:absolute;opacity:0;inset:0;width:100%;height:100%;margin:0;cursor:pointer}.ck-sw span{position:absolute;inset:0;border-radius:999px;background:#C9D4CD;transition:background .2s}.ck-sw span::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s}.ck-sw input:checked+span{background:#0A8A50}.ck-sw input:checked+span::after{transform:translateX(20px)}.ck-sw input:disabled+span{opacity:.6}.ck-sw input:focus-visible+span{outline:2px solid #0A8A50;outline-offset:2px}'
    + '.ck-painel .ck-acoes button{color:#0A1F17;border-color:rgba(10,31,23,.6)}.ck-painel .ck-acoes .ck-sim{color:#06140F}'
    + '[hidden]{display:none!important}@media (prefers-reduced-motion:reduce){.ck-sw span,.ck-sw span::after{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var banner, painel, fundo, quemAbriu;
  var LINK = (document.querySelector('meta[name="facile-politica"]') || {}).content || 'politica-de-privacidade/';
  function montaBanner() {
    banner = document.createElement('div'); banner.className = 'ck-banner'; banner.setAttribute('role', 'region'); banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = '<b>Sua privacidade</b><p>Usamos cookies necessários para o site funcionar e, com a sua permissão, cookies de medição e de marketing para entender o uso do site e melhorar nossos anúncios. Saiba mais na <a href="' + LINK + '#cookies">Política de Privacidade e Cookies</a>.</p>'
      + '<div class="ck-acoes"><button type="button" class="ck-sim" data-ck="todos">Aceitar todos</button><button type="button" data-ck="necessarios">Só os necessários</button><button type="button" data-ck="personalizar">Personalizar</button></div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]'); if (!b) return;
      if (b.dataset.ck === 'todos') salvar(true, true);
      else if (b.dataset.ck === 'necessarios') salvar(false, false);
      else abrirPainel(b);
    });
    document.body.appendChild(banner);
  }
  function fecharBanner() { if (banner) { banner.remove(); banner = null; } }
  function abrirPainel(origem) {
    quemAbriu = origem || document.activeElement;
    fundo = document.createElement('div'); fundo.className = 'ck-fundo';
    painel = document.createElement('div'); painel.className = 'ck-painel'; painel.setAttribute('role', 'dialog'); painel.setAttribute('aria-modal', 'true'); painel.setAttribute('aria-labelledby', 'ck-t');
    var a = estado ? estado.analytics : false, m = estado ? estado.marketing : false;
    painel.innerHTML = '<h2 id="ck-t">Preferências de cookies</h2><p>Escolha o que podemos usar. Você pode mudar a qualquer momento pelo link “Preferências de cookies” no rodapé.</p>'
      + '<div class="ck-cat"><b>Necessários</b><label class="ck-sw"><input type="checkbox" checked disabled aria-label="Cookies necessários, sempre ativos"><span></span></label><small>Guardam a sua escolha de cookies e a origem da visita durante a sessão. Sem eles o site não funciona corretamente.</small></div>'
      + '<div class="ck-cat"><b>Medição</b><label class="ck-sw"><input type="checkbox" id="ck-a"' + (a ? ' checked' : '') + ' aria-label="Cookies de medição (Google Analytics)"><span></span></label><small>Google Analytics: páginas visitadas, uso do simulador e cliques, de forma agregada.</small></div>'
      + '<div class="ck-cat"><b>Marketing</b><label class="ck-sw"><input type="checkbox" id="ck-m"' + (m ? ' checked' : '') + ' aria-label="Cookies de marketing (Meta Pixel)"><span></span></label><small>Pixel da Meta (Facebook e Instagram): mede o resultado de anúncios e permite mostrar anúncios relevantes.</small></div>'
      + '<div class="ck-acoes"><button type="button" class="ck-sim" data-ck="salvar">Salvar preferências</button><button type="button" data-ck="todos">Aceitar todos</button><button type="button" data-ck="nenhum">Recusar opcionais</button></div>';
    painel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]'); if (!b) return;
      if (b.dataset.ck === 'salvar') salvar(painel.querySelector('#ck-a').checked, painel.querySelector('#ck-m').checked);
      else if (b.dataset.ck === 'todos') salvar(true, true);
      else salvar(false, false);
    });
    fundo.addEventListener('click', fecharPainel);
    document.body.appendChild(fundo); document.body.appendChild(painel);
    painel.querySelector('#ck-a').focus();
    document.addEventListener('keydown', teclas);
  }
  function teclas(e) {
    if (!painel) return;
    if (e.key === 'Escape') fecharPainel();
    if (e.key === 'Tab') {
      var f = painel.querySelectorAll('input:not([disabled]), button'), pri = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    }
  }
  function fecharPainel() {
    if (painel) { painel.remove(); fundo.remove(); painel = null; document.removeEventListener('keydown', teclas); if (quemAbriu && document.contains(quemAbriu)) quemAbriu.focus(); }
  }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-cookies]'); if (b) { e.preventDefault(); abrirPainel(b); } });

  // O aviso só aparece quando há medição configurada; sem IDs nenhum cookie opcional é usado.
  window.facileCookies = { abrirPreferencias: function () { abrirPainel(); }, mostrarAviso: montaBanner };
  function iniciar() { aplicar(); if (!estado && (CFG.ga4 || CFG.metaPixel)) montaBanner(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
