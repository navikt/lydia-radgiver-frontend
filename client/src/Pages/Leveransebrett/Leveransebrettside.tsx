import { Heading } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { Leveransekort } from "./Leveransekort";
import { useMineLeveranser } from "../../api/lydia-api";

export const Leveransebrettside = () => {
	if (!erIDev) {
		return null;
	}

	const { data } = useMineLeveranser(); //TODO: håndtere error og loading for komponent

	return (
		<div>
			<Heading size="large">Leveranser på saker jeg eier</Heading>
			{
				data?.map((leveranse, index) => {
					return (
						<Leveransekort leveranse={leveranse} key={index} />
					);
				})
			}
		</div>
	);
}
