import Image from "next/image";
import Link from "next/link";

const logo = "/logo.webp";

export default function Footer() {
	const date = new Date();
	const currentYear = date.getFullYear();

	return (
		<footer className="container sm:mx-auto md:mx-auto grid text-center py-10 bg-black text-white" id="footer">
			<div className="logo mb-10">
				<Link href="/" className="flex justify-center" aria-label="Go to Home page">
					<Image src={logo} alt="logo" width="40" height="25" />
					<span className="text-white ml-2 text-[20px]">Montanye Creative</span>
				</Link>{" "}
			</div>
			<div className="grid md:flex justify-center">
				<Link
					href="/photography"
					className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-red"
					aria-label="Go to Photography page"
				>
					Photography
				</Link>
				<Link
					href="/photo-vhs-digitization"
					className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-red"
					aria-label="Go to Photo/VHS Digitization page"
				>
					Photo/VHS Digitization
				</Link>

				<Link
					href="/website-development"
					className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-red"
					aria-label="Go to Website Development page"
				>
					Website Development
				</Link>
				<Link href="/resume" className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-red" aria-label="Go to Resume page">
					Resume
				</Link>
				<Link
					href="/contact"
					className="mx-5 my-2 md:my-unset text-[13px] uppercase hover:text-red"
					aria-label="Go to Contact page"
				>
					Contact
				</Link>
			</div>
			<div className="social-media-links flex items-center mx-auto my-5">
				<Link
					href="https://www.linkedin.com/in/johnmontanye/"
					className="mx-5 social-media-link-outline hover:bg-red"
					aria-label="Leave site to go to LinkedIn page"
					target="_blank"
					rel="noopener"
				>
					<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2 1C1.44772 1 1 1.44772 1 2V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V2C14 1.44772 13.5523 1 13 1H2ZM3.05 6H4.95V12H3.05V6ZM5.075 4.005C5.075 4.59871 4.59371 5.08 4 5.08C3.4063 5.08 2.925 4.59871 2.925 4.005C2.925 3.41129 3.4063 2.93 4 2.93C4.59371 2.93 5.075 3.41129 5.075 4.005ZM12 8.35713C12 6.55208 10.8334 5.85033 9.67449 5.85033C9.29502 5.83163 8.91721 5.91119 8.57874 6.08107C8.32172 6.21007 8.05265 6.50523 7.84516 7.01853H7.79179V6.00044H6V12.0047H7.90616V8.8112C7.8786 8.48413 7.98327 8.06142 8.19741 7.80987C8.41156 7.55832 8.71789 7.49825 8.95015 7.46774H9.02258C9.62874 7.46774 10.0786 7.84301 10.0786 8.78868V12.0047H11.9847L12 8.35713Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>
				</Link>
				<Link
					href="mailto:montanyecreative@outlook.com"
					className="mx-5 social-media-link-outline hover:bg-red"
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
				Copyright © {currentYear} Montanye Creative |{" "}
				<Link className="ml-1 underline hover:text-red" href="/privacy-policy" aria-label="Go to Privacy Policy page">
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
				data-color="#c6284a"
				data-position="Right"
				data-x_margin="25"
				data-y_margin="25"
				defer
			></script>
		</footer>
	);
}
