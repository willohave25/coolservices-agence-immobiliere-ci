/* ============================================
   Auto-scroll Premium — W2K-Digital 2025
   Module autonome — Vitrine digitale animée
   ============================================ */
var W2KAutoScroll = {
    config: {
        speed: 1.2,
        tickInterval: 16,
        initialDelay: 3000,
        inactivityDelay: 45000,
        nextPageDelay: 2000,
        showIndicator: true
    },

    state: {
        paused: false,
        rafId: null,
        inactivityTimer: null,
        active: false
    },

    init: function(customConfig) {
        if (document.body.dataset.autoscroll !== 'true') return;
        if (customConfig) {
            for (var key in customConfig) {
                if (customConfig.hasOwnProperty(key)) {
                    this.config[key] = customConfig[key];
                }
            }
        }
        this.state.active = true;
        if (this.config.showIndicator) this.renderIndicator();
        this.bindUserEvents();
        var self = this;
        setTimeout(function() { self.start(); }, self.config.initialDelay);
    },

    start: function() {
        this.state.paused = false;
        this.updateIndicator(false);
        this.tick();
    },

    tick: function() {
        if (this.state.paused || !this.state.active) return;
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 2) {
            this.goNextPage();
            return;
        }
        window.scrollBy(0, this.config.speed);
        var self = this;
        this.state.rafId = requestAnimationFrame(function() {
            setTimeout(function() { self.tick(); }, self.config.tickInterval);
        });
    },

    goNextPage: function() {
        var next = document.body.dataset.nextPage;
        if (!next) return;
        this.state.active = false;
        setTimeout(function() {
            window.location.href = next;
        }, this.config.nextPageDelay);
    },

    pause: function() {
        if (this.state.paused) return;
        this.state.paused = true;
        if (this.state.rafId) cancelAnimationFrame(this.state.rafId);
        clearTimeout(this.state.inactivityTimer);
        this.updateIndicator(true);
        var self = this;
        this.state.inactivityTimer = setTimeout(function() {
            self.resume();
        }, self.config.inactivityDelay);
    },

    resume: function() {
        this.state.paused = false;
        this.updateIndicator(false);
        this.tick();
    },

    bindUserEvents: function() {
        var self = this;
        var events = ['click', 'touchstart', 'keydown', 'wheel', 'mousedown'];
        events.forEach(function(evt) {
            document.addEventListener(evt, function() { self.pause(); }, { passive: true });
        });
    },

    renderIndicator: function() {
        var dot = document.createElement('div');
        dot.id = 'w2k-dot';
        dot.className = 'w2k-autoscroll-dot';
        dot.title = 'Auto-scroll actif — cliquer pour pause';
        var self = this;
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            if (self.state.paused) {
                clearTimeout(self.state.inactivityTimer);
                self.resume();
            } else {
                self.pause();
            }
        });
        document.body.appendChild(dot);
    },

    updateIndicator: function(paused) {
        var dot = document.getElementById('w2k-dot');
        if (!dot) return;
        if (paused) {
            dot.classList.add('paused');
        } else {
            dot.classList.remove('paused');
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    W2KAutoScroll.init();
});
