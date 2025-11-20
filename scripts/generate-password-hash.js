/**
 * Helper script to generate bcrypt password hashes
 * Usage: node scripts/generate-password-hash.js "your-password"
 */

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
	console.error("Usage: node scripts/generate-password-hash.js <password>");
	process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nPassword hash generated:");
console.log(hash);
console.log("\nCopy this hash to your user configuration in lib/auth.ts\n");
