"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CoffeeBrewPost } from "@/lib/contentful";
import { useTranslations } from "@/lib/useTranslations";

interface BrewsTableProps {
	brews: CoffeeBrewPost[];
}

export default function BrewsTable({ brews }: BrewsTableProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const { translations } = useTranslations();

	return (
		<div className="pb-10">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<b>{translations("labels.name")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.region")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.roastLevel")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.process")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.brewMethod")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.brewDate")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.coffeeDose")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.coffeeYield")}</b>
						</TableHead>
						<TableHead>
							<b>{translations("labels.tastingHighlights")}</b>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{brews.map((brew) => {
						const handleRowClick = () => {
							const base = `/coffee-brews/${encodeURIComponent(brew.fields.name)}`;
							const to = currentLang ? `${base}?lang=${encodeURIComponent(currentLang)}` : base;
							router.push(to);
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
