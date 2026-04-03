// server/src/utils/sms.js

/**
 * Mock SMS сервис для OTP через smsc.kz
 * В реальном приложении использовать реальный API smsc.kz
 */
class SMSService {
  constructor() {
    this.otpCache = new Map(); // Временное хранилище OTP
  }

  /**
   * Генерирует случайный OTP (4 цифры)
   */
  generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Отправляет OTP на номер телефона (MOCK)
   */
  async sendOTP(phone) {
    const otp = this.generateOTP();

    // Кеш OTP на 10 минут
    this.otpCache.set(phone, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    console.log(`📱 OTP для ${phone}: ${otp}`);

    // В реальном приложении:
    // const response = await axios.post('https://smsc.kz/sys/send.php', {
    //   login: process.env.SMS_API_LOGIN,
    //   password: process.env.SMS_API_PASSWORD,
    //   phones: phone,
    //   message: `Ваш код подтверждения: ${otp}`,
    // });

    return { success: true, message: "OTP отправлен (проверьте консоль)" };
  }

  /**
   * Проверяет OTP
   */
  verifyOTP(phone, code) {
    const cachedOTP = this.otpCache.get(phone);

    if (!cachedOTP) {
      return { valid: false, message: "OTP не найден" };
    }

    if (Date.now() > cachedOTP.expiresAt) {
      this.otpCache.delete(phone);
      return { valid: false, message: "OTP истек" };
    }

    if (cachedOTP.code !== code) {
      return { valid: false, message: "Неверный OTP" };
    }

    this.otpCache.delete(phone);
    return { valid: true, message: "OTP верен" };
  }
}

module.exports = new SMSService();
