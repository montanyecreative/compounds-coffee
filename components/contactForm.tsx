"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
	date: z.string().max(100, {
		message: "Incorrect date.",
	}),
	name: z.string().min(2, {
		message: "Name must be at least 1 character.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	phone: z.string().min(10, {
		message: "Please enter a valid phone number.",
	}),
	message: z.string().min(1, {
		message: "Message must be at least 1 character.",
	}),
});

export default function ContactForm() {
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
			date: currentDate,
			name: "",
			email: "",
			phone: "",
			message: "",
		},
	});

	const FORM_URL = "https://usebasin.com/f/720ce3ef2f52";

	function onSubmit(values: z.infer<typeof formSchema>) {
		fetch(FORM_URL, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(values),
		})
			.then((res) => {
				if (res.status === 200) {
					form.reset();
					alert("Thank you for your submission! We'll be in contact soon!");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} method="POST" action={FORM_URL} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
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
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
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
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
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
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Message</FormLabel>
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
					className="rounded-full px-10 text-white hover:bg-red hover:border-red hover:text-white cursor-pointer uppercase text-[12px]"
				>
					Submit
				</Button>
			</form>
		</Form>
	);
}
