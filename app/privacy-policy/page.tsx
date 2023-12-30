"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

export default function PrivacyPolicy() {
	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-black"></div>
			<div className="container sm:mx-auto md:mx-auto privacy-page bg-black text-white">
				<div className="grid grid-cols-1 pt-10 mx-auto md:mx-20 justify-center">
					<h2 className="text-[34px] mb-2 text-white">Privacy Policy Overview</h2>
					<p className="italic">
						This Privacy Policy describes how your personal information is collected, used, and shared when you visit or submit
						information to montanyecreative.com
					</p>
					<h3 className="font-bold mt-3 mb-2">WHAT PERSONAL INFORMATION WE COLLECT</h3>
					<p className="my-1">
						When you visit the Site, we automatically collect certain information about your device, including information about
						your web browser, IP address, time zone, and some of the cookies that are installed on your device.
					</p>
					<p className="my-1">
						Additionally, as you browse the Site, we collect information about the individual web pages or products that you
						view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
						We refer to this automatically collected information as Device Information.
					</p>
					<h3 className="font-bold mt-3 mb-2">We collect Device Information using the following technologies:</h3>
					<p className="my-1">
						Cookies are data files that are placed on your device or computer and often include an anonymous unique identifier.
					</p>
					<p className="my-1">
						Log files track actions occurring on the Site, and collect data including your IP address, browser type, Internet
						service provider, referring/exit pages, and date/time stamps.
					</p>
					<p className="my-1">
						Also, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from
						you, including your name, billing address, shipping address, payment information including credit card numbers
						Mention all types of accepted payments, email address, and phone number. This is called Order Information.
					</p>
					<p className="my-1">
						By Personal Information in this Privacy Policy, we are talking both about Device Information and Order Information.
					</p>
					<h3 className="font-bold mt-3 mb-2">HOW WE USE YOUR PERSONAL INFORMATION</h3>
					<p className="my-1">
						We use the Order Information that we collect generally to fulfil any orders placed through the Site including
						processing your payment information, arranging for shipping, and providing you with invoices and/or order
						confirmations.
					</p>
					<h3 className="font-bold mt-3 mb-2">Additionally, we use this Order Information to:</h3>
					<ul className="list-disc mx-5">
						<li>Communicate with you.</li>
						<li>Screen our orders for potential risk or fraud.</li>
						<li>
							When in line with the preferences you have shared with us, provide you with information or advertising relating
							to our products or services.
						</li>
						<li>
							We use the Device Information that we collect to help us screen for potential risk and fraud in particular, your
							IP address, and more generally to improve and optimize our Site.
						</li>
					</ul>
					<h3 className="font-bold mt-3 mb-2">SHARING YOUR PERSONAL INFORMATION</h3>
					<p className="my-1">
						We share your Personal Information with third parties to help us use your Personal Information, as described above.
					</p>
					<p className="my-1">
						We also use Vercel Analytics to help us understand how our customers use montanyecreative.com. How Vercel uses your
						Personal Information.
					</p>
					<p className="my-1">
						Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a
						subpoena, search warrant or other lawful requests for information we receive, or to otherwise protect our rights.
					</p>
					<h3 className="font-bold mt-3 mb-2">BEHAVIOURAL ADVERTISING</h3>
					<p className="my-1">
						We use your Personal Information to provide you with targeted advertisements or marketing communications we believe
						may be of interest to you.{" "}
						<span className="font-bold">
							To opt out of targeted advertising please contact us{" "}
							<Link href="/contact" aria-label="Contact us here">
								here.
							</Link>
						</span>
					</p>
					<h3 className="font-bold mt-3 mb-2">YOUR RIGHTS</h3>
					<p className="my-1">
						If you are a European resident, you have the right to access the personal information we hold about you and to ask
						that your personal information is corrected, updated, or deleted. If you would like to exercise this right, please{" "}
						<Link href="/contact" aria-label="Contact us here">
							contact us
						</Link>
						.
					</p>
					<p className="my-1">
						Additionally, if you are a European resident we note that we are processing your information in order to fulfil
						contracts we might have with you for example if you make an order through the Site, or otherwise to pursue our
						legitimate business interests listed above.
					</p>
					<p className="my-1">
						Please note that your information will be transferred outside of Europe, including to Canada and the United States.
					</p>
					<h3 className="font-bold mt-3 mb-2">DATA RETENTION</h3>
					<p className="my-1">
						When you place an order through the Site, we will maintain your Order Information for our records unless and until
						you ask us to delete this information.
					</p>
					<h3 className="font-bold mt-3 mb-2">USE BY MINORS</h3>
					<p className="my-1">The Site is not intended for individuals under the age of 16.</p>
					<h3 className="font-bold mt-3 mb-2">CHANGES</h3>
					<p className="my-1">
						We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or
						for other operational, legal or regulatory reasons.
					</p>
					<p className="font-bold my-1">
						If you have questions and/or require more information, do not hesitate to{" "}
						<Link href="/contact" aria-label="Contact us here">
							contact us here.
						</Link>
					</p>
				</div>
			</div>
			<Footer />
		</main>
	);
}
