"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const numericString = z
	.string()
	.min(1, "This field is required")
	.refine((val) => !Number.isNaN(Number(val)), { message: "Please enter a valid number" });

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().optional(),
	region: z.string().min(1, "Region is required"),
	roastLevel: z.string().min(1, "Roast level is required"),
	process: z.string().min(1, "Process is required"),
	brewMethod: z.string().min(1, "Brew method is required"),
	brewDate: z.string().min(1, "Brew date is required"),
	grinder: z.string().min(1, "Grinder is required"),
	grindSetting: numericString,
	waterTemp: numericString,
	coffeeDose: numericString,
	bloomYield: numericString,
	coffeeYield: numericString,
	bloomTime: z.string().min(1, "Bloom time is required"),
	brewTime: z.string().min(1, "Brew time is required"),
	tastingHighlights: z.string().min(1, "Tasting highlights are required"),
	tastingNotes: z.string().min(1, "Tasting notes are required"),
	notes: z.string().min(1, "Notes are required"),
	link: z.string().url("Please enter a valid URL"),
	price: numericString,
	roasterId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BrewOptions {
	roastLevels: string[];
	processes: string[];
	brewMethods: string[];
	roasters: { id: string; name: string }[];
}

interface CreateBrewFormProps {
	isAdmin?: boolean;
}

export function CreateBrewForm({ isAdmin = true }: CreateBrewFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
	const [options, setOptions] = useState<BrewOptions>({
		roastLevels: [],
		processes: [],
		brewMethods: [],
		roasters: [],
	});
	const [loadingOptions, setLoadingOptions] = useState(true);

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const response = await fetch("/api/admin/brew-options");
				if (response.ok) {
					const data = await response.json();
					setOptions(data);
				}
			} catch (error) {
				console.error("Error fetching brew options:", error);
			} finally {
				setLoadingOptions(false);
			}
		};

		fetchOptions();
	}, []);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
			region: "",
			roastLevel: "",
			process: "",
			brewMethod: "",
			brewDate: "",
			grinder: "",
			grindSetting: "",
			waterTemp: "",
			coffeeDose: "",
			bloomYield: "",
			coffeeYield: "",
			bloomTime: "",
			brewTime: "",
			tastingHighlights: "",
			tastingNotes: "",
			notes: "",
			link: "",
			price: "",
			roasterId: "",
		},
	});

	const onSubmit = async (values: FormValues) => {
		if (!isAdmin) return;
		setSubmitting(true);
		setStatus(null);

		const payload = {
			name: values.name,
			slug: values.slug?.trim() || undefined,
			region: values.region,
			roastLevel: values.roastLevel,
			process: values.process,
			brewMethod: values.brewMethod,
			brewDate: values.brewDate,
			grinder: values.grinder,
			grindSetting: Number(values.grindSetting),
			waterTemp: Number(values.waterTemp),
			coffeeDose: Number(values.coffeeDose),
			bloomYield: Number(values.bloomYield),
			coffeeYield: Number(values.coffeeYield),
			bloomTime: values.bloomTime,
			brewTime: values.brewTime,
			tastingHighlights: values.tastingHighlights,
			tastingNotes: values.tastingNotes,
			notes: values.notes,
			link: values.link,
			price: Number(values.price),
			roasterId: values.roasterId?.trim() || undefined,
		};

		try {
			const response = await fetch("/api/admin/brews", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to create brew");
			}

			setStatus({ type: "success", message: "Brew created successfully and sent to Contentful." });
			form.reset();
		} catch (error: any) {
			setStatus({ type: "error", message: error.message || "Something went wrong." });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			{!isAdmin && (
				<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
					<p className="text-sm text-yellow-800">
						⚠️ You don&apos;t have permission to add brews. Only administrators can perform this action.
					</p>
				</div>
			)}
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Coffee Name</FormLabel>
								<FormControl>
									<Input placeholder="Ethiopia Guji..." {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<Input placeholder="ethiopia-guji" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="region"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Region</FormLabel>
								<FormControl>
									<Input placeholder="Guji, Ethiopia" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="roastLevel"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Roast Level</FormLabel>
								<FormControl>
									<select
										{...field}
										disabled={loadingOptions || !isAdmin}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="">Select roast level...</option>
										{options.roastLevels.map((level) => (
											<option key={level} value={level}>
												{level}
											</option>
										))}
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="process"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Process</FormLabel>
								<FormControl>
									<select
										{...field}
										disabled={loadingOptions || !isAdmin}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="">Select process...</option>
										{options.processes.map((process) => (
											<option key={process} value={process}>
												{process}
											</option>
										))}
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="brewMethod"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Brew Method</FormLabel>
								<FormControl>
									<select
										{...field}
										disabled={loadingOptions || !isAdmin}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="">Select brew method...</option>
										{options.brewMethods.map((method) => (
											<option key={method} value={method}>
												{method}
											</option>
										))}
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="brewDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Brew Date</FormLabel>
								<FormControl>
									<Input type="date" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="grinder"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Grinder</FormLabel>
								<FormControl>
									<Input placeholder="DF64" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="grindSetting"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Grind Setting</FormLabel>
								<FormControl>
									<Input type="number" step="any" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="waterTemp"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Water Temp (°F)</FormLabel>
								<FormControl>
									<Input type="number" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="coffeeDose"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Coffee Dose (g)</FormLabel>
								<FormControl>
									<Input type="number" step="any" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bloomYield"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bloom Yield (g)</FormLabel>
								<FormControl>
									<Input type="number" step="any" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="coffeeYield"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Total Yield (g)</FormLabel>
								<FormControl>
									<Input type="number" step="any" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bloomTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bloom Time</FormLabel>
								<FormControl>
									<Input placeholder="0:45" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="brewTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Total Brew Time</FormLabel>
								<FormControl>
									<Input placeholder="3:15" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="link"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Link</FormLabel>
								<FormControl>
									<Input placeholder="https://example.com" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<Input type="number" step="any" {...field} disabled={!isAdmin} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="tastingHighlights"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tasting Highlights</FormLabel>
							<FormControl>
								<Textarea rows={2} placeholder="Strawberry, honey, florals..." {...field} disabled={!isAdmin} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tastingNotes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tasting Notes</FormLabel>
							<FormControl>
								<Textarea rows={3} placeholder="Detailed notes..." {...field} disabled={!isAdmin} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Additional Notes</FormLabel>
							<FormControl>
								<Textarea rows={4} placeholder="Anything else to capture..." {...field} disabled={!isAdmin} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="roasterId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Roaster (optional)</FormLabel>
							<FormControl>
								<select
									{...field}
									disabled={loadingOptions || !isAdmin}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">No roaster selected</option>
									{options.roasters.map((roaster) => (
										<option key={roaster.id} value={roaster.id}>
											{roaster.name}
										</option>
									))}
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{status && (
					<div
						className={`rounded-md border px-4 py-2 text-sm ${
							status.type === "success"
								? "border-green-200 bg-green-50 text-green-800"
								: "border-red-200 bg-red-50 text-red-800"
						}`}
					>
						{status.message}
					</div>
				)}

				<Button
					className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]"
					type="submit"
					disabled={submitting || !isAdmin}
				>
					{submitting ? "Saving..." : "Add Brew"}
				</Button>
			</form>
		</Form>
	);
}
