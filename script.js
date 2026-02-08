

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});


class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        document.body.appendChild(this.container);
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            pointer-events: none;
        `;
        return container;
    }
    
    show(type, title, message, duration = 5000) {
        const notification = this.createNotification(type, title, message);
        this.container.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        if (duration > 0) {
            setTimeout(() => {
                this.close(notification);
            }, duration);
        }
        
        return notification;
    }
    
    createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.pointerEvents = 'auto';
        
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                ${icon}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Fermer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.close(notification));
        
        return notification;
    }
    
    getIcon(type) {
        const icons = {
            success: `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            `,
            error: `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            `,
            info: `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            `,
            warning: `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            `
        };
        return icons[type] || icons.info;
    }
    
    close(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }
    
    success(title, message, duration) {
        return this.show('success', title, message, duration);
    }
    
    error(title, message, duration) {
        return this.show('error', title, message, duration);
    }
    
    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }
    
    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    }
}


class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.updateActiveLink(link);
            });
        });
        
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('scroll', () => this.updateActiveOnScroll());
    }
    
    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMenu() {
        if (this.navToggle) this.navToggle.classList.remove('active');
        if (this.navMenu) this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            this.nav.classList.add('hidden');
        } else {
            this.nav.classList.remove('hidden');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    updateActiveLink(link) {
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }
    
    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x -= dx * force * 0.03;
                    particle.y -= dy * force * 0.03;
                }
            }
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
            this.ctx.fill();
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll]');
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.elements.forEach(el => this.observer.observe(el));
    }
}

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 48;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.COOLDOWN_HOURS = 0;
        this.STORAGE_KEY = 'lastContactSubmission';
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.checkCooldown();
    }
    
    checkCooldown() {
        const lastSubmission = localStorage.getItem(this.STORAGE_KEY);
        
        if (lastSubmission) {
            const lastTime = parseInt(lastSubmission);
            const now = Date.now();
            const hoursPassed = (now - lastTime) / (1000 * 60 * 60);
            
            if (hoursPassed < this.COOLDOWN_HOURS) {
                const hoursLeft = Math.ceil(this.COOLDOWN_HOURS - hoursPassed);
                this.disableForm(hoursLeft);
            }
        }
    }
    
    disableForm(hoursLeft) {
        const submitBtn = this.form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = `Disponible dans ${hoursLeft}h`;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
        
        const infoMessage = document.createElement('div');
        infoMessage.className = 'cooldown-info';
        infoMessage.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Vous pourrez envoyer un nouveau message dans ${hoursLeft} heure${hoursLeft > 1 ? 's' : ''}.</span>
        `;
        
        this.form.insertBefore(infoMessage, this.form.firstChild);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const lastSubmission = localStorage.getItem(this.STORAGE_KEY);
        if (lastSubmission) {
            const lastTime = parseInt(lastSubmission);
            const now = Date.now();
            const hoursPassed = (now - lastTime) / (1000 * 60 * 60);
            
            if (hoursPassed < this.COOLDOWN_HOURS) {
                const hoursLeft = Math.ceil(this.COOLDOWN_HOURS - hoursPassed);
                this.showError(`Vous devez attendre ${hoursLeft} heure${hoursLeft > 1 ? 's' : ''} avant d'envoyer un nouveau message.`);
                return;
            }
        }
        
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        const btnText = submitBtn.querySelector('.btn-text');
        
        btnText.innerHTML = '<span class="loading-spinner"></span> Envoi...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Enregistrer l'heure d'envoi
                localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
                
                this.showSuccess();
                this.form.reset();
                
                this.checkCooldown();
            } else {
                throw new Error(data.message || 'Erreur lors de l\'envoi');
            }
            
        } catch (error) {
            console.error('Erreur:', error);
            this.showError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            if (!localStorage.getItem(this.STORAGE_KEY) || 
                (Date.now() - parseInt(localStorage.getItem(this.STORAGE_KEY))) / (1000 * 60 * 60) >= this.COOLDOWN_HOURS) {
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        }
    }
    
    showSuccess() {
        if (window.notify) {
            window.notify.success(
                'Message envoyé !',
                'Merci pour votre message. Nous vous répondrons dans les plus brefs délais.',
                6000
            );
        }
    }
    
    showError(message) {
        if (window.notify) {
            window.notify.error(
                'Erreur',
                message || 'Une erreur est survenue. Veuillez réessayer.',
                7000
            );
        }
    }
}

class CGVModal {
    constructor() {
        this.modal = document.getElementById('cgvModal');
        this.openBtn = document.getElementById('cgvLink');
        this.closeBtn = document.getElementById('closeCGV');
        this.overlay = this.modal?.querySelector('.modal-overlay');
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        if (this.openBtn) {
            this.openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

class MentionsModal {
    constructor() {
        this.modal = document.getElementById('mentionsModal');
        this.openBtn = document.getElementById('mentionsLink');
        this.closeBtn = document.getElementById('closeMentions');
        this.overlay = this.modal?.querySelector('.modal-overlay');
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        if (this.openBtn) {
            this.openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

class ConfidentialiteModal {
    constructor() {
        this.modal = document.getElementById('confidentialiteModal');
        this.openBtn = document.getElementById('confidentialiteLink');
        this.closeBtn = document.getElementById('closeConfidentialite');
        this.overlay = this.modal?.querySelector('.modal-overlay');
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        if (this.openBtn) {
            this.openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.notify = new NotificationSystem();
    
    new Navigation();
    new ParticleBackground('particlesCanvas');
    new ScrollAnimations();
    new CounterAnimation();
    new SmoothScroll();
    new ContactForm();
    new CGVModal();
    new MentionsModal();
    new ConfidentialiteModal();
    
    document.querySelectorAll('.about-content, .expertise-card, .contact-info, .contact-form-wrapper').forEach(el => {
        el.setAttribute('data-scroll', '');
    });
    
    new ScrollAnimations();
    
    const cgvLinkBottom = document.getElementById('cgvLinkBottom');
    const mentionsLinkBottom = document.getElementById('mentionsLinkBottom');
    const confidentialiteLinkBottom = document.getElementById('confidentialiteLinkBottom');
    
    if (cgvLinkBottom) {
        cgvLinkBottom.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cgvModal')?.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mentionsLinkBottom) {
        mentionsLinkBottom.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('mentionsModal')?.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (confidentialiteLinkBottom) {
        confidentialiteLinkBottom.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('confidentialiteModal')?.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
});
