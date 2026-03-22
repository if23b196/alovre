// Shared logic across all pages
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Optional: Load saved theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.classList.add('dark');
    }
    updateThemeIcon();

    themeToggleBtn.addEventListener('click', () => {
        htmlEl.classList.toggle('dark');
        localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
        updateThemeIcon();
    });

    function updateThemeIcon() {
        themeToggleBtn.innerHTML = '';
        const newIcon = document.createElement('i');
        newIcon.setAttribute('data-lucide', htmlEl.classList.contains('dark') ? 'sun' : 'moon');
        themeToggleBtn.appendChild(newIcon);
        lucide.createIcons();
    }
});
