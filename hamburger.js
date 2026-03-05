const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    // Aggiunge o toglie la classe 'active' ad entrambi gli elementi
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Blocca lo scroll del body quando il menu è aperto
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Chiudi il menu se clicchi su un link (utile per navigazione interna)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});