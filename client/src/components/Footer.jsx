// client/src/components/Footer.jsx
import React from "react";
import { FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "../styles/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>О TravelRoutes</h4>
          <p>
            Легко планируйте путешествия и бронируйте отели по всему Казахстану.
          </p>
        </div>

        <div className="footer-section">
          <h4>Быстрые ссылки</h4>
          <ul>
            <li>
              <a href="/">Главная</a>
            </li>
            <li>
              <a href="/hotels">Отели</a>
            </li>
            <li>
              <a href="/routes">Маршруты</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <p>
            <FaEnvelope style={{ marginRight: "0.5rem" }} />{" "}
            support@travelroutes.kz
          </p>
          <p>
            <FaPhone style={{ marginRight: "0.5rem" }} /> +7 (700) 123-45-67
          </p>
          <div className="whatsapp-section">
            <a
              href="https://wa.me/77082354533"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <FaWhatsapp style={{ marginRight: "0.5rem" }} />
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 TravelRoutes. Все права защищены.</p>
      </div>
    </footer>
  );
};
