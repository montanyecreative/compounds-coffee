const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
	const email = process.argv[2];
	const newRole = process.argv[3];

	if (!email || !newRole) {
		console.error("Usage: node scripts/update-user-role.js <email> <role>");
		console.error("Example: node scripts/update-user-role.js user@example.com admin");
		console.error("Valid roles: admin, user");
		process.exit(1);
	}

	const validRoles = ["admin", "user", "viewer"];
	if (!validRoles.includes(newRole)) {
		console.error(`Invalid role: ${newRole}`);
		console.error(`Valid roles: ${validRoles.join(", ")}`);
		process.exit(1);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			console.error(`User with email ${email} not found`);
			process.exit(1);
		}

		const updatedUser = await prisma.user.update({
			where: { email },
			data: { role: newRole },
		});

		console.log(`✅ Successfully updated user ${email} to role: ${newRole}`);
		console.log(`   User ID: ${updatedUser.id}`);
		console.log(`   Current role: ${updatedUser.role}`);
		console.log("\n⚠️  Note: The user will need to log out and log back in for the role change to take effect in their session.");
	} catch (error) {
		console.error("Error updating user role:", error);
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
