import styled from "styled-components";
import { useHentSamarbeidshistorikk } from "../../../../../api/lydia-api";
import { IASak } from "../../../../../domenetyper/domenetyper";
import { Sakshendelse } from "../../../../../domenetyper/sakshistorikk";
import { StatusBadge } from "../../../../../components/Badge/StatusBadge";
import { Detail, Loader } from "@navikt/ds-react";
import React from "react";
import { lokalDato } from "../../../../../util/dato";

export default function Historikk({ sak }: { sak: IASak }) {
    const { data: samarbeidshistorikk, loading: lasterSamarbeidshistorikk } =
        useHentSamarbeidshistorikk(sak.orgnr);
    const sakshendelser = samarbeidshistorikk?.find(
        (historikk) => historikk.saksnummer === sak.saksnummer,
    )?.sakshendelser;

    if (lasterSamarbeidshistorikk || !sakshendelser) {
        return <Loader title="Laster samarbeidshistorikk" />;
    }

    return <Sakshendelser sakshendelser={sakshendelser} />;
}

const SakshendelseContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    gap: 1rem;
    width: 100%;
`;

function Sakshendelser({ sakshendelser }: { sakshendelser: Sakshendelse[] }) {
    const skjulteSakshendelser = [
        "ENDRE_PROSESS",
        "NY_PROSESS",
        "TA_EIERSKAP_I_SAK",
        "SLETT_PROSESS",
    ];
    return (
        <SakshendelseContainer>
            {sakshendelser
                .filter(
                    (sakshendelse) =>
                        !skjulteSakshendelser.includes(
                            sakshendelse.hendelsestype,
                        ),
                )
                .map((sakshendelse, index) => (
                    <React.Fragment key={index}>
                        <StatusBadge status={sakshendelse.status} />
                        <HendelseDetaljer sakshendelse={sakshendelse} />
                        <Sakshendelsedatoer
                            sakshendelse={sakshendelse}
                            nesteSakshendelse={sakshendelser[index + 1]}
                        />
                    </React.Fragment>
                ))}
        </SakshendelseContainer>
    );
}

function HendelseDetaljer({ sakshendelse }: { sakshendelse: Sakshendelse }) {
    return (
        <span>
            {sakshendelse.begrunnelser.length > 0 && (
                <>
                    <Detail>Begrunnelse</Detail>
                    <ul>
                        {sakshendelse.begrunnelser.map((begrunnelse) => (
                            <li key={begrunnelse}>
                                <Detail>{begrunnelse}</Detail>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {sakshendelse.hendelsestype === "TA_EIERSKAP_I_SAK" && (
                <Detail>Tok eierskap i sak</Detail>
            )}
            {sakshendelse.hendelsestype === "ENDRE_PROSESS" && (
                <Detail>Endret samarbeidsnavn</Detail>
            )}
            {sakshendelse.hendelsestype === "NY_PROSESS" && (
                <Detail>Nytt samarbeid</Detail>
            )}
        </span>
    );
}

function Sakshendelsedatoer({
    sakshendelse,
    nesteSakshendelse,
}: {
    sakshendelse: Sakshendelse;
    nesteSakshendelse?: Sakshendelse;
}) {
    return (
        <div>
            {lokalDato(sakshendelse.tidspunktForSnapshot)}
            {" - "}
            {nesteSakshendelse &&
                lokalDato(nesteSakshendelse.tidspunktForSnapshot)}
        </div>
    );
}
