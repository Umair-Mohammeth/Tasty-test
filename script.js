document.addEventListener('DOMContentLoaded', () => {
  const currentYearElement = document.getElementById('year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear().toString();
  }

  const ctaButton = document.getElementById('cta');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      alert('Hello there! 👋');
    });
  }

  const themeToggleButton = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');

  // Initialize theme
  if (storedTheme === 'light' || storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', storedTheme);
    if (themeToggleButton) themeToggleButton.setAttribute('aria-pressed', (storedTheme === 'dark').toString());
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleButton) themeToggleButton.setAttribute('aria-pressed', 'true');
  }

  // Toggle theme
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      themeToggleButton.setAttribute('aria-pressed', (nextTheme === 'dark').toString());
    });
  }
});

