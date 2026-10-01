import type { ShippingCountryCode } from "@utils/shippingCountries";

export const SHIPPING_CONTINENT_CODES = [
  "africa", "asia", "europe", "north_america", "oceania", "south_america",
] as const;

export type ShippingContinent = typeof SHIPPING_CONTINENT_CODES[number];

export const SHIPPING_CONTINENTS = [
  { code: "africa", label: "Africa" },
  { code: "asia", label: "Asia" },
  { code: "europe", label: "Europe" },
  { code: "north_america", label: "North America" },
  { code: "oceania", label: "Australia and Oceania" },
  { code: "south_america", label: "South America" },
] as const;

const countryCodesByContinent: Record<ShippingContinent, string> = {
  africa: "AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW KE KM LR LS LY MA MG ML MR MU MW MZ NA NE NG RE RW SC SD SH SL SN SO SS ST SZ TD TF TG TN TZ UG YT ZA ZM ZW",
  asia: "AE AF AM AZ BD BH BN BT CN GE HK ID IL IN IO IQ IR JO JP KG KH KP KR KW KZ LA LB LK MM MN MO MV MY NP OM PH PK PS QA SA SG SY TH TJ TL TM TW UZ VN YE",
  europe: "AD AL AT AX BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM TR UA VA XK",
  north_america: "AG AI AW BB BL BM BQ BS BZ CA CC CR CU CW DM DO GD GL GP GT HN HT JM KN KY LC MF MQ MS MX NI PA PM PR SV SX TC TT US VC VG VI",
  oceania: "AS AU CK CX FJ FM GU HM KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TO TV UM VU WF WS",
  south_america: "AR BO BR BV CL CO EC FK GF GS GY PE PY SR UY VE",
};

const countryToContinent = new Map<string, ShippingContinent>();
for (const code of SHIPPING_CONTINENT_CODES) {
  for (const countryCode of countryCodesByContinent[code].split(" ")) {
    countryToContinent.set(countryCode, code);
  }
}

export function getShippingContinent(country: ShippingCountryCode): ShippingContinent | null {
  return countryToContinent.get(country) || null;
}
