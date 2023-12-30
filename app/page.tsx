"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Promotion from "@/components/promotion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main>
			<Navbar />
			<div className="banner-home">
				<div className="container sm:mx-auto md:mx-auto flex banner-home-copy items-center">
					<h1 className="text-[42px] text-center">
						John Montanye, creative <br />
						&amp; software engineer.
					</h1>
				</div>
			</div>
			<div className="container-fluid bg-black">
				<div className="container sm:mx-auto md:mx-auto text-center copy text-white">
					<h2 className="mb-5 pt-10 md:pt-unset text-white">About this site</h2>
					<p className="mb-5">
						This website was developed using NextJS, TypeScript, shadcn/ui, Tailwind CSS, and HTML5. The different looking style
						is based off a design pattern I call neomat, which draws inspiration from concepts of Neumorphism. The design
						emphasis was to create a &quot;texturized&quot; feel to the website. Check out the code for this website on Github
						below.
					</p>
					<Link
						href="https://github.com/montanyecreative/nextneomat"
						aria-label="Leave website to go to GitHub code repository for website"
						target="_blank"
						rel="noopener"
					>
						<Button className="rounded-full px-10 mb-10 md:mb-unset text-white hover:bg-red hover:border-red hover:text-white cursor-pointer uppercase text-[12px]">
							<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
								<path
									d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
									fill="white"
									fillRule="evenodd"
									clipRule="evenodd"
								></path>
							</svg>
							GitHub
						</Button>
					</Link>
				</div>
			</div>
			<div className="container-fluid bg-black">
				<div className="banner-salesforce">
					<div className="container sm:mx-auto md:mx-auto text-center copy text-black">
						<h2 className="mb-5 pt-5 md:pt-unset text-white">My Salesforce Journey</h2>
						<p className="mb-5 text-white">
							I work by day as a Salesforce Commerce Cloud Developer. Trailhead has become my #1 resource aside from work to
							become B2C certified. Follow my Salesforce journey on Trailhead!
						</p>
						<Link
							href="https://www.salesforce.com/trailblazer/johnmontanye"
							aria-label="Leave website to go to Trailblazer website"
							target="_blank"
							rel="noopener"
						>
							<Button className="rounded-full px-10 mb-10 md:mb-unset text-white hover:bg-red hover:border-red hover:text-white cursor-pointer uppercase text-[12px]">
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2"
								>
									<path
										d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
										fill="white"
										fillRule="evenodd"
										clipRule="evenodd"
									></path>
								</svg>
								Trailblazer Profile
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<div className="container-fluid bg-black pb-2 pt-10 md:pt-unset">
				<div className="container sm:mx-auto md:mx-auto text-center copy text-white">
					<p className="mb-5">Check out some of the web tools and blogs we&apos;ve created.</p>
					<Link href="/tools" aria-label="Go to the tools page" className="mx-3">
						<Button className="rounded-full px-10 mb-10 md:mb-unset text-white hover:bg-red hover:border-red hover:text-white cursor-pointer uppercase text-[12px]">
							Tools
						</Button>
					</Link>
					<Link href="/blogs" aria-label="Go to the blogs page" className="mx-3">
						<Button className="rounded-full px-10 mb-10 md:mb-unset text-white hover:bg-red hover:border-red hover:text-white cursor-pointer uppercase text-[12px]">
							Blogs
						</Button>
					</Link>
				</div>
			</div>
			<Promotion />
			<Footer />
		</main>
	);
}
