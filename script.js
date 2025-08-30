 <script>

        function copyDiscord() {
    navigator.clipboard.writeText('kitsumiro').then(() => {
        const card = event.currentTarget;
        const originalHTML = card.innerHTML;
        card.style.background = 'rgba(99, 102, 241, 0.2)';
        
        // Ajoute le message "Copié!"
        const notification = document.createElement('span');
        notification.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.9rem; z-index: 10;';
        notification.textContent = 'Copié !';
        card.appendChild(notification);
        
        // Retire le message après 2 secondes
        setTimeout(() => {
            card.style.background = '';
            notification.remove();
        }, 2000);
    });
}
        // Génération des particules simplifiée
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            if (!particlesContainer) return;
            
            const particleCount = window.innerWidth < 768 ? 20 : 40;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 25 + 's';
                particle.style.animationDuration = (20 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }
        
        // Menu mobile
        function initMobileMenu() {
            const toggle = document.querySelector('.mobile-menu-toggle');
            const menu = document.querySelector('.nav-links');
            
            if (!toggle || !menu) return;
            
            toggle.addEventListener('click', function() {
                const isOpen = menu.classList.contains('active');
                menu.classList.toggle('active');
                toggle.setAttribute('aria-expanded', !isOpen);
                toggle.textContent = isOpen ? '☰' : '✕';
            });
            
            // Fermer le menu quand on clique sur un lien
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.textContent = '☰';
                });
            });
        }
        
        // Smooth scroll
        function initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const target = document.querySelector(targetId);
                    if (target) {
                        const navHeight = document.querySelector('nav').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
        
        // Gestion des événements clavier
        function initKeyboardNavigation() {
            const interactiveCards = document.querySelectorAll('.social-card, .character-card');
            interactiveCards.forEach(card => {
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Ajouter ici la logique de clic si nécessaire
                    }
                });
            });
        }
        
        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            initMobileMenu();
            initSmoothScroll();
            initKeyboardNavigation();
        });
        
        // Gestion des erreurs
        window.addEventListener('error', function(e) {
            console.warn('Erreur détectée:', e.error);
        });
        
        // Optimisation resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                const particlesContainer = document.getElementById('particles');
                if (particlesContainer) {
                    particlesContainer.innerHTML = '';
                    createParticles();
                }
            }, 250);
        });

        // Animation d'apparition au scroll (alternative à Intersection Observer)
        function handleScrollAnimations() {
            const elements = document.querySelectorAll('.fade-in');
            const windowHeight = window.innerHeight;
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < windowHeight - 100) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }

        // Throttling pour l'event scroll
        let scrollTimeout = false;
        window.addEventListener('scroll', function() {
            if (!scrollTimeout) {
                requestAnimationFrame(function() {
                    handleScrollAnimations();
                    scrollTimeout = false;
                });
                scrollTimeout = true;
            }
        });

        // Effet parallaxe léger pour le hero
        function updateParallax() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
        }

        // Throttling pour le parallax
        let parallaxTimeout = false;
        window.addEventListener('scroll', function() {
            if (!parallaxTimeout) {
                requestAnimationFrame(function() {
                    updateParallax();
                    parallaxTimeout = false;
                });
                parallaxTimeout = true;
            }
        });

        // Amélioration de l'accessibilité : navigation par touches
        document.addEventListener('keydown', function(e) {
            // Navigation avec les flèches dans les grilles
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
                e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('social-card') || 
                    focusedElement.classList.contains('character-card')) {
                    
                    const container = focusedElement.parentElement;
                    const cards = Array.from(container.children);
                    const currentIndex = cards.indexOf(focusedElement);
                    let nextIndex = currentIndex;
                    
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        nextIndex = (currentIndex + 1) % cards.length;
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        nextIndex = (currentIndex - 1 + cards.length) % cards.length;
                    }
                    
                    if (nextIndex !== currentIndex) {
                        e.preventDefault();
                        cards[nextIndex].focus();
                    }
                }
            }
        });

        // Gestion des liens externes (si ajoutés plus tard)
        function handleExternalLinks() {
            document.querySelectorAll('a[href^="http"]').forEach(link => {
                if (!link.hostname.includes(window.location.hostname)) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
        }

        // Performance : lazy loading pour les images (si ajoutées)
        function initLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }

        // Préchargement des sections critiques
        function preloadCriticalResources() {
            // Précharger les polices importantes
            if ('fonts' in document) {
                document.fonts.load('700 1rem Inter').then(() => {
                    document.body.classList.add('fonts-loaded');
                });
            }
        }

        // Theme switcher (pour une future fonctionnalité)
        function initThemeSwitcher() {
            // Détecter la préférence système
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Écouter les changements de préférence
            prefersDark.addEventListener('change', (e) => {
                if (e.matches) {
                    document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.body.setAttribute('data-theme', 'light');
                }
            });
        }

        // Mise à jour de l'initialisation
        document.addEventListener('DOMContentLoaded', function() {
            // Fonctions de base
            createParticles();
            initMobileMenu();
            initSmoothScroll();
            initKeyboardNavigation();
            
            // Fonctions avancées
            handleScrollAnimations();
            handleExternalLinks();
            initLazyLoading();
            preloadCriticalResources();
            initThemeSwitcher();
            
            // Déclencher l'animation initiale
            setTimeout(() => {
                handleScrollAnimations();
            }, 100);
        });

        // Service Worker pour la mise en cache (optionnel)
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            window.addEventListener('load', () => {
                // Décommenter si vous créez un service worker
                /*
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered'))
                    .catch(error => console.log('SW registration failed'));
                */
            });
        }

        // Analytics (placeholder pour Google Analytics ou autre)
        function initAnalytics() {
            // Exemple d'implémentation d'analytics respectueuse de la vie privée
            if (typeof gtag === 'function') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    anonymize_ip: true,
                    cookie_flags: 'SameSite=None;Secure'
                });
            }
        }

        // Debug mode pour le développement
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🎨 Portfolio en mode développement');
            
            // Ajouter des outils de debug
            window.portfolioDebug = {
                recreateParticles: createParticles,
                triggerAnimations: handleScrollAnimations,
                toggleMobileMenu: function() {
                    document.querySelector('.nav-links').classList.toggle('active');
                }
            };
        }
    </script>
