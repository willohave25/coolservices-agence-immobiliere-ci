/* ============================================================
   CSAI PWA — Banniere d'installation discrete
   Android/Web : fleche + bouton Installer
   iOS/Safari  : message "Ajouter a l'ecran d'accueil"
   ============================================================ */
(function () {
  'use strict';

  // Enregistrement Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  }

  // Ne pas afficher si deja installe ou deja refuse
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (navigator.standalone) return;
  if (sessionStorage.getItem('pwa-dismissed')) return;

  var deferredPrompt = null;
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // CSS de la banniere
  var style = document.createElement('style');
  style.textContent = [
    '#pwa-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;',
    'background:linear-gradient(135deg,#003399,#001a66);color:#fff;',
    'padding:12px 16px;display:flex;align-items:center;gap:12px;',
    'font-family:"Inter",sans-serif;font-size:14px;',
    'box-shadow:0 -2px 12px rgba(0,0,0,.25);',
    'transform:translateY(100%);transition:transform .4s ease;',
    'border-top:2px solid #e6a817;}',
    '#pwa-banner.show{transform:translateY(0);}',
    '#pwa-banner .pwa-icon{width:40px;height:40px;border-radius:10px;flex-shrink:0;}',
    '#pwa-banner .pwa-text{flex:1;line-height:1.4;}',
    '#pwa-banner .pwa-text strong{display:block;font-size:15px;color:#e6a817;}',
    '#pwa-banner .pwa-arrow{font-size:20px;animation:pwa-bounce 1.5s infinite;}',
    '#pwa-banner .pwa-btn{background:#e6a817;color:#001a66;border:none;',
    'padding:8px 18px;border-radius:20px;font-weight:700;font-size:13px;',
    'cursor:pointer;white-space:nowrap;}',
    '#pwa-banner .pwa-btn:hover{background:#ffc928;}',
    '#pwa-banner .pwa-close{background:none;border:none;color:rgba(255,255,255,.6);',
    'font-size:20px;cursor:pointer;padding:4px 8px;line-height:1;}',
    '#pwa-banner .pwa-close:hover{color:#fff;}',
    '@keyframes pwa-bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}'
  ].join('');
  document.head.appendChild(style);

  function createBanner(content) {
    var banner = document.createElement('div');
    banner.id = 'pwa-banner';
    banner.innerHTML =
      '<img class="pwa-icon" src="images/logo/logocesai-android-chrome-192x192.png" alt="CSAI">' +
      '<div class="pwa-text">' + content + '</div>' +
      '<button class="pwa-close" aria-label="Fermer">&times;</button>';

    document.body.appendChild(banner);

    banner.querySelector('.pwa-close').addEventListener('click', function () {
      banner.classList.remove('show');
      sessionStorage.setItem('pwa-dismissed', '1');
      setTimeout(function () { banner.remove(); }, 400);
    });

    // Install button click (Android/Web)
    var btn = banner.querySelector('.pwa-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function () {
            deferredPrompt = null;
            banner.classList.remove('show');
            setTimeout(function () { banner.remove(); }, 400);
          });
        }
      });
    }

    setTimeout(function () { banner.classList.add('show'); }, 2000);
  }

  if (isIOS) {
    // iOS/Safari — message avec instructions
    createBanner(
      '<strong>Installer CSAI</strong>' +
      'Appuyez sur <span style="font-size:18px">&#9757;</span> ' +
      'puis <strong>"Ajouter a l\'ecran d\'accueil"</strong>'
    );
  } else {
    // Android / Chrome / Edge — intercepter beforeinstallprompt
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      createBanner(
        '<strong>Installer CSAI</strong>' +
        'Acces rapide depuis votre ecran' +
        '<span class="pwa-arrow">&#8595;</span>' +
        '&nbsp;<button class="pwa-btn">Installer</button>'
      );
    });
  }

})();
