"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
	todaysDate: z.string().max(100, {
		message: "Incorrect date.",
	}),
	coffee: z.string().min(2, {
		message: "Name must be at least 1 character.",
	}),
	region: z.string().min(2, {
		message: "Name must be at least 1 character.",
	}),
	roastLevel: z.string().min(2, {
		message: "Name must be at least 1 character.",
	}),
	roastDate: z.string().max(100, {
		message: "Incorrect date.",
	}),
	process: z.string().max(100, {
		message: "Name must be at least 1 character.",
	}),
	brewMethod: z.string().max(100, {
		message: "Name must be at least 1 character.",
	}),
	grindSetting: z.string().max(100, {
		message: "Name must be at least 1 character.",
	}),
	waterTemp: z.string().max(100, {
		message: "Name must be at least 1 character.",
	}),
	dose: z.string().max(100, {
		message: "Name must be at least 1 character.",
	}),
	yield: z.string().max(100, {
		message: "Name must be at least 1 character.",
	}),
	brewTime: z.string().max(100, {
		message: "Name must be at least 1 character.",
	}),
	tastingNotes: z.string().max(1000, {
		message: "Name must be at least 1 character.",
	}),
	notes: z.string().max(1000, {
		message: "Message must be at least 1 character.",
	}),
});

export default function BrewLogForm() {
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
			coffee: "",
			region: "",
			roastLevel: "",
			roastDate: "",
			process: "",
			brewMethod: "",
			grindSetting: "",
			waterTemp: "",
			dose: "",
			yield: "",
			brewTime: "",
			tastingNotes: "",
			notes: "",
		},
	});

	// const FORM_URL = "https://usebasin.com/f/720ce3ef2f52";

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
					name="coffee"
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
								<Input placeholder="" {...field} className="text-[16px]" />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="roastDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Roast Date</FormLabel>
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
					name="dose"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dose</FormLabel>
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
					name="yield"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Yield</FormLabel>
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
					name="tastingNotes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tasting Notes</FormLabel>
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
				<Button
					type="submit"
					variant="outline"
					className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-highlight hover:border-highlight hover:text-white cursor-pointer uppercase text-[12px]"
				>
					Submit
				</Button>
			</form>
		</Form>
	);
}
