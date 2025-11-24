"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoasterUpload } from "@/components/admin/roasterUpload";
import { CreateBrewForm } from "@/components/admin/createBrewForm";

export function DashboardTabs() {
	return (
		<Tabs defaultValue="overview" className="w-full">
			<TabsList className="mb-6">
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="brews">Brews</TabsTrigger>
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

			<TabsContent value="brews">
				<Card className="bg-white">
					<CardHeader>
						<CardTitle className="text-gray-900">Add a Brew</CardTitle>
						<CardDescription className="text-gray-600">Add new coffee brews directly to Contentful</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<CreateBrewForm />
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="roasters">
				<Card className="bg-white">
					<CardHeader>
						<CardTitle className="text-gray-900">Roaster & Shop Management</CardTitle>
						<CardDescription className="text-gray-600">Manage roasters and coffee shops</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Roasters from Excel</h3>
								<p className="text-sm text-gray-600 mb-4">
									Upload an Excel file (.xlsx, .xls) or CSV file with roaster information. The file should include columns
									for:
								</p>
								<ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4 mb-4">
									<li>
										<strong>Shop Name</strong> (required) - Column name should include &quot;name&quot; or
										&quot;shop&quot;
									</li>
									<li>
										<strong>Address</strong> (optional) - Column name should include &quot;address&quot; or
										&quot;location&quot;. Will be automatically geocoded to coordinates.
									</li>
									<li>
										<strong>Latitude</strong> (optional) - Column name should include &quot;lat&quot; or
										&quot;latitude&quot;. Takes precedence over address if both are provided.
									</li>
									<li>
										<strong>Longitude</strong> (optional) - Column name should include &quot;lon&quot;, &quot;lng&quot;,
										or &quot;longitude&quot;. Takes precedence over address if both are provided.
									</li>
									<li>
										<strong>Website</strong> (optional) - Column name should include &quot;website&quot;,
										&quot;url&quot;, or &quot;web&quot;
									</li>
									<li>
										<strong>Phone</strong> (optional) - Column name should include &quot;phone&quot; or &quot;tel&quot;
									</li>
								</ul>
								<p className="text-xs text-gray-500 mb-4 italic">
									Note: If you provide an address, it will be automatically converted to latitude and longitude
									coordinates using Google Maps Geocoding API.
								</p>
								<RoasterUpload />
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
