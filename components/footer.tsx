import Image from "next/image";
import Link from "next/link";

const logo = "/logo.webp";

export default function Footer() {
	const date = new Date();
	const currentYear = date.getFullYear();

	return (
		<footer className="container sm:mx-auto md:mx-auto grid text-center py-10 bg-mediumRoast text-white" id="footer">
			<div className="logo mb-10">
				<Link href="/" className="flex justify-center" aria-label="Go to Home page">
					<Image src={logo} alt="logo" width="40" height="25" />
					<span className="text-white ml-2 text-[20px]">Compounds Coffee</span>
				</Link>{" "}
			</div>
			<div className="grid md:flex justify-center">
				<Link
					href="/brew-log"
					className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-highlight"
					aria-label="Go to Brew Log page"
				>
					Brew Log
				</Link>
				<Link
					href="/favorite-coffees"
					className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-highlight"
					aria-label="Go to Favorite Coffees page"
				>
					Favorite Coffees
				</Link>
				<Link
					href="/contact"
					className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-highlight"
					aria-label="Go to Contact page"
				>
					Contact
				</Link>
			</div>
			<div className="social-media-links flex items-center mx-auto my-5">
				<Link
					href="mailto:montanyecreative@outlook.com"
					className="mx-5 social-media-link-outline hover:bg-highlight"
					aria-label="Email montanyecreative@outlook.com"
				>
					<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>
				</Link>
			</div>
			<div className="contact-information grid md:flex items-center mx-auto mt-5 text-[12px]">
				<span className="font-bold mx-1">CONTACT INFORMATION:</span>
				<Link className="underline" href="mailto:montanyecreative@outlook.com" aria-label="Email montanyecreative@outlook.com">
					Montanye Creative
				</Link>
			</div>
			<div className="copy-right grid md:flex items-center mx-auto mt-2 text-[12px]">
				Copyright © {currentYear} Compounds Coffee |{" "}
				<Link className="ml-1 underline hover:text-highlight" href="/privacy-policy" aria-label="Go to Privacy Policy page">
					Privacy Policy
				</Link>
			</div>
			<script
				data-name="BMC-Widget"
				data-cfasync="false"
				src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
				data-id="johnmontanye"
				data-description="Support me on Buy me a coffee!"
				data-message=""
				data-color="#00C9AD"
				data-position="Right"
				data-x_margin="25"
				data-y_margin="25"
				defer
			></script>
		</footer>
	);
}
