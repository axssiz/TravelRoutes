// client/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Страница не найдена</h2>
        <p className="error-message">
          К сожалению, страница, которую вы ищете, не существует.
        </p>
        <Link to="/" className="btn btn-primary btn-large">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};
