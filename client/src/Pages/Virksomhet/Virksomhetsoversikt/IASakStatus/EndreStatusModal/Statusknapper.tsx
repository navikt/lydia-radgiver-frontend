import React from "react";
import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import { erHendelsenDestruktiv } from "../EndreStatusKnappar/IASakshendelseKnapp";
import styled from "styled-components";
import NesteSteg from "./NesteSteg";
import KnappForHendelse from "./KnappForHendelse";

const Statuscontainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const Knappecontainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem;
`;

const Innerknappecontainer = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`;

export type StatusHendelseSteg = "FULLFØR_LEVERANSE" | "FULLFØR_KARTLEGGINGER" | "BEGRUNNELSE" | "LEGG_TIL_LEVERANSE" | "BEKREFT";

export function Statusknapper(
	{
		hendelser,
		sak,
		setModalOpen,
		setVisKonfetti,
		setNesteSteg,
		nesteSteg,
	}: {
		hendelser: GyldigNesteHendelse[];
		sak: IASak;
		setModalOpen: (modalOpen: boolean) => void;
		setVisKonfetti?: (visKonfetti: boolean) => void;
		setNesteSteg: (n: { nesteSteg: StatusHendelseSteg | null, hendelse: GyldigNesteHendelse | null }) => void;
		nesteSteg: { nesteSteg: StatusHendelseSteg | null, hendelse: GyldigNesteHendelse | null };
	}) {
	const destruktiveHendelser = hendelser
		.filter(hendelse => erHendelsenDestruktiv(hendelse.saksHendelsestype));
	const ikkeDestruktiveHendelser = hendelser
		.filter(hendelse => !erHendelsenDestruktiv(hendelse.saksHendelsestype)).sort((a) => a.saksHendelsestype === "TILBAKE" ? -1 : 1);

	return (
		<Statuscontainer>
			<Knappecontainer>
				{destruktiveHendelser.map((hendelse, index) => (
					<KnappForHendelse
						key={index}
						hendelse={hendelse}
						sak={sak}
						setVisKonfetti={setVisKonfetti}
						nesteSteg={nesteSteg.nesteSteg}
						setNesteSteg={setNesteSteg}
						variant="primary-neutral"
					/>
				))}
				<Innerknappecontainer>
					{ikkeDestruktiveHendelser.map((hendelse, index) => (
						<KnappForHendelse
							key={index}
							hendelse={hendelse}
							sak={sak}
							setVisKonfetti={setVisKonfetti}
							nesteSteg={nesteSteg.nesteSteg}
							setNesteSteg={setNesteSteg}
							variant={index === ikkeDestruktiveHendelser.length - 1 ? "primary" : "secondary"}
						/>
					))}
				</Innerknappecontainer>
			</Knappecontainer>
			<NesteSteg
				nesteSteg={nesteSteg}
				lukkModal={() => {
					setModalOpen(false);
					setNesteSteg({ nesteSteg: null, hendelse: null });
				}}
				clearNesteSteg={() => setNesteSteg({ nesteSteg: null, hendelse: null })}
				sak={sak}
				setVisKonfetti={setVisKonfetti} />
		</Statuscontainer>
	);
}
