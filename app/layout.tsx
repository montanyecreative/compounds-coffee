import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "@/components/ga4";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Compounds Coffee",
	description: "Coffee website for exploring coffee brews, recipes, and roasters.",
	icons: {
		icon: "/icon.webp",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				<GoogleAnalytics />
				{/* <Analytics />
				<SpeedInsights /> */}
			</body>
		</html>
	);
}
