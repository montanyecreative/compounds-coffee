import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;
	const adminName = process.env.ADMIN_NAME || "Admin User";

	if (!adminEmail || !adminPassword) {
		throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables");
	}

	const hashedPassword = await bcrypt.hash(adminPassword, 10);

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {
			// Update role to admin if it's not already set
			role: "admin",
		},
		create: {
			email: adminEmail,
			password: hashedPassword,
			name: adminName,
			role: "admin",
		},
	});

	console.log(`Admin user created/updated: ${adminEmail}`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
