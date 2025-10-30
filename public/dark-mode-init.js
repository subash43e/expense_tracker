// This script helps prevent flash of unstyled content (FOUC) in dark mode
// Add this to your HTML head if you experience flashing

(function() {
  try {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true' || (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
