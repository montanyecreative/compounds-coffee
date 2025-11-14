"use client";

import { useState, useMemo } from "react";
import { CoffeeBrewPost } from "@/lib/contentful";
import { useTranslations } from "@/lib/useTranslations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import BrewsTable from "@/components/brewsTable";

interface BrewsFiltersProps {
	brews: CoffeeBrewPost[];
}

export default function BrewsFilters({ brews }: BrewsFiltersProps) {
	const { translations } = useTranslations();
	const [showFilters, setShowFilters] = useState(false);
	const [nameFilter, setNameFilter] = useState("");
	const [regionFilter, setRegionFilter] = useState("");
	const [roastLevelFilter, setRoastLevelFilter] = useState("");
	const [processFilter, setProcessFilter] = useState("");
	const [brewMethodFilter, setBrewMethodFilter] = useState("");
	const [brewDateFilter, setBrewDateFilter] = useState("");
	const [coffeeDoseMin, setCoffeeDoseMin] = useState("");
	const [coffeeDoseMax, setCoffeeDoseMax] = useState("");
	const [coffeeYieldMin, setCoffeeYieldMin] = useState("");
	const [coffeeYieldMax, setCoffeeYieldMax] = useState("");
	const [tastingHighlightsFilter, setTastingHighlightsFilter] = useState("");

	// Get unique values for dropdown filters
	const uniqueRegions = useMemo(() => {
		const regions = brews.map((brew) => brew.fields.region).filter(Boolean);
		return Array.from(new Set(regions)).sort();
	}, [brews]);

	const uniqueRoastLevels = useMemo(() => {
		const levels = brews.map((brew) => brew.fields.roastLevel).filter(Boolean);
		return Array.from(new Set(levels)).sort();
	}, [brews]);

	const uniqueProcesses = useMemo(() => {
		const processes = brews.map((brew) => brew.fields.process).filter(Boolean);
		return Array.from(new Set(processes)).sort();
	}, [brews]);

	const uniqueBrewMethods = useMemo(() => {
		const methods = brews.map((brew) => brew.fields.brewMethod).filter(Boolean);
		return Array.from(new Set(methods)).sort();
	}, [brews]);

	// Filter brews based on all filter criteria
	const filteredBrews = useMemo(() => {
		return brews.filter((brew) => {
			// Name filter (case-insensitive partial match)
			if (nameFilter) {
				const name = brew.fields.name as string | undefined;
				if (typeof name !== "string" || !name.toLowerCase().includes(nameFilter.toLowerCase())) {
					return false;
				}
			}

			// Region filter
			if (regionFilter && brew.fields.region !== regionFilter) {
				return false;
			}

			// Roast level filter
			if (roastLevelFilter && brew.fields.roastLevel !== roastLevelFilter) {
				return false;
			}

			// Process filter
			if (processFilter && brew.fields.process !== processFilter) {
				return false;
			}

			// Brew method filter
			if (brewMethodFilter && brew.fields.brewMethod !== brewMethodFilter) {
				return false;
			}

			// Brew date filter (exact match or partial match)
			if (brewDateFilter) {
				const brewDate = brew.fields.brewDate as string | undefined;
				if (typeof brewDate !== "string" || !brewDate.includes(brewDateFilter)) {
					return false;
				}
			}

			// Coffee dose range filter
			if (coffeeDoseMin && (!brew.fields.coffeeDose || brew.fields.coffeeDose < Number(coffeeDoseMin))) {
				return false;
			}
			if (coffeeDoseMax && (!brew.fields.coffeeDose || brew.fields.coffeeDose > Number(coffeeDoseMax))) {
				return false;
			}

			// Coffee yield range filter
			if (coffeeYieldMin && (!brew.fields.coffeeYield || brew.fields.coffeeYield < Number(coffeeYieldMin))) {
				return false;
			}
			if (coffeeYieldMax && (!brew.fields.coffeeYield || brew.fields.coffeeYield > Number(coffeeYieldMax))) {
				return false;
			}

			// Tasting highlights filter (case-insensitive partial match)
			if (tastingHighlightsFilter) {
				const tastingHighlights = brew.fields.tastingHighlights as string | undefined;
				if (
					typeof tastingHighlights !== "string" ||
					!tastingHighlights.toLowerCase().includes(tastingHighlightsFilter.toLowerCase())
				) {
					return false;
				}
			}

			return true;
		});
	}, [
		brews,
		nameFilter,
		regionFilter,
		roastLevelFilter,
		processFilter,
		brewMethodFilter,
		brewDateFilter,
		coffeeDoseMin,
		coffeeDoseMax,
		coffeeYieldMin,
		coffeeYieldMax,
		tastingHighlightsFilter,
	]);

	const clearFilters = () => {
		setNameFilter("");
		setRegionFilter("");
		setRoastLevelFilter("");
		setProcessFilter("");
		setBrewMethodFilter("");
		setBrewDateFilter("");
		setCoffeeDoseMin("");
		setCoffeeDoseMax("");
		setCoffeeYieldMin("");
		setCoffeeYieldMax("");
		setTastingHighlightsFilter("");
	};

	const hasActiveFilters =
		nameFilter ||
		regionFilter ||
		roastLevelFilter ||
		processFilter ||
		brewMethodFilter ||
		brewDateFilter ||
		coffeeDoseMin ||
		coffeeDoseMax ||
		coffeeYieldMin ||
		coffeeYieldMax ||
		tastingHighlightsFilter;

	return (
		<div className="pb-10">
			{/* Toggle Button */}
			<div className="mb-4">
				<Button
					onClick={() => setShowFilters(!showFilters)}
					variant="outline"
					className="w-full md:w-auto flex items-center justify-between gap-2"
				>
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4" />
						<span>{translations("coffeeBrews.filters.title")}</span>
						{hasActiveFilters && (
							<span className="ml-2 px-2 py-0.5 text-xs bg-brown text-white rounded-full">
								{
									Object.values({
										nameFilter,
										regionFilter,
										roastLevelFilter,
										processFilter,
										brewMethodFilter,
										brewDateFilter,
										coffeeDoseMin,
										coffeeDoseMax,
										coffeeYieldMin,
										coffeeYieldMax,
										tastingHighlightsFilter,
									}).filter(Boolean).length
								}
							</span>
						)}
					</div>
					{showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
				</Button>
			</div>

			{/* Filters Section */}
			{showFilters && (
				<div className="mb-6 space-y-4 border rounded-lg p-4 bg-gray-50">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">{translations("coffeeBrews.filters.title")}</h3>
						{hasActiveFilters && (
							<Button onClick={clearFilters} variant="outline" size="sm">
								{translations("coffeeBrews.filters.clear")}
							</Button>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Name Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.name")}</label>
							<Input
								type="text"
								placeholder={translations("coffeeBrews.filters.namePlaceholder")}
								value={nameFilter}
								onChange={(e) => setNameFilter(e.target.value)}
							/>
						</div>

						{/* Region Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.region")}</label>
							<select
								value={regionFilter}
								onChange={(e) => setRegionFilter(e.target.value)}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<option value="">{translations("coffeeBrews.filters.all")}</option>
								{uniqueRegions.map((region) => (
									<option key={region} value={region}>
										{region}
									</option>
								))}
							</select>
						</div>

						{/* Roast Level Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.roastLevel")}</label>
							<select
								value={roastLevelFilter}
								onChange={(e) => setRoastLevelFilter(e.target.value)}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<option value="">{translations("coffeeBrews.filters.all")}</option>
								{uniqueRoastLevels.map((level) => (
									<option key={level} value={level}>
										{level}
									</option>
								))}
							</select>
						</div>

						{/* Process Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.process")}</label>
							<select
								value={processFilter}
								onChange={(e) => setProcessFilter(e.target.value)}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<option value="">{translations("coffeeBrews.filters.all")}</option>
								{uniqueProcesses.map((process) => (
									<option key={process} value={process}>
										{process}
									</option>
								))}
							</select>
						</div>

						{/* Brew Method Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.brewMethod")}</label>
							<select
								value={brewMethodFilter}
								onChange={(e) => setBrewMethodFilter(e.target.value)}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<option value="">{translations("coffeeBrews.filters.all")}</option>
								{uniqueBrewMethods.map((method) => (
									<option key={method} value={method}>
										{method}
									</option>
								))}
							</select>
						</div>

						{/* Brew Date Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.brewDate")}</label>
							<Input
								type="text"
								placeholder={translations("coffeeBrews.filters.datePlaceholder")}
								value={brewDateFilter}
								onChange={(e) => setBrewDateFilter(e.target.value)}
							/>
						</div>

						{/* Coffee Dose Range */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.coffeeDose")} (g)</label>
							<div className="flex gap-2">
								<Input
									type="number"
									placeholder={translations("coffeeBrews.filters.min")}
									value={coffeeDoseMin}
									onChange={(e) => setCoffeeDoseMin(e.target.value)}
									className="flex-1"
								/>
								<Input
									type="number"
									placeholder={translations("coffeeBrews.filters.max")}
									value={coffeeDoseMax}
									onChange={(e) => setCoffeeDoseMax(e.target.value)}
									className="flex-1"
								/>
							</div>
						</div>

						{/* Coffee Yield Range */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.coffeeYield")} (g)</label>
							<div className="flex gap-2">
								<Input
									type="number"
									placeholder={translations("coffeeBrews.filters.min")}
									value={coffeeYieldMin}
									onChange={(e) => setCoffeeYieldMin(e.target.value)}
									className="flex-1"
								/>
								<Input
									type="number"
									placeholder={translations("coffeeBrews.filters.max")}
									value={coffeeYieldMax}
									onChange={(e) => setCoffeeYieldMax(e.target.value)}
									className="flex-1"
								/>
							</div>
						</div>

						{/* Tasting Highlights Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">{translations("labels.tastingHighlights")}</label>
							<Input
								type="text"
								placeholder={translations("coffeeBrews.filters.tastingPlaceholder")}
								value={tastingHighlightsFilter}
								onChange={(e) => setTastingHighlightsFilter(e.target.value)}
							/>
						</div>
					</div>
				</div>
			)}

			<BrewsTable brews={filteredBrews} />
		</div>
	);
}
