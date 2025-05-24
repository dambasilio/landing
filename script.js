document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.hidden-section');

  const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.innerHTML = ''; // Clear existing text
    // Disable the observer for this element to prevent re-triggering if it goes out and back into view quickly
    // while typing. Alternatively, we can add a flag to see if typing has already occurred.
    // For now, let's assume sections stay visible once revealed.
    element.style.visibility = 'visible'; // Make it visible before typing starts

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  };

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // 10% of the target is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('hidden-section');
        entry.target.classList.add('visible-section');

        const heading = entry.target.querySelector('h2');
        if (heading && !heading.dataset.typed) { // Check if already typed
          const text = heading.textContent;
          heading.dataset.typed = "true"; // Mark as typed
          typeWriter(heading, text);
        }
        observer.unobserve(entry.target); // Stop observing once it's visible and processed
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach(section => {
    // Hide h2s initially to prevent flash of untyped text if JS loads slowly.
    // The typeWriter function will make them visible.
    const heading = section.querySelector('h2');
    if (heading) {
        heading.style.visibility = 'hidden';
    }
    observer.observe(section);
  });
});
