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