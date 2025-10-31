import en from "@/locales/en-US.json";
import fr from "@/locales/fr-CA.json";

export type SupportedLang = "en-US" | "fr-CA";

const dictionaries: Record<SupportedLang, Record<string, any>> = {
	en: en as any,
	"en-US": en as any,
	"fr-CA": fr as any,
} as unknown as Record<SupportedLang, Record<string, any>>;

const DEFAULT_LANG: SupportedLang = "en-US";

function getFromPath(obj: any, path: string): any {
	return path.split(".").reduce((acc: any, key: string) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function getT(lang?: string) {
	const selected = (lang as SupportedLang) || DEFAULT_LANG;
	const dict = dictionaries[selected] || dictionaries[DEFAULT_LANG];
	const fallback = dictionaries[DEFAULT_LANG];

	return function translations(key: string): string {
		const value = getFromPath(dict, key);
		if (typeof value === "string") return value;
		const fb = getFromPath(fallback, key);
		if (typeof fb === "string") return fb;
		return key; // last-resort: surface the key to spot missing translations
	};
}
