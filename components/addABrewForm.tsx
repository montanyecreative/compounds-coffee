"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const formSchema = z.object({
	todaysDate: z.string().max(100, {
		message: "Incorrect date.",
	}),
	coffeeName: z.string().min(2, {
		message: "Coffee name must be at least 1 character.",
	}),
	region: z.string().min(2, {
		message: "Region must be at least 1 character.",
	}),
	roastLevel: z.string().min(2, {
		message: "Roast level must be at least 1 character.",
	}),
	process: z.string().max(100, {
		message: "Process must be at least 1 character.",
	}),
	brewMethod: z.string().max(100, {
		message: "Brew method must be at least 1 character.",
	}),
	brewDate: z.string().max(100, {
		message: "Incorrect brew date.",
	}),
	grindSetting: z.number().max(100, {
		message: "Grind setting must be at least 1 number.",
	}),
	waterTemp: z.number().max(100, {
		message: "Water temp must be at least 1 number.",
	}),
	coffeeDose: z.number().max(100, {
		message: "Coffee dose must be at least 1 number.",
	}),
	bloomYield: z.number().max(100, {
		message: "Bloom yield setting must be at least 1 number.",
	}),
	coffeeYield: z.number().max(100, {
		message: "Coffee yield setting must be at least 1 number.",
	}),
	bloomTime: z.string().max(100, {
		message: "Bloom time must be at least 1 character.",
	}),
	brewTime: z.string().max(100, {
		message: "Bloom time must be at least 1 character.",
	}),
	tastingHighlights: z.string().max(1000, {
		message: "Tasting highlights must be at least 1 character.",
	}),
	tastingNotes: z.string().max(1000, {
		message: "Tasting notes must be at least 1 character.",
	}),
	notes: z.string().max(1000, {
		message: "Notes must be at least 1 character.",
	}),
	link: z.string().max(1000, {
		message: "Link must be at least 1 character.",
	}),
	price: z.number().max(1000, {
		message: "Price must be at least 1 number.",
	}),
});

export default function AddABrewForm() {
	const date = new Date().toDateString();
	var hours = new Date().getHours();
	var minutes = new Date().getMinutes();
	var timeDay = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? 0 + minutes : minutes;
	const seconds = new Date().getSeconds();
	const time = hours + ":" + minutes + ":" + seconds + timeDay;
	const currentDate = date + " " + time;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			todaysDate: currentDate,
			coffeeName: "",
			region: "",
			roastLevel: "",
			process: "",
			brewMethod: "",
			brewDate: "",
			grindSetting: 0,
			waterTemp: 0,
			coffeeDose: 0,
			bloomYield: 0,
			coffeeYield: 0,
			bloomTime: "",
			brewTime: "",
			tastingHighlights: "",
			tastingNotes: "",
			notes: "",
			link: "",
			price: 0,
		},
	});

	// const FORM_URL = "https://usebasin.com/f/720ce3ef2f52";

	function selectRoastLevel() {
		console.log("roast selected");
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		// fetch(FORM_URL, {
		// 	method: "POST",
		// 	headers: {
		// 		"content-type": "application/json",
		// 		accept: "application/json",
		// 	},
		// 	body: JSON.stringify(values),
		// })
		// 	.then((res) => {
		// 		if (res.status === 200) {
		// 			form.reset();
		// 			alert("Thank you for your submission! We'll be in contact soon!");
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
		console.log(JSON.stringify(values));
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-8">
				<FormField
					control={form.control}
					name="coffeeName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Coffee</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								{/* <Input placeholder="" {...field} className="text-[16px]" /> */}
								<ToggleGroup type="single">
									<ToggleGroupItem value="light" aria-label="Toggle light" className="block" onClick={selectRoastLevel}>
										<div className="roast-profile light-profile mx-auto hover:opacity-75 focus-visible:opacity-75"></div>
										<p className="mt-1">Light</p>
									</ToggleGroupItem>
									<ToggleGroupItem value="medium" aria-label="Toggle medium" className="block" onClick={selectRoastLevel}>
										<div className="roast-profile medium-profile mx-auto hover:opacity-75"></div>
										<p className="mt-1">Medium</p>
									</ToggleGroupItem>
									<ToggleGroupItem value="dark" aria-label="Toggle dark" className="block" onClick={selectRoastLevel}>
										<div className="roast-profile dark-profile mx-auto hover:opacity-75"></div>
										<p className="mt-1">Dark</p>
									</ToggleGroupItem>
								</ToggleGroup>
							</FormControl>
							<FormDescription></FormDescription>
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
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="waterTemp"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Water Temp</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="coffeeDose"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Coffee Dose</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bloomYield"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bloom Yield</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="coffeeYield"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Coffee Yield</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="brewTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Brew Time</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tastingHighlights"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tasting Highlights</FormLabel>
							<FormControl>
								{/* <Input placeholder="" {...field} className="text-[16px]" /> */}
								{/* <CoffeeTastingWheel /> */}
							</FormControl>
							<FormDescription></FormDescription>
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
								{/* <Input placeholder="" {...field} className="text-[16px]" /> */}
								{/* <CoffeeTastingWheel /> */}
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								<Textarea placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
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
								<Textarea placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					variant="outline"
					className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]"
				>
					Submit
				</Button>
			</form>
		</Form>
	);
}
