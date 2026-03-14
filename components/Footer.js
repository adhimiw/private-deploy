function Footer() {
  try {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="bg-dark-secondary text-white border-t border-[var(--border-color)]" data-name="footer" data-file="components/Footer.js">
        <div className="container-max section-padding relative z-10"></div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}
