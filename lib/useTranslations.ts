"use client";

import { useSearchParams } from "next/navigation";
import { getTranslations } from "@/lib/i18n";

export function useTranslations() {
	const params = useSearchParams();
	const lang = params.get("lang") || "en-US";
	const translations = getTranslations(lang);
	return { translations, lang };
}
