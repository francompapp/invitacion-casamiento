import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-names">Laura & Franco</h3>
            <p className="footer-date">10 • 10 • 2026</p>
          </div>

          <div className="footer-section">
            <p className="footer-message">
              Gracias por ser parte de nuestro día especial
            </p>
          </div>

          <div className="footer-section">
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© {currentYear} · Hecho con 💝 por Laura & Franco</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
