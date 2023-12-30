import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Promotion() {
	return (
		<div className="container sm:mx-auto md:mx-auto grid text-center banner-promotion">
			<h5 className="subtitle text-white mt-10 md:mt-unset">Prints To Your Door</h5>
			<h2 className="text-white">Shop Infrared Photography</h2>
			<div className="grid grid-row pt-10 justify-center">
				<Link
					href="https://montanyecreative.store/"
					aria-label="Leave website to go to montanycreative.store"
					target="_blank"
					rel="noopener"
				>
					<Button
						variant="outline"
						className="rounded-full px-10 text-white hover:bg-red hover:border-red hover:text-white cursor-pointer uppercase text-[12px]"
					>
						See Prints
					</Button>
				</Link>
			</div>
		</div>
	);
}
