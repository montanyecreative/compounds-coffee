"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "@/lib/useTranslations";
import { navLinks } from "@/lib/navLinks";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const logo = "/logo.webp";

function NavbarContent() {
	const [active, setActive] = useState("Home");
	const [toggle, setToggle] = useState(false);
	const currentRoute = usePathname();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang") || "en-US";
	const { translations } = useTranslations();
	const { data: session, status } = useSession();
	const router = useRouter();

	const buildHrefWithLang = (pathname: string, lang: string) => {
		const params = new URLSearchParams(searchParams?.toString() || "");
		params.set("lang", lang);
		const query = params.toString();
		return query ? `${pathname}?${query}` : pathname;
	};

	const handleLogout = async () => {
		await signOut({ redirect: false });
		router.push("/");
		router.refresh();
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
					<div className="hidden md:flex ml-2 items-center gap-3 text-white text-[12px]">
						{status === "authenticated" ? (
							<span className="text-white uppercase cursor-pointer text-[12px] lg:text-[13px] mr-3 md:mr-5">
								<Link href="/admin" className={`hover:custom-hover ${currentRoute === "/admin" ? "custom-underline" : ""}`}>
									{translations("nav.admin")}
								</Link>
								<Button
									variant="ghost"
									onClick={handleLogout}
									className="text-white cursor-pointer text-[12px] lg:text-[13px]"
								>
									{translations("nav.logout")}
								</Button>
							</span>
						) : (
							<span className="text-white uppercase cursor-pointer text-[12px] lg:text-[13px] mr-3 md:mr-5 lg:mr-8">
								<Link
									href={buildHrefWithLang("/login", currentLang)}
									className={`hover:custom-hover ${currentRoute === "/login" ? "custom-underline" : ""}`}
								>
									{translations("nav.login")}
								</Link>
							</span>
						)}
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
							} p-6 text-white bg-black absolute top-20 right-0 md:mx-4 md:my-2 min-w-[100%] sidebar flex flex-col`}
						>
							<ul className="list-none flex justify-end items-start flex-1 flex-col pb-4">
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
							<div className="mt-auto pt-4 text-[14px] border-t border-white space-y-3">
								{status === "authenticated" ? (
									<>
										<Link href="/admin" className="block uppercase mb-2">
											{translations("nav.admin")}
										</Link>
										<button onClick={handleLogout} className="block uppercase text-left">
											{translations("nav.logout")}
										</button>
									</>
								) : (
									<Link href={buildHrefWithLang("/login", currentLang)} className="block uppercase mb-2">
										{translations("nav.login")}
									</Link>
								)}
								<div>
									<a
										href={buildHrefWithLang(currentRoute || "/", "en-US")}
										className={`uppercase mr-2 ${
											currentLang === "en-US" ? "font-bold text-brown hover:cursor-pointer" : "opacity-80"
										}`}
									>
										EN
									</a>
									<span className="mr-2">|</span>

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
			</div>
		</nav>
	);
}

export default function Navbar() {
	return (
		<Suspense
			fallback={
				<nav className="w-full flex py-6 justify-between items-center navbar nav-show" id="navbar">
					<div className="container mx-auto">
						<div className="flex">
							<div className="logo">
								<Link href="/" className="flex">
									<Image src={logo} alt="logo" width="50" height="35" />
									<span className="text-white ml-2 text-[20px]">Compounds Coffee</span>
								</Link>
							</div>
						</div>
					</div>
				</nav>
			}
		>
			<NavbarContent />
		</Suspense>
	);
}
