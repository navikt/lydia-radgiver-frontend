import { EventData } from "./FeilmeldingBanner";


export const dispatchFeilmelding = (data: EventData) => {
	document.dispatchEvent(
		new CustomEvent("feilmeldingFraBackend", {
			detail: data,
		})
	);
};
