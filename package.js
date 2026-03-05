gsap.registerPlugin(ScrollTrigger);

gsap.from(".reveal", { y: 30, opacity: 0, duration: 1, stagger: 0.2 });

gsap.from(".price-card", {
    scrollTrigger: { trigger: ".pricing-grid", start: "top 85%" },
    opacity: 0,
    scale: 0.95,  
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
});
//  Carosello con loop e swipe touch
const cards = document.querySelectorAll('.price-card');

cards.forEach(card => {
    const track = card.querySelector('.carousel-track');
    const imgs = Array.from(track.querySelectorAll('img'));
    const nextBtn = card.querySelector('.next');
    const prevBtn = card.querySelector('.prev');
    
    let index = 0;

    function updateCarousel() {
        gsap.to(track, {
            x: -(index * 100) + "%",
            duration: 0.1,
            ease: "power2.inOut"
        });
    }

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % imgs.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + imgs.length) % imgs.length;
        updateCarousel();
    });

    let startX = 0;
    let moveX = 0;
    let isDown = false;

    track.addEventListener('pointerdown', e => {
        isDown = true;
        startX = e.clientX || e.touches[0].clientX;
    });
    track.addEventListener('pointermove', e => {
        if (!isDown) return;
        moveX = (e.clientX || e.touches[0].clientX) - startX;
    });
    track.addEventListener('pointerup', e => {
        if (!isDown) return;
        isDown = false;
        if (moveX < -50) { 
            index = (index + 1) % imgs.length;
        } else if (moveX > 50) { 
            index = (index - 1 + imgs.length) % imgs.length;
        }
        updateCarousel();
        moveX = 0;
    });
});