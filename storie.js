let currentStory = 0;
const stories = document.querySelectorAll('.story-slide');
const fills = document.querySelectorAll('.progress-fill');
const duration = 5000; 
let storyInterval;
let startTime;
let progressId;

function showStory(index) {
  stories.forEach(s => s.classList.remove('active'));
  fills.forEach((f, i) => {
    f.style.width = i < index ? '100%' : '0%';
    gsap.killTweensOf(f); 
  });

  stories[index].classList.add('active');
  
  gsap.fromTo(fills[index], 
    { width: "0%" }, 
    { width: "100%", duration: duration / 1000, ease: "none", onComplete: nextStory }
  );
}

function nextStory() {
  if (currentStory < stories.length - 1) {
    currentStory++;
    showStory(currentStory);
  } else {
    currentStory = 0;
    showStory(currentStory);
  }
}

function prevStory() {
  if (currentStory > 0) {
    currentStory--;
    showStory(currentStory);
  }
}

ScrollTrigger.create({
  trigger: ".stories-container",
  start: "top 80%",
  onEnter: () => showStory(currentStory)
});