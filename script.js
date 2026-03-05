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
const width = window.innerWidth;

let scrollDistance;

if (width <= 320) {           // iPhone SE / piccoli smartphone
  scrollDistance = "+=200%";
} else if (width <= 375) {    // iPhone 8 / iPhone SE 2
  scrollDistance = "+=200%";
} else if (width <= 414) {    // iPhone 11, 12, 13, 14, 15 Pro Max / iPhone XR
  scrollDistance = "+=200%";
} else if (width <= 480) {    // smartphone più grandi
  scrollDistance = "+=220%";
} else if (width <= 768) {    // tablet portrait
  scrollDistance = "+=350%";
} else {                      // desktop
  scrollDistance = "+=450%";
}

// Timeline principale
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".console-section",
    start: "top top",
    end: scrollDistance, 
    scrub: 0.5,     
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
    duration: 1.1,        
    ease: "power2.in"   
});

// Funzione per animare i pacchetti
function setupPack(id, xOffset) {
    tl.to(id, { 
        opacity: 1, 
        pointerEvents: "all", 
        duration: 1     
    })
    .from(`${id} .pack-img`, { 
        x: xOffset, 
        opacity: 0, 
        duration: 0.8    
    }, "<")           
    
    .to({}, { duration: 1 }) 
    
    .to(id, { 
        opacity: 0, 
        y: -30, 
        duration: 1.5    
    });
}

setupPack("#p1", 100, 0.3);  
setupPack("#p2", -100, 0.3); 
setupPack("#p3", 100, 0.3);  

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
      updateActive(1);
    } else if (scrolled >= 30 && scrolled < 48) {
      updateActive(2);
    } else if (scrolled >= 48 && scrolled < 66) {
      updateActive(3);
    } else if (scrolled >= 66 && scrolled < 85) {
      updateActive(4); 
    } else {
      updateActive(5); 
    }
  }
});