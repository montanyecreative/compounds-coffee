import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Compounds Coffee",
	description: "Digital resume and services portfolio for Montanye Creative",
	icons: {
		icon: "/icon.webp",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	// Also supported by less commonly used
	// interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				{/* <Analytics />
				<SpeedInsights /> */}
			</body>
		</html>
	);
}
