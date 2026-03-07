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
  scrollDistance = "+=200%";
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
    filter: "blur(2px)",     
    opacity: 0, 
    duration: 1.8,        
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


