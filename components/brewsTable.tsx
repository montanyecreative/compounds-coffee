"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CoffeeBrewPost } from "@/lib/contentful";

interface BrewsTableProps {
	brews: CoffeeBrewPost[];
}

export default function BrewsTable({ brews }: BrewsTableProps) {
	const router = useRouter();

	return (
		<div className="grid grid-cols-1 gap-1">
			{brews.map((brew) => {
				const handleRowClick = () => {
					router.push(`/coffee-brews/${brew.fields.slug || brew.sys.id}`);
				};

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
							<TableRow onClick={handleRowClick} className="cursor-pointer">
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
	);
}
