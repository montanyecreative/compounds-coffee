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
		<div className="pb-10">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<b>Name</b>
						</TableHead>
						<TableHead>
							<b>Region</b>
						</TableHead>
						<TableHead>
							<b>Roast Level</b>
						</TableHead>
						<TableHead>
							<b>Process</b>
						</TableHead>
						<TableHead>
							<b>Brew Method</b>
						</TableHead>
						<TableHead>
							<b>Brew Date</b>
						</TableHead>
						<TableHead>
							<b>Coffee Dose</b>
						</TableHead>
						<TableHead>
							<b>Coffee Yield</b>
						</TableHead>
						<TableHead>
							<b>Tasting Highlights</b>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{brews.map((brew) => {
						const handleRowClick = () => {
							router.push(`/coffee-brews/${brew.fields.slug || brew.sys.id}`);
						};

						return (
							<TableRow key={brew.sys.id} onClick={handleRowClick} className="cursor-pointer">
								<TableCell>
									<b>{brew.fields.name}</b>
								</TableCell>
								<TableCell>{brew.fields.region}</TableCell>
								<TableCell>{brew.fields.roastLevel}</TableCell>
								<TableCell>{brew.fields.process}</TableCell>
								<TableCell>{brew.fields.brewMethod}</TableCell>
								<TableCell>{brew.fields.brewDate}</TableCell>
								<TableCell>
									{brew.fields.coffeeDose}
									{brew.fields.coffeeDose ? "g" : ""}
								</TableCell>
								<TableCell>
									{brew.fields.coffeeYield}
									{brew.fields.coffeeYield ? "g" : ""}
								</TableCell>
								<TableCell>{brew.fields.tastingHighlights}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
