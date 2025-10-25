import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sunburst } from "@nivo/sunburst";

const data = {
	name: "nivo",
	color: "hsl(40, 70%, 50%)",
	children: [
		{
			name: "Roasted",
			color: "hsl(183, 70%, 50%)",
			children: [
				{
					name: "stack",
					color: "hsl(29, 70%, 50%)",
					children: [
						{
							name: "cchart",
							color: "hsl(10, 70%, 50%)",
							loc: 61976,
						},
						{
							name: "xAxis",
							color: "hsl(356, 70%, 50%)",
							loc: 26539,
						},
						{
							name: "yAxis",
							color: "hsl(216, 70%, 50%)",
							loc: 51049,
						},
					],
				},
				{
					name: "ppie",
					color: "hsl(128, 70%, 50%)",
					children: [
						{
							name: "chart",
							color: "hsl(212, 70%, 50%)",
							children: [
								{
									name: "pie",
									color: "hsl(212, 70%, 50%)",
									children: [
										{
											name: "outline",
											color: "hsl(244, 70%, 50%)",
											loc: 21194,
										},
										{
											name: "slices",
											color: "hsl(113, 70%, 50%)",
											loc: 51309,
										},
									],
								},
							],
						},
						{
							name: "legends",
							color: "hsl(279, 70%, 50%)",
							loc: 13068,
						},
					],
				},
			],
		},
		{
			name: "Spices",
			color: "hsl(45, 70%, 50%)",
			children: [
				{
					name: "rgb",
					color: "hsl(43, 70%, 50%)",
					loc: 195700,
				},
				{
					name: "hsl",
					color: "hsl(309, 70%, 50%)",
					loc: 120602,
				},
			],
		},
		{
			name: "Nutty/Cocoa",
			color: "hsl(105, 70%, 50%)",
			children: [
				{
					name: "randomize",
					color: "hsl(133, 70%, 50%)",
					loc: 170621,
				},
				{
					name: "resetClock",
					color: "hsl(167, 70%, 50%)",
					loc: 155119,
				},
				{
					name: "noop",
					color: "hsl(56, 70%, 50%)",
					loc: 130678,
				},
				{
					name: "tick",
					color: "hsl(354, 70%, 50%)",
					loc: 16469,
				},
				{
					name: "forceGC",
					color: "hsl(291, 70%, 50%)",
					loc: 171134,
				},
				{
					name: "stackTrace",
					color: "hsl(309, 70%, 50%)",
					loc: 180327,
				},
				{
					name: "dbg",
					color: "hsl(73, 70%, 50%)",
					loc: 76919,
				},
			],
		},
		{
			name: "Sweet",
			color: "hsl(160, 70%, 50%)",
			children: [
				{
					name: "address",
					color: "hsl(350, 70%, 50%)",
					loc: 185136,
				},
				{
					name: "city",
					color: "hsl(285, 70%, 50%)",
					loc: 76175,
				},
				{
					name: "animal",
					color: "hsl(216, 70%, 50%)",
					loc: 155734,
				},
				{
					name: "movie",
					color: "hsl(259, 70%, 50%)",
					loc: 28697,
				},
				{
					name: "user",
					color: "hsl(118, 70%, 50%)",
					loc: 192914,
				},
			],
		},
		{
			name: "Floral",
			color: "hsl(165, 70%, 50%)",
			children: [
				{
					name: "trim",
					color: "hsl(359, 70%, 50%)",
					loc: 96899,
				},
				{
					name: "slugify",
					color: "hsl(357, 70%, 50%)",
					loc: 80429,
				},
				{
					name: "snakeCase",
					color: "hsl(284, 70%, 50%)",
					loc: 142450,
				},
				{
					name: "camelCase",
					color: "hsl(208, 70%, 50%)",
					loc: 24004,
				},
				{
					name: "repeat",
					color: "hsl(48, 70%, 50%)",
					loc: 132504,
				},
				{
					name: "padLeft",
					color: "hsl(288, 70%, 50%)",
					loc: 162563,
				},
				{
					name: "padRight",
					color: "hsl(42, 70%, 50%)",
					loc: 2711,
				},
				{
					name: "sanitize",
					color: "hsl(166, 70%, 50%)",
					loc: 175943,
				},
				{
					name: "ploucify",
					color: "hsl(280, 70%, 50%)",
					loc: 77871,
				},
			],
		},
		{
			name: "Fruity",
			color: "hsl(200, 70%, 50%)",
			children: [
				{
					name: "other",
					color: "hsl(217, 70%, 50%)",
					loc: 152432,
				},
			],
		},
		{
			name: "Sour/Fermented",
			color: "hsl(200, 70%, 50%)",
			children: [
				{
					name: "other",
					color: "hsl(217, 70%, 50%)",
					loc: 152432,
				},
			],
		},
		{
			name: "Green/Vegetative",
			color: "hsl(200, 70%, 50%)",
			children: [
				{
					name: "other",
					color: "hsl(217, 70%, 50%)",
					loc: 152432,
				},
			],
		},
	],
};

export function CoffeeTastingWheel() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Coffee Tasting Wheel</Button>
			</DialogTrigger>
			<DialogContent className="bg-white dialog-container">
				<DialogHeader>
					<DialogTitle>Coffee Tasting Wheel</DialogTitle>
					<DialogDescription>Pick your coffee flavor here</DialogDescription>
				</DialogHeader>
				<div className="flavor-wheel-container">
					<Sunburst
						data={data}
						id="name"
						value="loc"
						cornerRadius={2}
						borderColor={{ theme: "background" }}
						colors={{ scheme: "oranges" }}
						childColor={{
							from: "color",
							modifiers: [["brighter", 0.1]],
						}}
						enableArcLabels={true}
						arcLabel="id"
						arcLabelsSkipAngle={10}
						arcLabelsTextColor={{
							from: "color",
							modifiers: [["darker", 1.4]],
						}}
						height={750}
						width={750}
					/>
				</div>
				<DialogFooter>
					<Button
						type="submit"
						className="rounded-full px-10 mb-10 md:mb-unset text-black border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]"
					>
						Pick Tasting Notes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
