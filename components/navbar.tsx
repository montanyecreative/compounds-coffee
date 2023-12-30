import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const logo = "/logo.webp";
const open = "/hamburger-menu.svg";
const close = "/cross-1.svg";

export const navLinks = [
	{
		id: 1,
		title: "Brew Log",
		link: "brew-log",
	},
	{
		id: 2,
		title: "Favorite Coffees",
		link: "favorite-coffees",
	},
	{
		id: 5,
		title: "Contact",
		link: "contact",
	},
];

export default function Navbar() {
	const [active, setActive] = useState("Home");
	const [toggle, setToggle] = useState(false);
	const currentRoute = usePathname();

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
							<Image src={logo} alt="logo" width="40" height="25" />
							<span className="text-white ml-2 text-[20px]">Compounds Coffee</span>
						</Link>
					</div>

					<ul className="list-none sm:flex hidden justify-end flex-1 items-center">
						{navLinks.map((nav, index) => (
							<li
								key={nav.id}
								className="text-white uppercase cursor-pointer text-[12px] lg:text-[13px] mr-3 md:mr-5 lg:mr-8"
								onClick={() => setActive(nav.title)}
							>
								<a
									className={`hover:custom-hover ${currentRoute === "/" + nav.link ? "custom-underline" : ""}`}
									href={`/${nav.link}`}
								>
									{nav.title}
								</a>
							</li>
						))}
					</ul>
					<div className="sm:hidden flex flex-1 justify-end items-center">
						<Image
							src={toggle ? close : open}
							alt="menu"
							className="w-[28px] h-[28px] object-contain"
							onClick={() => setToggle(!toggle)}
							height={28}
							width={28}
						/>

						<div
							className={`${
								!toggle ? "hidden" : "flex"
							} p-6 text-white bg-mediumRoast absolute top-20 right-0 md:mx-4 md:my-2 min-w-[100%] sidebar`}
						>
							<ul className="list-none flex justify-end items-start flex-1 flex-col">
								{navLinks.map((nav, index) => (
									<li
										key={nav.id}
										className={`font-medium cursor-pointer text-[18px] ${
											index === navLinks.length - 1 ? "mb-0" : "mb-4"
										}`}
										onClick={() => setActive(nav.title)}
									>
										<a href={`/${nav.link}`}>{nav.title}</a>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
