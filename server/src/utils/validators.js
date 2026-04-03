// server/src/utils/validators.js
const validator = require("validator");

/**
 * Валидация email
 */
const validateEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Валидация пароля (минимум 6 символов)
 */
const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Валидация номера телефона (казахский формат или начинающийся с +)
 */
const validatePhone = (phone) => {
  // Казахский номер: +7XXXXXXXXXX или 7XXXXXXXXXX или 87XXXXXXXXXX
  return /^\+?7\d{10}$|^87\d{9}$/.test(phone.replace(/[\s-]/g, ""));
};

/**
 * Валидация цены
 */
const validatePrice = (price) => {
  return !isNaN(price) && price > 0;
};

/**
 * Валидация рейтинга (0-5)
 */
const validateRating = (rating) => {
  return !isNaN(rating) && rating >= 0 && rating <= 5;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validatePrice,
  validateRating,
};
