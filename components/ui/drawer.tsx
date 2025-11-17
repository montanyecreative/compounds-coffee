"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<>
			{/* Overlay */}
			<div
				className={cn(
					"fixed inset-0 z-[1000] bg-black/50 transition-opacity duration-300",
					open ? "opacity-100" : "opacity-0 pointer-events-none"
				)}
				onClick={() => onOpenChange(false)}
			/>
			{/* Drawer */}
			<div
				className={cn(
					"fixed left-0 top-0 z-[1001] h-screen w-full max-w-md bg-white shadow-2xl border-r border-gray-200 transition-transform duration-300 ease-in-out",
					open ? "translate-x-0" : "-translate-x-full"
				)}
			>
				{children}
			</div>
		</>
	);
}

interface DrawerContentProps {
	children: React.ReactNode;
	onClose: () => void;
	title?: string;
	isOpen?: boolean;
}

export function DrawerContent({ children, onClose, title, isOpen }: DrawerContentProps) {
	const contentRef = React.useRef<HTMLDivElement>(null);

	// Reset scroll position when drawer opens
	React.useEffect(() => {
		if (isOpen && contentRef.current) {
			contentRef.current.scrollTop = 0;
		}
	}, [isOpen]);

	return (
		<div className="flex h-full flex-col bg-white overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 flex-shrink-0">
				{title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
				<button
					onClick={onClose}
					className="rounded-sm p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brown focus:ring-offset-2"
					aria-label="Close drawer"
				>
					<X className="h-5 w-5" />
					<span className="sr-only">Close</span>
				</button>
			</div>
			{/* Content */}
			<div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto px-6 pt-6 pb-6 bg-white">
				{children}
			</div>
		</div>
	);
}
