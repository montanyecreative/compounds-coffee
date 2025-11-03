"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/useTranslations";
import { navLinks } from "@/lib/navLinks";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";

const logo = "/logo.webp";

export default function Navbar() {
	const [active, setActive] = useState("Home");
	const [toggle, setToggle] = useState(false);
	const currentRoute = usePathname();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang") || "en-US";
	const { translations } = useTranslations();

	const buildHrefWithLang = (pathname: string, lang: string) => {
		const params = new URLSearchParams(searchParams?.toString() || "");
		params.set("lang", lang);
		const query = params.toString();
		return query ? `${pathname}?${query}` : pathname;
	};

	const [show, setShow] = useState(true);

	// non sticky nav {
	// const controlNavbar = () => {
	// 	if (window.scrollY < 50) {
	// 		setShow(true);
	// 	} else {
	// 		setShow(false);
	// 	}
	// };

	// useEffect(() => {
	// 	window.addEventListener("scroll", controlNavbar);
	// 	return () => {
	// 		window.removeEventListener("scroll", controlNavbar);
	// 	};
	// }, []);
	// }

	return (
		<nav className={`w-full flex py-6 justify-between items-center navbar ${show && "nav-show"}`} id="navbar">
			<div className="container mx-auto">
				<div className="flex">
					<div className="logo">
						<Link href="/" className="flex">
							<Image src={logo} alt="logo" width="50" height="35" />
							<span className="text-white ml-2 text-[20px]">Compounds Coffee</span>
						</Link>
					</div>

					<ul className="list-none sm:flex hidden justify-end flex-1 items-center">
						{navLinks.map((nav, index) => (
							<li
								key={nav.id}
								className="text-white uppercase cursor-pointer text-[12px] lg:text-[13px] mr-3 md:mr-5 lg:mr-8"
								onClick={() => setActive(nav.link)}
							>
								<a
									className={`hover:custom-hover ${currentRoute === "/" + nav.link ? "custom-underline" : ""}`}
									href={buildHrefWithLang(`/${nav.link}`, currentLang)}
								>
									{translations(nav.titleKey)}
								</a>
							</li>
						))}
					</ul>
					<div className="ml-2 flex items-center gap-2 text-white text-[12px]">
						<a
							href={buildHrefWithLang(currentRoute || "/", "en-US")}
							className={`uppercase ${currentLang === "en-US" ? "font-bold text-brown hover:cursor-pointer" : "opacity-80"}`}
						>
							EN
						</a>
						<span>|</span>
						<a
							href={buildHrefWithLang(currentRoute || "/", "fr-CA")}
							className={`uppercase ${currentLang === "fr-CA" ? "font-bold text-brown hover:cursor-pointer" : "opacity-80"}`}
						>
							FR
						</a>
					</div>
					<div className="sm:hidden flex flex-1 justify-end items-center">
						<button
							className="w-[28px] h-[28px] flex items-center justify-center"
							onClick={() => setToggle(!toggle)}
							aria-label="Toggle menu"
						>
							<div className={`hamburger-icon ${toggle ? "rotate" : ""}`}>
								{toggle ? (
									<Cross1Icon className="w-8 h-8 text-white" />
								) : (
									<HamburgerMenuIcon className="w-8 h-8 text-white" />
								)}
							</div>
						</button>

						<div
							className={`${
								toggle ? "mobile-menu show" : "mobile-menu"
							} p-6 text-white bg-black absolute top-20 right-0 md:mx-4 md:my-2 min-w-[100%] sidebar`}
						>
							<ul className="list-none flex justify-end items-start flex-1 flex-col">
								{navLinks.map((nav, index) => (
									<li
										key={nav.id}
										className={`font-medium cursor-pointer text-[18px] ${
											index === navLinks.length - 1 ? "mb-0" : "mb-4"
										}`}
										onClick={() => setActive(nav.link)}
									>
										<a href={buildHrefWithLang(`/${nav.link}`, currentLang)}>{translations(nav.titleKey)}</a>
									</li>
								))}
							</ul>
							<div className="mt-4 text-[14px]">
								<a
									href={buildHrefWithLang(currentRoute || "/", "en-US")}
									className={`uppercase mr-2 ${
										currentLang === "en-US" ? "font-bold text-brown hover:cursor-pointer" : "opacity-80"
									}`}
								>
									EN
								</a>
								<a
									href={buildHrefWithLang(currentRoute || "/", "fr-CA")}
									className={`uppercase ${
										currentLang === "fr-CA" ? "font-bold text-brown hover:cursor-pointer" : "opacity-80"
									}`}
								>
									FR
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
