#!/usr/bin/env node
/**
 * Production Setup Script
 *
 * This script helps set up the user role system in production.
 * It will:
 * 1. Check migration status
 * 2. Update admin user to admin role
 * 3. Create the new user account
 *
 * Usage:
 *   DATABASE_URL="your-production-url" node scripts/setup-production.js
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { execSync } = require("child_process");

const prisma = new PrismaClient();

async function checkMigrations() {
	console.log("📋 Checking migration status...");
	try {
		// This will show if migrations are pending
		const output = execSync("npx prisma migrate status", { encoding: "utf-8" });
		console.log(output);

		if (output.includes("Database schema is up to date")) {
			console.log("✅ All migrations are applied\n");
			return true;
		} else if (output.includes("following migrations have not yet been applied")) {
			console.log("⚠️  Migrations need to be applied");
			console.log("   Run: npx prisma migrate deploy\n");
			return false;
		}
	} catch (error) {
		console.error("❌ Error checking migrations:", error.message);
		return false;
	}
}

async function updateAdminUser(adminEmail) {
	console.log(`👤 Updating admin user: ${adminEmail}...`);
	try {
		const user = await prisma.user.findUnique({
			where: { email: adminEmail },
		});

		if (!user) {
			console.log(`⚠️  User ${adminEmail} not found. Skipping...\n`);
			return;
		}

		if (user.role === "admin") {
			console.log(`✅ User ${adminEmail} already has admin role\n`);
			return;
		}

		await prisma.user.update({
			where: { email: adminEmail },
			data: { role: "admin" },
		});

		console.log(`✅ Updated ${adminEmail} to admin role\n`);
	} catch (error) {
		console.error(`❌ Error updating admin user:`, error.message);
	}
}

async function createUser(email, password, role = "user", name = null) {
	console.log(`👤 Creating user: ${email}...`);
	try {
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			console.log(`⚠️  User ${email} already exists (role: ${existingUser.role})\n`);
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				role,
				...(name && { name }),
			},
		});

		console.log(`✅ Created user ${email} with role ${role}\n`);
	} catch (error) {
		console.error(`❌ Error creating user:`, error.message);
	}
}

async function main() {
	console.log("🚀 Production Setup Script\n");
	console.log("=".repeat(50) + "\n");

	// Check if DATABASE_URL is set
	if (!process.env.DATABASE_URL) {
		console.error("❌ DATABASE_URL environment variable is not set");
		console.error("   Usage: DATABASE_URL='your-url' node scripts/setup-production.js");
		process.exit(1);
	}

	// Check migrations
	const migrationsOk = await checkMigrations();
	if (!migrationsOk) {
		console.log("⚠️  Please run migrations first:");
		console.log("   npx prisma migrate deploy\n");
		process.exit(1);
	}

	// Update admin user
	const adminEmail = process.env.ADMIN_EMAIL || "montanyecreative@outlook.com";
	await updateAdminUser(adminEmail);

	// Create new user
	const newUserEmail = process.env.NEW_USER_EMAIL || "compoundscoffee@outlook.com";
	const newUserPassword = process.env.NEW_USER_PASSWORD || "ilovecoffee!123";
	await createUser(newUserEmail, newUserPassword, "user");

	// List all users
	console.log("📊 Current users in database:");
	const users = await prisma.user.findMany({
		select: {
			email: true,
			role: true,
			name: true,
		},
		orderBy: { createdAt: "asc" },
	});

	users.forEach((user) => {
		console.log(`   - ${user.email} (${user.role})${user.name ? ` - ${user.name}` : ""}`);
	});

	console.log("\n✅ Production setup complete!");
	console.log("\n⚠️  Important: Users need to log out and log back in for role changes to take effect.");
}

main()
	.catch((e) => {
		console.error("❌ Error:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
