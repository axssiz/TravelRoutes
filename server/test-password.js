const bcrypt = require("bcryptjs");

async function testPassword() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  console.log("Password hash:", hash);

  const isValid = await bcrypt.compare(password, hash);
  console.log("Password valid:", isValid);
}

testPassword();
