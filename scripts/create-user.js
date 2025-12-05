const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
	const email = process.argv[2];
	const password = process.argv[3];
	const role = process.argv[4] || "user";
	const name = process.argv[5] || null;

	if (!email || !password) {
		console.error("Usage: node scripts/create-user.js <email> <password> [role] [name]");
		console.error("Example: node scripts/create-user.js user@example.com password123 user");
		console.error("Valid roles: admin, user, viewer");
		process.exit(1);
	}

	const validRoles = ["admin", "user", "viewer"];
	if (!validRoles.includes(role)) {
		console.error(`Invalid role: ${role}`);
		console.error(`Valid roles: ${validRoles.join(", ")}`);
		process.exit(1);
	}

	try {
		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			console.error(`❌ User with email ${email} already exists`);
			console.error(`   Current role: ${existingUser.role}`);
			console.error(`   User ID: ${existingUser.id}`);
			process.exit(1);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				role,
				...(name && { name }),
			},
		});

		console.log(`✅ User created successfully!`);
		console.log(`   Email: ${user.email}`);
		console.log(`   Role: ${user.role}`);
		console.log(`   User ID: ${user.id}`);
		if (user.name) {
			console.log(`   Name: ${user.name}`);
		}
	} catch (error) {
		console.error("Error creating user:", error);
		process.exit(1);
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
