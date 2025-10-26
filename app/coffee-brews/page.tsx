import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCoffeeBrews } from "@/lib/contentful";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function CoffeeBrews() {
	const brews = await getCoffeeBrews();

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h2 className="mb-5 pt-10 md:pt-unset text-black">Coffee Brews</h2>

					{brews.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">
								No coffee brews found. Make sure your Contentful credentials are set up correctly.
							</p>
							<Link href="/add-a-brew">
								<Button>Add Your First Brew</Button>
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-2 pb-10">
							{brews.map((brew) => {
								return (
									<Table key={brew.sys.id}>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Region</TableHead>
												<TableHead>Roast Level</TableHead>
												<TableHead>Process</TableHead>
												<TableHead>Brew Method</TableHead>
												<TableHead>Brew Date</TableHead>
												<TableHead>Grind Setting</TableHead>
												<TableHead>Water Temp</TableHead>
												<TableHead>Coffee Dose</TableHead>
												<TableHead>Bloom Yield</TableHead>
												<TableHead>Coffee Yield</TableHead>
												<TableHead>Bloom Time</TableHead>
												<TableHead>Brew Time</TableHead>
												<TableHead>Tasting Highlights</TableHead>
												<TableHead>Tasting Notes</TableHead>
												<TableHead>Notes</TableHead>
												<TableHead>Link</TableHead>
												<TableHead>Price</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>{brew.fields.name}</TableCell>
												<TableCell>{brew.fields.region}</TableCell>
												<TableCell>{brew.fields.roastLevel}</TableCell>
												<TableCell>{brew.fields.process}</TableCell>
												<TableCell>{brew.fields.brewMethod}</TableCell>
												<TableCell>{brew.fields.brewDate}</TableCell>
												<TableCell>{brew.fields.grindSetting}</TableCell>
												<TableCell>{brew.fields.waterTemp}&deg;F</TableCell>
												<TableCell>{brew.fields.coffeeDose}g</TableCell>
												<TableCell>{brew.fields.bloomYield}g</TableCell>
												<TableCell>{brew.fields.coffeeYield}g</TableCell>
												<TableCell>{brew.fields.bloomTime}</TableCell>
												<TableCell>{brew.fields.brewTime}</TableCell>
												<TableCell>{brew.fields.tastingHighlights}</TableCell>
												<TableCell>{brew.fields.tastingNotes}</TableCell>
												<TableCell>{brew.fields.notes}</TableCell>
												<TableCell>{brew.fields.link}</TableCell>
												<TableCell>${brew.fields.price}</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								);
							})}
						</div>
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
