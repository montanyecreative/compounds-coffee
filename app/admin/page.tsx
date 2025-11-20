import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default async function AdminPage() {
	const session = await auth();

	if (!session) {
		redirect("/login?callbackUrl=/admin");
	}

	return (
		<main>
			<Navbar />
			<div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold mb-4 text-gray-900">Admin Dashboard</h1>
					<p className="text-gray-600 mb-8">Welcome, {session.user?.email}!</p>

					<div className="bg-white rounded-lg shadow-lg p-8">
						<h2 className="text-2xl font-semibold mb-4 text-gray-800">Protected Content</h2>
						<p className="text-gray-600">
							This is a protected route that requires authentication. Only logged-in users can access this page.
						</p>

						<div className="mt-8 p-4 bg-gray-50 rounded-md">
							<h3 className="font-semibold mb-2 text-gray-800">Session Information</h3>
							<pre className="text-sm text-gray-600 overflow-auto">{JSON.stringify(session, null, 2)}</pre>
						</div>

						<div className="mt-8">
							<h3 className="text-xl font-semibold mb-4 text-gray-800">Next Steps</h3>
							<ul className="list-disc list-inside space-y-2 text-gray-600">
								<li>
									Add your protected routes under the <code className="bg-gray-100 px-1 rounded">/admin</code> directory
								</li>
								<li>Connect to a database for user management</li>
								<li>Implement role-based access control if needed</li>
								<li>Add OAuth providers (Google, GitHub, etc.) if desired</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
