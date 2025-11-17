/** @type {import('next').NextConfig} */
const nextConfig = {
	// Use SWC minification (default in Next.js 13+)
	swcMinify: true,
	// Output modern JavaScript for better performance
	compiler: {
		// Remove console logs in production
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
				  }
				: false,
	},
	// Ensure modern JavaScript output
	experimental: {
		// Use modern output format
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
	},
};

module.exports = nextConfig;
