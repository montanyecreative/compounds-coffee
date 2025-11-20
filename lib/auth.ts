import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// NextAuth v5 supports both AUTH_SECRET and NEXTAUTH_SECRET for backward compatibility
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
	throw new Error("AUTH_SECRET or NEXTAUTH_SECRET must be set in environment variables");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					// Find user in database
					const user = await prisma.user.findUnique({
						where: { email: credentials.email as string },
					});

					if (!user) {
						return null;
					}

					// Verify password
					const password: string = String(credentials.password);
					const hash: string = String(user.password);
					const isValidPassword = await bcrypt.compare(password, hash);

					if (!isValidPassword) {
						return null;
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name || user.email,
					};
				} catch (error) {
					console.error("Auth error:", error);
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
			}
			return session;
		},
	},
	secret: authSecret,
});
