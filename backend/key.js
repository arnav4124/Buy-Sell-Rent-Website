const crypto = require("crypto");
const JWT_SECRET = crypto.randomBytes(64).toString("hex");
console.log("JWT_SECRET:", JWT_SECRET);
// console.log(JWT_SECRET); // Save this key securely
