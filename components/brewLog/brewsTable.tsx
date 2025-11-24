"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CoffeeBrewPost } from "@/lib/contentful";
import { useTranslations } from "@/lib/useTranslations";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatBrewDate } from "@/lib/utils";

interface BrewsTableProps {
	brews: CoffeeBrewPost[];
	sortColumn: string | null;
	sortDirection: "asc" | "desc";
	onSort: (column: string) => void;
}

export default function BrewsTable({ brews, sortColumn, sortDirection, onSort }: BrewsTableProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const { translations } = useTranslations();

	const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => {
		const isSorted = sortColumn === column;
		return (
			<TableHead className="cursor-pointer hover:bg-gray-100 hover:text-brown select-none" onClick={() => onSort(column)}>
				<div className="flex items-center gap-2">
					<b>{children}</b>
					{isSorted && (
						<span className="inline-flex">
							{sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
						</span>
					)}
				</div>
			</TableHead>
		);
	};

	return (
		<div className="pb-10">
			<Table>
				<TableHeader>
					<TableRow>
						<SortableHeader column="name">{translations("labels.name")}</SortableHeader>
						<SortableHeader column="region">{translations("labels.region")}</SortableHeader>
						<SortableHeader column="roastLevel">{translations("labels.roastLevel")}</SortableHeader>
						<SortableHeader column="process">{translations("labels.process")}</SortableHeader>
						<SortableHeader column="brewMethod">{translations("labels.brewMethod")}</SortableHeader>
						<SortableHeader column="brewDate">{translations("labels.brewDate")}</SortableHeader>
						<SortableHeader column="coffeeDose">{translations("labels.coffeeDose")}</SortableHeader>
						<SortableHeader column="coffeeYield">{translations("labels.coffeeYield")}</SortableHeader>
						<SortableHeader column="tastingHighlights">{translations("labels.tastingHighlights")}</SortableHeader>
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
								<TableCell>{formatBrewDate(brew.fields.brewDate as string)}</TableCell>
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
