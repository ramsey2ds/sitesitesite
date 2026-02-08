// ===================================
// ANIMATIONS SIMPLES & PROPRES
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // ANIMATION TEXTE AU SCROLL
    // ===================================
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Animer les sections (textes)
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Animer les titres et paragraphes
    const textElements = document.querySelectorAll('.section-title, .section-description, .hero-title, .hero-subtitle, .about-content h3, .about-text p');
    textElements.forEach(el => {
        observer.observe(el);
    });
    
    console.log('✨ Animations chargées !');
});

