export default function capitalizeFirstLetterLowercaseRest(tekst: string) {
	return tekst.charAt(0).toUpperCase() + tekst.slice(1).toLowerCase();
};