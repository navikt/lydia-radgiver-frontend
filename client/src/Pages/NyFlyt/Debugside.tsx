import { VStack } from "@navikt/ds-react";
import { useParams } from "react-router-dom";
import Oversikt, { useOversiktMutate } from "./Oversikt";
import {
	VurderSak,
	AngreVurdering,
	FullførVurdering,
	OpprettSamarbeid,
	OpprettKartlegging,
	StartKartlegging,
	FullførKartlegging,
	OpprettSamarbeidsplan,
	AvsluttSamarbeid,
} from "./Post";
import {
	SlettKartlegging,
	SlettSamarbeidsplan,
	SlettSamarbeid,
} from "./Delete";

function DebugContent({ orgnummer }: { orgnummer: string }) {
	const mutate = useOversiktMutate(orgnummer);

	const handleSuccess = () => {
		mutate();
	};

	return (
		<VStack>
			<Oversikt orgnummer={orgnummer} />

			<h2>POST Endpoints</h2>
			<VurderSak orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<AngreVurdering orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<FullførVurdering orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<OpprettSamarbeid orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<OpprettKartlegging orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<StartKartlegging orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<FullførKartlegging orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<OpprettSamarbeidsplan orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<AvsluttSamarbeid orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />

			<h2>DELETE Endpoints</h2>
			<SlettKartlegging orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<SlettSamarbeidsplan orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
			<SlettSamarbeid orgnummer={orgnummer} onSuccess={handleSuccess} />
			<hr />
		</VStack>
	);
}

export default function Debugside() {
	const { id } = useParams<{ id: string }>();

	if (!id) {
		return <div>Ingen ID oppgitt i URL</div>;
	}

	return <DebugContent orgnummer={id} />;
}