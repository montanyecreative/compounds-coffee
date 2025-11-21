import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { DashboardTabs } from "@/components/admin/dashboardTabs";

export default async function AdminPage() {
	const session = await auth();

	if (!session) {
		redirect("/login?callbackUrl=/admin");
	}

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-black"></div>
			<div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
				<div className="max-w-6xl mx-auto">
					<div className="mb-8">
						<h1 className="text-4xl font-bold mb-2 text-gray-900">Dashboard</h1>
						<p className="text-gray-600">Welcome back, {session.user?.email}!</p>
					</div>

					<DashboardTabs />
				</div>
			</div>
			<Footer />
		</main>
	);
}
