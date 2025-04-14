import React from "react";
import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { VurderVirksomhetKnapp } from "./VurderVirksomhetKnapp";
import styled from "styled-components";
import NesteSteg from "./NesteSteg";
import KnappForHendelse from "./KnappForHendelse";
import { Virksomhet } from "../../../../../domenetyper/virksomhet";
import { useHentBrukerinformasjon } from "../../../../../api/lydia-api/bruker";
import { opprettSak } from "../../../../../api/lydia-api/sak";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";
import { RolleEnum } from "../../../../../domenetyper/brukerinformasjon";
import { knappeTypeFraSakshendelsesType } from "./knappeTypeFraSakshendelsesType";
import { useErPåAktivSak } from "../../../VirksomhetContext";

const Statuscontainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Knappecontainer = styled.div<{ $redusertPadding: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => (props.$redusertPadding ? "0.5rem" : "1.5rem")};
    flex-wrap: wrap;
`;

const EnkeltKnappContainer = styled(Knappecontainer)`
    justify-content: end;
`;

const Innerknappecontainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export type StatusHendelseSteg =
    | "FULLFØR_SAMARBEID"
    | "FULLFØR_KARTLEGGINGER"
    | "FULLFØR_SAMARBEIDSPLAN"
    | "BEGRUNNELSE"
    | "BEKREFT";

interface StatusknapperProps {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    setModalOpen: (modalOpen: boolean) => void;
    setNesteSteg: (n: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }) => void;
    nesteSteg: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    };
    onStatusEndret: () => void;
    redusertPadding?: boolean;
    loading?: boolean;
    setNyttSamarbeidModalÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Statusknapper({
    virksomhet,
    iaSak,
    setModalOpen,
    setNesteSteg,
    nesteSteg,
    onStatusEndret,
    redusertPadding = false,
    loading: eksternLoading,
    setNyttSamarbeidModalÅpen,
}: StatusknapperProps) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const [loading, setLoading] = React.useState(false);
    const erPåAktivSak = useErPåAktivSak();


    if (iaSak === undefined) {
        return (
            brukerInformasjon?.rolle === RolleEnum.enum.Superbruker && (
                <Statuscontainer>
                    <EnkeltKnappContainer $redusertPadding={redusertPadding}>
                        <VurderVirksomhetKnapp
                            onClick={() => {
                                setLoading(true);
                                opprettSak(virksomhet.orgnr).then(() => {
                                    onStatusEndret();
                                    setLoading(false);
                                });
                                loggStatusendringPåSak(
                                    IASakshendelseTypeEnum.enum
                                        .VIRKSOMHET_VURDERES,
                                    IAProsessStatusEnum.enum.NY,
                                );
                            }}
                            loading={loading || eksternLoading}
                        />
                    </EnkeltKnappContainer>
                </Statuscontainer>
            )
        );
    }

    if (!erPåAktivSak) {
        return null;
    }

    const erHendelsenDestruktiv = (hendelsesType: IASakshendelseType) =>
        knappeTypeFraSakshendelsesType(hendelsesType) === "danger";

    const hendelser: GyldigNesteHendelse[] = iaSak.gyldigeNesteHendelser.filter(
        (hendelse) =>
            hendelse.saksHendelsestype !==
                IASakshendelseTypeEnum.Enum.ENDRE_PROSESS &&
            hendelse.saksHendelsestype !==
                IASakshendelseTypeEnum.Enum.NY_PROSESS,
    );
    const destruktiveHendelser = hendelser.filter((hendelse) =>
        erHendelsenDestruktiv(hendelse.saksHendelsestype),
    );
    const ikkeDestruktiveHendelser = hendelser
        .filter(
            (hendelse) => !erHendelsenDestruktiv(hendelse.saksHendelsestype),
        )
        .sort((a) => (a.saksHendelsestype === "TILBAKE" ? -1 : 1));

    return (
        <Statuscontainer>
            <Knappecontainer $redusertPadding={redusertPadding}>
                {destruktiveHendelser.map((hendelse, index) => (
                    <KnappForHendelse
                        key={index}
                        hendelse={hendelse}
                        sak={iaSak}
                        nesteSteg={nesteSteg.nesteSteg}
                        setNesteSteg={setNesteSteg}
                        variant={"danger"}
                        onStatusEndret={onStatusEndret}
                        loading={loading || eksternLoading}
                    />
                ))}
                <Innerknappecontainer>
                    {ikkeDestruktiveHendelser.map((hendelse, index) => (
                        <KnappForHendelse
                            key={index}
                            hendelse={hendelse}
                            sak={iaSak}
                            nesteSteg={nesteSteg.nesteSteg}
                            setNesteSteg={setNesteSteg}
                            variant={
                                index === ikkeDestruktiveHendelser.length - 1
                                    ? "primary"
                                    : "secondary"
                            }
                            onStatusEndret={onStatusEndret}
                            loading={loading || eksternLoading}
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
                clearNesteSteg={() =>
                    setNesteSteg({ nesteSteg: null, hendelse: null })
                }
                sak={iaSak}
                setNyttSamarbeidModalÅpen={setNyttSamarbeidModalÅpen}
            />
        </Statuscontainer>
    );
}
