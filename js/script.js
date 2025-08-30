/**
 * Portfolio Créatif - Script Principal
 * Optimisé pour GitHub Pages et performance
 */

// Configuration globale
const CONFIG = {
    particles: {
        desktop: 40,
        mobile: 20,
        duration: { min: 20, max: 30 }
    },
    animations: {
        enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        parallaxStrength: 0.2,
        scrollThreshold: 100
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024
    }
};

// État global de l'application
const AppState = {
    isMenuOpen: false,
    currentSection: 'home',
    particlesCreated: false,
    fontsLoaded: false,
    isScrolling: false
};

/**
 * Gestion des particules d'arrière-plan
 */
class ParticleManager {
    constructor() {
        this.container = document.getElementById('particles');
        this.particles = [];
    }

    create() {
        if (!this.container || AppState.particlesCreated) return;

        const count = window.innerWidth < CONFIG.breakpoints.mobile 
            ? CONFIG.particles.mobile 
            : CONFIG.particles.desktop;

        // Nettoyer les particules existantes
        this.clear();

        for (let i = 0; i < count; i++) {
            this.createParticle(i);
        }

        AppState.particlesCreated = true;
        console.log(`✨ ${count} particules créées`);
    }

    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Propriétés aléatoires
        const startX = Math.random() * 100;
        const delay = Math.random() * 25;
        const duration = CONFIG.particles.duration.min + 
                        Math.random() * (CONFIG.particles.duration.max - CONFIG.particles.duration.min);

        particle.style.cssText = `
            left: ${startX}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '';
            this.particles = [];
            AppState.particlesCreated = false;
        }
    }

    recreate() {
        this.clear();
        this.create();
    }
}

/**
 * Gestion de la navigation
 */
class NavigationManager {
    constructor() {
        this.nav = document.querySelector('nav');
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('.nav-links a');
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveSection();
    }

    setupMobileMenu() {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Fermer le menu lors du clic sur un lien
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Fermer le menu lors du clic à l'extérieur
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && AppState.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        AppState.isMenuOpen = !AppState.isMenuOpen;
        this.menu.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded', AppState.isMenuOpen);
        this.toggle.textContent = AppState.isMenuOpen ? '✕' : '☰';
    }

    closeMenu() {
        AppState.isMenuOpen = false;
        this.menu.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.textContent = '☰';
    }

    setupSmoothScroll() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(link.getAttribute('href'));
            });
        });
    }

    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const navHeight = this.nav.offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveSection = () => {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    this.setActiveLink(sectionId);
                }
            });
        };

        // Throttled scroll listener
        let scrollTimeout = false;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                requestAnimationFrame(() => {
                    updateActiveSection();
                    scrollTimeout = false;
                });
                scrollTimeout = true;
            }
        });
    }

    setActiveLink(sectionId) {
        if (AppState.currentSection === sectionId) return;
        
        this.links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        AppState.currentSection = sectionId;
    }
}

/**
 * Gestion des animations
 */
class AnimationManager {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.fadeElements = document.querySelectorAll('.fade-in');
        this.init();
    }

    init() {
        if (!CONFIG.animations.enabled) return;
        
        this.setupScrollAnimations();
        this.setupParallax();
    }

    setupScrollAnimations() {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            
            this.fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < windowHeight - CONFIG.animations.scrollThreshold) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Initial check
        handleScroll();

        // Throttled scroll listener
        let animationTimeout = false;
        window.addEventListener('scroll', () => {
            if (!animationTimeout) {
                requestAnimationFrame(() => {
                    handleScroll();
                    animationTimeout = false;
                });
                animationTimeout = true;
            }
        });
    }

    setupParallax() {
        if (!this.hero) return;

        let parallaxTimeout = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const heroHeight = this.hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const translateY = scrolled * CONFIG.animations.parallaxStrength;
                const opacity = Math.max(0, 1 - scrolled / (heroHeight * 0.8));
                
                this.hero.style.transform = `translateY(${translateY}px)`;
                this.hero.style.opacity = opacity;
            }
        };

        window.addEventListener('scroll', () => {
            if (!parallaxTimeout) {
                requestAnimationFrame(() => {
                    updateParallax();
                    parallaxTimeout = false;
                });
                parallaxTimeout = true;
            }
        });
    }
}

/**
 * Gestion de l'accessibilité
 */
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaUpdates();
    }

    setupKeyboardNavigation() {
        // Navigation dans les grilles avec les flèches
        document.addEventListener('keydown', (e) => {
            const focusedElement = document.activeElement;
            
            if (this.isNavigableCard(focusedElement)) {
                this.handleGridNavigation(e, focusedElement);
            }
        });

        // Activation des cartes avec Enter/Space
        const interactiveCards = document.querySelectorAll('.social-card, .character-card');
        interactiveCards.forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.activateCard(card);
                }
            });
        });
    }

    isNavigableCard(element) {
        return element.classList.contains('social-card') || 
               element.classList.contains('character-card');
    }

    handleGridNavigation(e, focusedElement) {
        const container = focusedElement.parentElement;
        const cards = Array.from(container.children);
        const currentIndex = cards.indexOf(focusedElement);
        let nextIndex = currentIndex;

        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % cards.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = (currentIndex - 1 + cards.length) % cards.length;
                break;
            default:
                return;
        }

        if (nextIndex !== currentIndex) {
            e.preventDefault();
            cards[nextIndex].focus();
        }
    }

    activateCard(card) {
        // Animation de clic
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Logique spécifique selon le type de carte
        if (card.classList.contains('social-card')) {
            this.handleSocialCardClick(card);
        } else if (card.classList.contains('character-card')) {
            this.handleCharacterCardClick(card);
        }
    }

    handleSocialCardClick(card) {
        const platform = card.querySelector('h3').textContent;
        const username = card.querySelector('p').textContent;
        
        // Ici vous pourriez ajouter la logique pour ouvrir le profil
        console.log(`Clic sur ${platform}: ${username}`);
        
        // Exemple d'ouverture de lien (à personnaliser)
        // window.open(`https://twitter.com/${username.replace('@', '')}`, '_blank');
    }

    handleCharacterCardClick(card) {
        const characterName = card.querySelector('.character-name').textContent;
        console.log(`Affichage des détails de ${characterName}`);
        
        // Ici vous pourriez ouvrir une modal ou naviguer vers une page de détails
        this.showCharacterModal(characterName);
    }

    showCharacterModal(characterName) {
        // Placeholder pour une future modal
        alert(`Détails de ${characterName} - Fonctionnalité à implémenter`);
    }

    setupFocusManagement() {
        // Améliorer la visibilité du focus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupAriaUpdates() {
        // Mise à jour des attributs ARIA dynamiques
        const updateAriaLabels = () => {
            const currentTime = new Date().toLocaleTimeString('fr-FR');
            document.documentElement.setAttribute('data-updated', currentTime);
        };

        // Mettre à jour toutes les 5 minutes
        setInterval(updateAriaLabels, 300000);
        updateAriaLabels();
    }
}

/**
 * Gestion des performances
 */
class PerformanceManager {
    constructor() {
        this.observers = new Map();
        this.timers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupResizeHandler();
        this.setupLoadOptimizations();
        this.monitorPerformance();
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Lazy load si nécessaire
                    this.lazyLoadElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observer toutes les sections et cartes
        document.querySelectorAll('section, .social-card, .fiction-card, .character-card').forEach(el => {
            observer.observe(el);
        });

        this.observers.set('intersection', observer);
    }

    lazyLoadElement(element) {
        // Chargement paresseux des images
        const images = element.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        });
    }

    setupResizeHandler() {
        const handleResize = () => {
            // Recréer les particules si nécessaire
            if (window.particleManager) {
                window.particleManager.recreate();
            }

            // Ajuster la navigation mobile
            if (window.innerWidth > CONFIG.breakpoints.mobile && AppState.isMenuOpen) {
                window.navigationManager.closeMenu();
            }

            console.log(`📐 Resize détecté: ${window.innerWidth}x${window.innerHeight}`);
        };

        // Debounced resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.timers.get('resize'));
            this.timers.set('resize', setTimeout(handleResize, 250));
        });
    }

    setupLoadOptimizations() {
        // Préchargement des polices critiques
        if ('fonts' in document) {
            document.fonts.load('700 1rem Inter').then(() => {
                AppState.fontsLoaded = true;
                document.body.classList.add('fonts-loaded');
                console.log('📝 Polices chargées');
            }).catch(err => {
                console.warn('⚠️ Erreur chargement polices:', err);
            });
        }

        // Gestion des liens externes
        this.setupExternalLinks();
    }

    setupExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('aria-label', `${link.textContent} (ouvre dans un nouvel onglet)`);
            }
        });
    }

    monitorPerformance() {
        // Surveillance des performances
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                        console.log(`⚡ Temps de chargement: ${loadTime.toFixed(2)}ms`);
                    }
                }, 0);
            });
        }
    }

    // Méthode publique pour nettoyer les observers
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.timers.forEach(timer => clearTimeout(timer));
    }
}

/**
 * Gestion des thèmes (prêt pour mode sombre)
 */
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Thème par défaut
        this.init();
    }

    init() {
        this.detectSystemPreference();
        this.setupThemeToggle();
    }

    detectSystemPreference() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        prefersDark.addEventListener('change', (e) => {
            if (e.matches) {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Sauvegarder la préférence (si localStorage disponible)
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            console.warn('Impossible de sauvegarder le thème');
        }
    }

    setupThemeToggle() {
        // Créer un bouton de toggle (peut être ajouté plus tard)
        const createToggleButton = () => {
            const button = document.createElement('button');
            button.className = 'theme-toggle';
            button.setAttribute('aria-label', 'Changer de thème');
            button.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            
            button.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
                button.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            });

            return button;
        };

        // Ajouter le bouton à la navigation (optionnel)
        // const navContainer = document.querySelector('.nav-container');
        // if (navContainer) {
        //     navContainer.appendChild(createToggleButton());
        // }
    }
}

/**
 * Gestion des erreurs globales
 */
class ErrorManager {
    constructor() {
        this.setupErrorHandling();
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', e.error, e.filename, e.lineno);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Promise Rejection', e.reason);
        });
    }

    logError(type, error, filename = '', line = '') {
        const errorInfo = {
            type,
            message: error.message || error,
            filename,
            line,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error('🚨 Erreur détectée:', errorInfo);

        // En production, vous pourriez envoyer ces erreurs à un service de monitoring
        // this.sendErrorToService(errorInfo);
    }

    sendErrorToService(errorInfo) {
        // Placeholder pour service d'analytics/monitoring
        // fetch('/api/errors', {
        //     method: 'POST',
        //     body: JSON.stringify(errorInfo)
        // }).catch(() => {}); // Éviter les erreurs en cascade
    }
}

/**
 * Gestionnaire principal de l'application
 */
class PortfolioApp {
    constructor() {
        this.managers = {};
        this.init();
    }

    async init() {
        console.log('🎨 Initialisation du Portfolio...');

        try {
            // Attendre que le DOM soit prêt
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialiser les managers
            this.managers.error = new ErrorManager();
            this.managers.particles = new ParticleManager();
            this.managers.navigation = new NavigationManager();
            this.managers.animation = new AnimationManager();
            this.managers.performance = new PerformanceManager();
            this.managers.theme = new ThemeManager();

            // Exposer les managers globalement pour debug
            window.particleManager = this.managers.particles;
            window.navigationManager = this.managers.navigation;

            // Créer les particules
            this.managers.particles.create();

            // Configuration des analytics (optionnel)
            this.initAnalytics();

            console.log('✅ Portfolio initialisé avec succès');

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
        }
    }

    initAnalytics() {
        // Placeholder pour Google Analytics ou autre
        if (typeof gtag === 'function') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
            });
            
            console.log('📊 Analytics initialisés');
        }
    }

    // Méthodes publiques pour debug/extension
    recreateParticles() {
        this.managers.particles.recreate();
    }

    toggleMobileMenu() {
        this.managers.navigation.toggleMenu();
    }

    getAppState() {
        return { ...AppState };
    }

    cleanup() {
        Object.values(this.managers).forEach(manager => {
            if (manager.cleanup) manager.cleanup();
        });
    }
}

/**
 * Utilitaires
 */
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Detect touch device
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // Format numbers (pour futures stats)
    formatNumber(num) {
        return new Intl.NumberFormat('fr-FR').format(num);
    },

    // Copier du texte dans le clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.warn('Impossible de copier:', err);
            return false;
        }
    }
};

/**
 * Service Worker registration (optionnel)
 */
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        // Décommenter si vous créez un service worker
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🔄 Service Worker enregistré:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Échec Service Worker:', error);
            });
        */
    });
}

/**
 * Mode debug pour développement
 */
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.search.includes('debug=true')) {
    
    console.log('🔧 Mode debug activé');
    
    // Outils de debug globaux
    window.PortfolioDebug = {
        state: () => AppState,
        config: () => CONFIG,
        recreateParticles: () => window.particleManager?.recreate(),
        toggleMenu: () => window.navigationManager?.toggleMenu(),
        utils: Utils
    };

    // Styles de debug
    const debugStyles = `
        .debug-info {
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = debugStyles;
    document.head.appendChild(styleSheet);
}

/**
 * Initialisation de l'application
 */
const app = new PortfolioApp();

// Nettoyage lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    app.cleanup();
});

// Export pour usage externe (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, Utils };
}
