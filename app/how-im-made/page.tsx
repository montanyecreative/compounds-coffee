"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/useTranslations";
import { Button } from "@/components/ui/button";

function HowImMadeContent() {
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang") || "en-US";
	const { translations } = useTranslations();

	const buildHrefWithLang = (pathname: string, lang: string) => {
		const params = new URLSearchParams(searchParams?.toString() || "");
		params.set("lang", lang);
		const query = params.toString();
		return query ? `${pathname}?${query}` : pathname;
	};

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-black"></div>
			<div className="container-fluid md:mx-auto how-im-made-page bg-black text-white flex justify-center">
				<div className="grid grid-cols-1 pt-10 mx-5 md:mx-20 justify-center max-w-4xl">
					<div className="mb-12">
						<h1 className="text-[42px] md:text-[48px] mb-4 text-white font-bold">{translations("howImMade.title")}</h1>
						<p className="text-lg text-gray-300 italic">{translations("howImMade.subtitle")}</p>
						<p className="text-sm text-gray-400 italic mt-2">{translations("howImMade.lastUpdated")}</p>
						<p className="text-sm text-gray-400 italic mt-2">{translations("howImMade.notTranslated")}</p>
					</div>

					<div className="mb-10 flex flex-wrap items-center justify-center text-center gap-2 text-gray-300">
						<a href="#technical-architecture" className="underline text-brown hover:text-white">
							{translations("howImMade.nav.technicalArchitecture")}
						</a>
						<span>|</span>
						<a href="#application-structure" className="underline text-brown hover:text-white">
							{translations("howImMade.nav.applicationStructure")}
						</a>
						<span>|</span>
						<a href="#key-features-implementation" className="underline text-brown hover:text-white">
							{translations("howImMade.nav.keyFeatures")}
						</a>
						<span>|</span>
						<a href="#helpful-links" className="underline text-brown hover:text-white">
							{translations("howImMade.nav.helpfulLinks")}
						</a>
						<span>|</span>
						<a href="#deployment" className="underline text-brown hover:text-white">
							{translations("howImMade.nav.deployment")}
						</a>
					</div>

					<section className="mb-16">
						<div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
							<div className="space-y-6 text-gray-200">
								<p className="text-lg leading-relaxed">
									Compounds Coffee was created as a modern web application to help coffee enthusiasts track their brew
									details, discover new brew recipes, and find roasters and shops local to them.
								</p>
								<p className="text-lg leading-relaxed">
									The application is designed to be used on an iPad (6th generation) or similar screen size (as this is
									what I use in my kitchen) but works well on phones, tablets, laptops, and desktops. It&apos;s feature
									rich including supporting multiple languages (English and French), analytics, content management, Google
									Maps API, geocoding, and much more.
								</p>
								<p className="text-lg leading-relaxed">
									The site is built using{" "}
									<Link
										href="https://nextjs.org"
										target="_blank"
										rel="noopener noreferrer"
										className="underline text-brown hover:text-white"
										title="Visit Next.js homepage"
									>
										Next.js
									</Link>
									, using a template I built a couple years ago for fast development. All the coffee data—brews, methods,
									and roaster information is stored and managed through a content management system called{" "}
									<Link
										href="https://www.contentful.com"
										target="_blank"
										rel="noopener noreferrer"
										className="underline text-brown hover:text-white"
										title="Visit Contentful's homepage"
									>
										Contentful
									</Link>
									. A password protected admin dashboard is available to add, update, and delete data through
									communication with Contentful&apos;s API. Please see the{" "}
									<a href="#technical-architecture" className="underline text-brown hover:text-white">
										tech stack section
									</a>{" "}
									for more information.
								</p>
							</div>
						</div>
					</section>

					<section className="mb-16">
						<div className="mb-10">
							<h3 className="text-[24px] mb-8 text-white font-semibold scroll-mt-[100px]" id="technical-architecture">
								{translations("howImMade.sections.technicalArchitecture")}
							</h3>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">{translations("howImMade.sections.frontend")}</h4>
									<ul className="space-y-2 text-gray-300 text-sm">
										<li>
											<strong className="text-white">Next.js 14</strong> - React framework with App Router
										</li>
										<li>
											<strong className="text-white">TypeScript</strong> - Type-safe JavaScript
										</li>
										<li>
											<strong className="text-white">React 18</strong> - UI library
										</li>
										<li>
											<strong className="text-white">Tailwind CSS</strong> - Utility-first styling (although I&apos;m
											not a fan of it)
										</li>
										<li>
											<strong className="text-white">Radix UI</strong> - Accessible component primitives
										</li>
										<li>
											<strong className="text-white">React Hook Form</strong> - Form management
										</li>
										<li>
											<strong className="text-white">Zod</strong> - Schema validation
										</li>
									</ul>
								</div>
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.backendData")}
									</h4>
									<ul className="space-y-2 text-gray-300 text-sm">
										<li>
											<strong className="text-white">Next.js API Routes</strong> - Serverless API endpoints
										</li>
										<li>
											<strong className="text-white">Prisma</strong> - Type-safe database ORM
										</li>
										<li>
											<strong className="text-white">PostgreSQL</strong> - Relational database
										</li>
										<li>
											<strong className="text-white">Contentful</strong> - Headless CMS for content
										</li>
										<li>
											<strong className="text-white">NextAuth.js</strong> - Authentication
										</li>
										<li>
											<strong className="text-white">AWS S3</strong> - File storage
										</li>
										<li>
											<strong className="text-white">AWS Transfer Family</strong> - SFTP service
										</li>
									</ul>
								</div>
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.mapsLocation")}
									</h4>
									<ul className="space-y-2 text-gray-300 text-sm">
										<li>
											<strong className="text-white">Google Maps API</strong> - Interactive maps
										</li>
										<li>
											<strong className="text-white">Geocoding API</strong> - Address to coordinates
										</li>
									</ul>
								</div>
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.analyticsMonitoring")}
									</h4>
									<ul className="space-y-2 text-gray-300 text-sm">
										<li>
											<strong className="text-white">Google Analytics 4</strong> - Web analytics
										</li>
										<li>
											<strong className="text-white">Vercel Analytics</strong> - Performance monitoring
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="mb-10">
							<h3 className="text-[24px] mb-4 text-white font-semibold scroll-mt-[100px]" id="application-structure">
								{translations("howImMade.sections.applicationStructure")}
							</h3>
							<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
								<div className="space-y-4 text-gray-300">
									<div>
										<h4 className="text-lg font-semibold mb-2 text-white">
											{translations("howImMade.sections.frontendStructure")}
										</h4>
										<p className="mb-3">
											The application uses Next.js 14&apos;s App Router, which provides a file-based routing system.
											Pages are located in the <code className="bg-gray-800 px-2 py-1 rounded text-brown">app/</code>{" "}
											directory, and components are organized in the{" "}
											<code className="bg-gray-800 px-2 py-1 rounded text-brown">components/</code> directory.
										</p>
										<p className="mb-3">Some important files to note:</p>
										<ul className="list-disc list-inside space-y-1 ml-4 text-sm">
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">app/</code> - Main application
												directory
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">components/</code> - Reusable
												components
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">lib/</code> - Helper functions
												and API calls
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">lib/auth.ts</code> -
												Authentication helper functions
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">lib/contentful.ts</code> -
												Contentful main file for communication with Contentful&apos;s API.
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">lib/geocoding.ts</code> -
												Contentful does not accept addresses so I had to add functions that would turn addresses
												into lat/long to send to Contentful&apos;s API. Also has functions for Google Maps API and
												Geocoding API. Please refer to the{" "}
												<a
													href="#roasters-and-shops-locator-key-feature"
													className="underline text-brown hover:text-white"
												>
													roasters and shops key features and implementation section
												</a>{" "}
												for more information.
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">lib/i18n.ts</code> -
												Internationalization helper functions. For all non-Contentful text, JSON files are used to
												store the text.
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">lib/prisma.ts</code> - Prisma
												main file for communication with the PostgreSQL database on Vercel.
											</li>
											<li>
												<code className="bg-gray-800 px-2 py-1 rounded text-brown">lib/processRoastersFile.ts</code>
												- Helper functions for automated roaster data imports.
											</li>
										</ul>
									</div>
									<div>
										<h4 className="text-lg font-semibold mb-2 text-white">
											{translations("howImMade.sections.dataManagement")}
										</h4>
										<p className="mb-3">The application uses a hybrid approach to data management:</p>
										<ul className="list-disc list-inside space-y-1 ml-4 text-sm">
											<li>
												<strong className="text-white">Contentful CMS</strong> - Stores coffee brews, brew methods,
												and roaster information. This allows non-technical users to manage content.
											</li>
											<li>
												<strong className="text-white">PostgreSQL Database</strong> - Stores user accounts, admin
												settings, and application state via Prisma ORM through Vercel.
											</li>
											<li>
												<strong className="text-white">AWS S3</strong> - Stores uploaded files like roaster Excel
												sheets.
											</li>
										</ul>
									</div>
									<div>
										<h4 className="text-lg font-semibold mb-2 text-white">
											{translations("howImMade.sections.apiLayer")}
										</h4>
										<p className="mb-3">
											API routes are located in{" "}
											<code className="bg-gray-800 px-2 py-1 rounded text-brown">app/api/</code> and handle:
										</p>
										<ul className="list-disc list-inside space-y-1 ml-4 text-sm">
											<li>Admin operations (CRUD for brews, roaster uploads, sync settings)</li>
											<li>Authentication via NextAuth.js</li>
											<li>Scheduled cron jobs for syncing roaster data</li>
											<li>SFTP synchronization for automated roaster data imports</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div className="mb-10">
							<h3 className="text-[24px] mb-4 text-white font-semibold scroll-mt-[100px]" id="key-features-implementation">
								{translations("howImMade.sections.keyFeatures")}
							</h3>
							<div className="space-y-6">
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.coffeeBrewsMethods")}
									</h4>
									<p className="text-gray-300 mb-3">
										Comprehensive information for different coffee brews and brewing methods. Content is managed through
										Contentful and pulled in through Contentful&apos;s API.
									</p>
									<p className="text-sm text-gray-400">
										<strong>Tech:</strong> Contentful CMS, Next.js dynamic routes, responsive design
									</p>
								</div>
								<div
									className="bg-gray-900 rounded-lg p-6 border border-gray-800 scroll-mt-[100px]"
									id="roasters-and-shops-locator-key-feature"
								>
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.roastersShopsLocator")}
									</h4>
									<p className="text-gray-300 mb-3">
										Interactive{" "}
										<a href="/roasters-and-shops" className="underline text-brown hover:text-white">
											map showing roasters and coffee shops
										</a>{" "}
										with two way geocoding, map themeing, search functionality, and a toggle between map and grid views.
										Content is managed through AWS S3, a cron job, and Contentful, pulled in through Contentful&apos;s
										API.
									</p>
									<p className="text-gray-300 mb-3">
										As noted above in the{" "}
										<a href="#application-structure" className="underline text-brown hover:text-white">
											application structure section
										</a>
										, Contentful does not accept addresses so functions were added that turn addresses into lat/long to
										send to Contentful&apos;s API. Once the content pages are built in Contentful, the store locator
										page grabs the locations and geocodes the lat/long back into addresses to display if the lat/long do
										not exist already, using Google Maps API.
									</p>
									<p className="text-gray-300 mb-3">
										Here is an example of the object expected to be sent to Contentful&apos;s API for the roasters and
										shop locations:
									</p>
									<pre className="bg-gray-800 p-4 rounded text-brown overflow-x-auto">
										<code>{`interface RoasterAndShopSkeleton extends EntrySkeletonType {
    contentTypeId: "roastersAndShops" | "roastersAndShopsTest";
    fields: {
        shopName: string;
        shopLocation: {
            lat: number;
            lon: number;
        };
        shopWebsite: string;
        shopPhoneNumber: string;
    };
}`}</code>
									</pre>
									<p className="text-gray-300 mb-3">
										Once logged in via the provided credentials, you will then be able to see the data toggle button on
										the roasters and shops locator page. The test data comes from the excel file stored via AWS.
									</p>
									<p className="text-gray-300 mb-3">
										There is also search functionality built into the map and grid views. You can search by store name,
										zipcode, or city to filter down the results. This functionality also uses the Google Maps API.
									</p>
									<p className="text-gray-300 mb-3">
										Themeing is also included on the map view. You can toggle between the default Google Maps color
										theme and a custom one using the color palette of Compounds Coffee project.
									</p>
									<p className="text-sm text-gray-400">
										<strong>Tech:</strong> Google Maps API, React Google Maps, Geocoding API, Contentful CMS
									</p>
								</div>
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.internationalization")}
									</h4>
									<p className="text-gray-300 mb-3">
										Full bilingual support for English and French with language switching and persistent preferences via
										URL parameters. (Contentful free plan only supports two languages). JSON translation storage
										elsewhere used for ease.
									</p>
									<p className="text-sm text-gray-400">
										<strong>Tech:</strong> Custom translation system, JSON locale files, URL-based language routing
									</p>
								</div>
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.adminDashboard")}
									</h4>
									<p className="text-gray-300 mb-3">
										Protected admin area for managing brews, uploading roaster data via Excel, configuring scheduled
										syncs, and managing SFTP connections. Prisma database is used to store user accounts through Vercel.
									</p>
									<p className="text-gray-300 mb-3">
										View access only for provided credentials unless given admin access.
									</p>
									<p className="text-sm text-gray-400">
										<strong>Tech:</strong> NextAuth.js, Prisma, AWS S3, Excel parsing (xlsx), SFTP client, Vercel,
										Postgres
									</p>
								</div>
								<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
									<h4 className="text-lg font-semibold mb-3 text-brown">
										{translations("howImMade.sections.automatedDataSync")}
									</h4>
									<p className="text-gray-300 mb-3">
										Scheduled cron jobs that sync roaster data from AWS S3 SFTP servers and update Contentful entries
										automatically.
									</p>
									<p className="text-gray-300 mb-3">Scheduled cron jobs are set to run every day at 1:10 PM CST.</p>
									<p className="text-gray-300 mb-3">
										Once the cron job is run, the roaster data that existed in Contentful is deleted and the new data is
										added. I am unsure if there are quota limits within Contentful that could prevent this from being
										scalable at the time of writing.
									</p>
									<p className="text-sm text-gray-400">
										<strong>Tech:</strong> Vercel Cron, Contentful Management API, SFTP client, Excel processing
									</p>
								</div>
							</div>
						</div>

						<div className="mb-10">
							<h3 className="text-[24px] mb-4 text-white font-semibold scroll-mt-[100px]" id="helpful-links">
								{translations("howImMade.sections.helpfulLinks")}
							</h3>
							<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>
										<Link
											href="https://www.contentful.com/help/getting-started/contentful-glossary/"
											target="_blank"
											rel="noopener noreferrer"
											className="underline text-brown hover:text-white"
											title="Visit Contentful's glossary page"
										>
											Contentful Glossary
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className="mb-10">
							<h3 className="text-[24px] mb-4 text-white font-semibold scroll-mt-[100px]" id="deployment">
								{translations("howImMade.sections.deployment")}
							</h3>
							<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
								<div className="space-y-4 text-gray-300">
									<div>
										<h4 className="text-lg font-semibold mb-2 text-white">
											{translations("howImMade.sections.deployment")}
										</h4>
										<p className="mb-3 text-sm">
											The application is deployed on <strong className="text-white">Vercel</strong>, which provides:
										</p>
										<ul className="list-disc list-inside space-y-1 ml-4 text-sm">
											<li>Automatic deployments from Git</li>
											<li>Edge network for global performance</li>
											<li>Serverless functions for API routes</li>
											<li>Cron job support for scheduled tasks</li>
											<li>Environment variable management</li>
										</ul>
									</div>
								</div>
								<div className="space-y-4 text-gray-300">
									<div>
										<h4 className="text-lg font-semibold my-2 text-white">
											{translations("howImMade.sections.aboutGitHub")}
										</h4>
										<ul className="list-disc list-inside space-y-1 ml-4 text-sm">
											<li>
												There is only one branch, main, that I commit all the features to. I know this is not best
												practice, however given the scale of the project and time allotment available to me, I chose
												this strategy for simplicity and speed.
											</li>
											<li>
												Sometimes the builds may appear that they&apos;ve failed in GitHub. This is a false positive
												I&apos;ve noticed. I currently have builds automatically functioning in tandem with
												Contentful content updates using hooks. Anytime a new content entry is added in Contentful,
												the build redeploys to factor in the content update. At this point of exploring, I&apos;m
												unsure if this is the best way of handling this or if there is a less resource heavy way to
												handle it via the builds.
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div className="mb-10">
							<h3
								className="text-[24px] mb-4 text-white text-center font-semibold scroll-mt-[100px]"
								id="repository-disclaimers"
							>
								{translations("howImMade.sections.repositoryDisclaimers")}
							</h3>
							<div className="bg-gray-900 text-center">
								<p className="text-lg leading-relaxed font-bold mb-3">{translations("howImMade.disclaimers.notPwaKit")}</p>
								<p className="text-lg leading-relaxed mb-7">{translations("howImMade.disclaimers.frontendLeaning")}</p>
								<Link
									href="https://github.com/montanyecreative/compounds-coffee"
									aria-label={translations("home.githubAria")}
									target="_blank"
									rel="noopener"
								>
									<Button className="rounded-full px-10 mb-10 md:mb-unset text-white border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
										{translations("home.githubButton2")}
										<svg
											width="15"
											height="15"
											viewBox="0 0 15 15"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="ml-2"
										>
											<path
												d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
												fill="white"
												fillRule="evenodd"
												clipRule="evenodd"
											></path>
										</svg>
									</Button>
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>
			<Footer />
		</main>
	);
}

export const dynamic = "force-dynamic";

export default function HowImMade() {
	return (
		<Suspense
			fallback={
				<main>
					<Navbar />
					<div className="page-banner-filler bg-black"></div>
					<div className="container sm:mx-auto md:mx-auto how-im-made-page bg-black text-white">
						<div className="grid grid-cols-1 pt-10 mx-auto md:mx-20 justify-center">
							<h2 className="text-[34px] mb-2 text-white">Loading...</h2>
						</div>
					</div>
					<Footer />
				</main>
			}
		>
			<HowImMadeContent />
		</Suspense>
	);
}
