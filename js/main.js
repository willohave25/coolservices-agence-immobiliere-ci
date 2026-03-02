/* ============================================
   CSAI — Cool Services Agence Immobiliere
   JavaScript Global — W2K-Digital 2025
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    /* ----------------------------------------
       Header sticky au scroll
       ---------------------------------------- */
    var header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    /* ----------------------------------------
       Hamburger menu mobile — supporte les 2 structures HTML
       Structure A (pages services): .mobile-drawer > .mobile-nav-list (pas de .drawer-content)
       Structure B (pages legales): .mobile-drawer > .drawer-overlay + .drawer-content
       ---------------------------------------- */
    var hamburger = document.querySelector('.hamburger');
    var drawer = document.querySelector('.mobile-drawer');
    var overlay = document.querySelector('.mobile-overlay');
    var drawerOverlay = document.getElementById('drawerOverlay');
    var drawerClose = document.getElementById('drawerClose');
    var drawerContent = drawer ? drawer.querySelector('.drawer-content') : null;

    /* Identifier la structure pour le CSS */
    if (drawer && !drawerContent) {
        drawer.classList.add('drawer-simple');
    }

    function openMobile() {
        if (drawer) {
            drawer.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
        }
        if (overlay) overlay.classList.add('active');
        if (drawerOverlay) drawerOverlay.classList.add('active');
        if (hamburger) {
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobile() {
        if (drawer) {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
        }
        if (overlay) overlay.classList.remove('active');
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            if (drawer && drawer.classList.contains('open')) {
                closeMobile();
            } else {
                openMobile();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeMobile);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeMobile);
    }

    if (drawerClose) {
        drawerClose.addEventListener('click', closeMobile);
    }

    /* Fermer drawer sur lien clique (sauf sous-menu toggle) */
    if (drawer) {
        drawer.querySelectorAll('a:not(.mobile-submenu-toggle):not(.drawer-dropdown-toggle)').forEach(function(link) {
            if (!link.getAttribute('href') || link.getAttribute('href') === '#') return;
            link.addEventListener('click', closeMobile);
        });
    }

    /* Sous-menu mobile toggle — ancienne structure */
    var subToggles = document.querySelectorAll('.mobile-submenu-toggle');
    subToggles.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var submenu = btn.nextElementSibling;
            btn.classList.toggle('open');
            if (submenu) submenu.classList.toggle('open');
        });
    });

    /* Sous-menu mobile toggle — nouvelle structure drawer */
    var drawerDropdowns = document.querySelectorAll('.drawer-dropdown-toggle');
    drawerDropdowns.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            var submenu = toggle.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('open');
                var arrow = toggle.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : '';
                }
            }
        });
    });

    /* Sous-menu mobile — structure .drawer-has-dropdown > a */
    var drawerHasDropdowns = document.querySelectorAll('.drawer-has-dropdown > a');
    drawerHasDropdowns.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var parent = link.parentElement;
            var submenu = parent.querySelector('.drawer-dropdown-menu');
            if (submenu) {
                submenu.classList.toggle('open');
                var arrow = link.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : '';
                }
            }
        });
    });

    /* ----------------------------------------
       Animations au scroll (Intersection Observer)
       ---------------------------------------- */
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (reveals.length > 0 && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

        reveals.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        /* Fallback — afficher tout si pas d'IntersectionObserver */
        reveals.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    /* ----------------------------------------
       Compteurs animes (chiffres cles)
       ---------------------------------------- */
    animateCounters();

    /* ----------------------------------------
       Slider temoignages droite a gauche
       ---------------------------------------- */
    initSliderTemoignages();

    /* ----------------------------------------
       Filtres portfolio
       ---------------------------------------- */
    initPortfolioFilters();

    /* ----------------------------------------
       Validation formulaire contact
       ---------------------------------------- */
    initContactForm();
});


/* ============================================
   Compteurs animes
   ============================================ */
function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.dataset.count, 10);
                var prefix = el.dataset.prefix || '';
                var suffix = el.dataset.suffix || '';
                var duration = 2000;
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = Math.floor(eased * target);
                    el.textContent = prefix + current.toLocaleString('fr-FR') + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                }

                requestAnimationFrame(step);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    counters.forEach(function(el) {
        counterObserver.observe(el);
    });
}


/* ============================================
   Slider temoignages — boucle infinie
   ============================================ */
function initSliderTemoignages() {
    var track = document.getElementById('sliderTrack');
    if (!track) return;

    /* Clone pour boucle infinie seamless */
    var originals = Array.from(track.children);
    originals.forEach(function(card) {
        track.appendChild(card.cloneNode(true));
    });

    var pos = 0;
    var speed = 0.5;
    var paused = false;

    function animate() {
        if (!paused) {
            pos -= speed;
            var halfWidth = track.scrollWidth / 2;
            if (Math.abs(pos) >= halfWidth) pos = 0;
            track.style.transform = 'translateX(' + pos + 'px)';
        }
        requestAnimationFrame(animate);
    }

    var wrapper = track.closest('.slider-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', function() { paused = true; });
        wrapper.addEventListener('mouseleave', function() { paused = false; });
        wrapper.addEventListener('touchstart', function() { paused = true; }, { passive: true });
        wrapper.addEventListener('touchend', function() {
            setTimeout(function() { paused = false; }, 2000);
        }, { passive: true });
    }

    animate();
}


/* ============================================
   Filtres portfolio
   ============================================ */
function initPortfolioFilters() {
    var filterBtns = document.querySelectorAll('.portfolio-filters button');
    var items = document.querySelectorAll('.portfolio-item');
    if (filterBtns.length === 0 || items.length === 0) return;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.dataset.filter;
            items.forEach(function(item) {
                if (filter === 'tous' || item.dataset.category === filter) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    setTimeout(function() { item.style.opacity = '1'; }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(function() { item.style.display = 'none'; }, 300);
                }
            });
        });
    });
}


/* ============================================
   Validation formulaire contact
   ============================================ */
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var valid = true;

        /* Reset erreurs */
        form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function(input) {
            input.classList.remove('error');
        });

        /* Nom */
        var nom = form.querySelector('#contact-nom');
        if (nom && nom.value.trim().length < 2) {
            nom.classList.add('error');
            valid = false;
        }

        /* Email */
        var email = form.querySelector('#contact-email');
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            valid = false;
        }

        /* Telephone */
        var tel = form.querySelector('#contact-tel');
        if (tel && tel.value.trim().length < 8) {
            tel.classList.add('error');
            valid = false;
        }

        /* Service */
        var service = form.querySelector('#contact-service');
        if (service && service.value === '') {
            service.classList.add('error');
            valid = false;
        }

        /* Message */
        var message = form.querySelector('#contact-message');
        if (message && message.value.trim().length < 10) {
            message.classList.add('error');
            valid = false;
        }

        if (valid) {
            var btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = 'Message envoye !';
                btn.disabled = true;
                btn.style.background = '#27AE60';
                btn.style.color = '#fff';
            }
            setTimeout(function() {
                form.reset();
                if (btn) {
                    btn.textContent = 'Envoyer le Message';
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                }
            }, 4000);
        }
    });
}
