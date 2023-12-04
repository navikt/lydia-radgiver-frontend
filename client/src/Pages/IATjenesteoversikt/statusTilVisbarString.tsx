export function statusTilVisbarString(status: string) {
	switch (status) {
		case "UNDER_ARBEID":
			return "Under arbeid";
		case "LEVERT":
			return "Levert";
		default:
			return status;
	}
}
