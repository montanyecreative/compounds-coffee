"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardTabs() {
	return (
		<Tabs defaultValue="overview" className="w-full">
			<TabsList className="mb-6">
				<TabsTrigger value="overview">Overview</TabsTrigger>
				{/* <TabsTrigger value="brews">Brews</TabsTrigger> */}
				<TabsTrigger value="roasters">Roasters</TabsTrigger>
				{/* <TabsTrigger value="users">Users</TabsTrigger> */}
			</TabsList>

			<TabsContent value="overview">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Card className="bg-white">
						<CardHeader>
							<CardTitle className="text-gray-900">Total Brews</CardTitle>
							<CardDescription className="text-gray-600">All coffee brews in the system</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-gray-900">-</div>
							<p className="text-xs text-gray-500 mt-1">Coming soon</p>
						</CardContent>
					</Card>

					<Card className="bg-white">
						<CardHeader>
							<CardTitle className="text-gray-900">Roasters</CardTitle>
							<CardDescription className="text-gray-600">Total roasters and shops</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-gray-900">-</div>
							<p className="text-xs text-gray-500 mt-1">Coming soon</p>
						</CardContent>
					</Card>

					<Card className="bg-white">
						<CardHeader>
							<CardTitle className="text-gray-900">Users</CardTitle>
							<CardDescription className="text-gray-600">Registered users</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-gray-900">-</div>
							<p className="text-xs text-gray-500 mt-1">Coming soon</p>
						</CardContent>
					</Card>
				</div>

				<Card className="mt-6 bg-white">
					<CardHeader>
						<CardTitle className="text-gray-900">Recent Activity</CardTitle>
						<CardDescription className="text-gray-600">Latest updates and changes</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-gray-500 text-center py-8">No recent activity to display</p>
					</CardContent>
				</Card>
			</TabsContent>

			{/* <TabsContent value="brews">
				<Card className="bg-white">
					<CardHeader>
						<CardTitle className="text-gray-900">Brew Management</CardTitle>
						<CardDescription className="text-gray-600">Manage coffee brews and brewing methods</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-600">This section will allow you to:</p>
							<ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
								<li>View and manage all coffee brews</li>
								<li>Edit brew details and information</li>
								<li>Approve or reject user-submitted brews</li>
								<li>Manage brewing methods and categories</li>
							</ul>
							<div className="mt-6 p-4 bg-gray-50 rounded-md">
								<p className="text-sm text-gray-500">Feature coming soon...</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent> */}

			<TabsContent value="roasters">
				<Card className="bg-white">
					<CardHeader>
						<CardTitle className="text-gray-900">Roaster & Shop Management</CardTitle>
						<CardDescription className="text-gray-600">Manage roasters and coffee shops</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-600">This section will allow you to:</p>
							<ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
								<li>Add, edit, and remove roasters</li>
								<li>Manage coffee shop locations</li>
								<li>Update location information and hours</li>
								<li>Moderate user-submitted roaster information</li>
							</ul>
							<div className="mt-6 p-4 bg-gray-50 rounded-md">
								<p className="text-sm text-gray-500">Feature coming soon...</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* <TabsContent value="users">
				<Card className="bg-white">
					<CardHeader>
						<CardTitle className="text-gray-900">User Management</CardTitle>
						<CardDescription className="text-gray-600">Manage user accounts and permissions</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-600">This section will allow you to:</p>
							<ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
								<li>View all registered users</li>
								<li>Manage user roles and permissions</li>
								<li>Moderate user accounts</li>
								<li>View user activity and contributions</li>
							</ul>
							<div className="mt-6 p-4 bg-gray-50 rounded-md">
								<p className="text-sm text-gray-500">Feature coming soon...</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent> */}
		</Tabs>
	);
}
