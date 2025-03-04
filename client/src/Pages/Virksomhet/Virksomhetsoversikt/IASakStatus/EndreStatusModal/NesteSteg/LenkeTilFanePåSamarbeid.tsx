import { Link } from "@navikt/ds-react";
import React from "react";
import { IaSakProsess } from "../../../../../../domenetyper/iaSakProsess";
import { NavLink, useParams } from "react-router-dom";


export default function LenkeTilFanePåSamarbeid({ samarbeidId, fane, children, onClick }: { samarbeidId: number, fane: string, children: React.ReactNode, onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined }) {
	const {
		orgnummer,
		saksnummer,
	} = useParams();
	return <Link as={NavLink} to={`/virksomhet/${orgnummer}/sak/${saksnummer}/samarbeid/${samarbeidId}?fane=${fane}`} onClick={onClick}>{children}</Link>;
}

function Samarbeidsnavn({ samarbeidId, alleSamarbeid }: { samarbeidId: number, alleSamarbeid: IaSakProsess[] | undefined }) {
	const samarbeid = alleSamarbeid?.find(s => s.id === samarbeidId);
	return samarbeid?.navn || "Ukjent samarbeid";
}

export function LenkeTilBehovsvurderingFane({ samarbeidId, alleSamarbeid, onClick }: { samarbeidId: number, alleSamarbeid: IaSakProsess[] | undefined, onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined }) {
	return (
		<LenkeTilFanePåSamarbeid samarbeidId={samarbeidId} fane="behovsvurdering" onClick={onClick}>
			<Samarbeidsnavn samarbeidId={samarbeidId} alleSamarbeid={alleSamarbeid} />
		</LenkeTilFanePåSamarbeid>
	);
}

export function LenkeTilEvalueringsFane({ samarbeidId, alleSamarbeid, onClick }: { samarbeidId: number, alleSamarbeid: IaSakProsess[] | undefined, onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined }) {
	return (
		<LenkeTilFanePåSamarbeid samarbeidId={samarbeidId} fane="evaluering" onClick={onClick}>
			<Samarbeidsnavn samarbeidId={samarbeidId} alleSamarbeid={alleSamarbeid} />
		</LenkeTilFanePåSamarbeid>
	);
}