"use client";

import { useSearchParams } from "next/navigation";
import { getT } from "@/lib/i18n";

export function useTranslations() {
	const params = useSearchParams();
	const lang = params.get("lang") || "en-US";
	const translations = getT(lang);
	return { translations, lang };
}
