gsap.registerPlugin(ScrollTrigger);

// Animazione entrata dei titoli
gsap.from(".reveal", {
  y: 40,
  opacity: 0,
  duration: 1.2,
  stagger: 0.2,
  ease: "power3.out"
});

// Carosello con loop e swipe touch
const scrollDistance = window.innerWidth < 768 ? "+=800%" : "+=500%";

// Timeline principale
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".console-section",
    start: "top top",
    end: scrollDistance, 
    scrub: 1.5,     
    pin: true,     
    anticipatePin: 1
  }
});

// Animazione iniziale del DJ gear
tl.to("#dj-gear", { 
    scale: 15,          
    rotation: 180, 
    filter: "blur(10px)",     
    opacity: 0, 
    duration: 5,        
    ease: "power2.in"   
});

// Funzione per animare i pacchetti
function setupPack(id, xOffset) {
    tl.to(id, { 
        opacity: 1, 
        pointerEvents: "all", 
        duration: 3     
    })
    .from(`${id} .pack-img`, { 
        x: xOffset, 
        opacity: 0, 
        duration: 2    
    }, "<")           
    
    .to({}, { duration: 3 }) 
    
    .to(id, { 
        opacity: 0, 
        y: -50, 
        duration: 2    
    });
}

setupPack("#p1", 100);  
setupPack("#p2", -100); 
setupPack("#p3", 100);  

tl.to(".sticky-container", { 
    opacity: 0, 
    duration: 1 
});


// Barra di progresso e indicatori di sezione
window.addEventListener("scroll", () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  const progressBar = document.getElementById("progressBar");
  
  if (window.innerWidth <= 768) {
    progressBar.style.width = scrolled + "%";
    progressBar.style.height = "100%";
  } else {
    progressBar.style.height = scrolled + "%";
    progressBar.style.width = "100%";
  }

  if (window.innerWidth > 768) {
    const dots = document.querySelectorAll('.dot');
    const updateActive = (idx) => {
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };

    if (scrolled < 15) {
      updateActive(0);
    } else if (scrolled >= 15 && scrolled < 30) {
    } else if (scrolled >= 30 && scrolled < 48) {
    } else if (scrolled >= 48 && scrolled < 66) {
    } else if (scrolled >= 66 && scrolled < 85) {
      updateActive(4); 
    } else {
      updateActive(5); 
    }
  }
});