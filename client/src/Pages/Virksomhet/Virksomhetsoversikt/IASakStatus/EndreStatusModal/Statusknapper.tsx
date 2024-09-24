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
import {
    opprettSak,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentSamarbeidshistorikk,
} from "../../../../../api/lydia-api";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";
import { RolleEnum } from "../../../../../domenetyper/brukerinformasjon";
import { knappeTypeFraSakshendelsesType } from "./knappeTypeFraSakshendelsesType";

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

const EnkeltKnappContainer = styled(Knappecontainer)`
    justify-content: end;
`;

const Innerknappecontainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export type StatusHendelseSteg =
    | "FULLFØR_LEVERANSE"
    | "FULLFØR_KARTLEGGINGER"
    | "BEGRUNNELSE"
    | "LEGG_TIL_LEVERANSE"
    | "BEKREFT";

export function Statusknapper({
    virksomhet,
    iaSak,
    setModalOpen,
    setVisKonfetti,
    setNesteSteg,
    nesteSteg,
    onStatusEndret,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    setModalOpen: (modalOpen: boolean) => void;
    setVisKonfetti?: (visKonfetti: boolean) => void;
    setNesteSteg: (n: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }) => void;
    nesteSteg: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    };
    onStatusEndret: (status: IASak["status"]) => void;
}) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(
        virksomhet.orgnr,
    );
    const { mutate: mutateAktivSak } = useHentAktivSakForVirksomhet(
        virksomhet.orgnr,
    );

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateAktivSak?.();
        mutateSamarbeidshistorikk?.();
    };

    if (iaSak === undefined) {
        return (
            brukerInformasjon?.rolle === RolleEnum.enum.Superbruker && (
                <Statuscontainer>
                    <EnkeltKnappContainer>
                        <VurderVirksomhetKnapp
                            onClick={() => {
                                opprettSak(virksomhet.orgnr).then(() =>
                                    mutateIASakerOgSamarbeidshistorikk(),
                                );
                                loggStatusendringPåSak(
                                    IASakshendelseTypeEnum.enum
                                        .VIRKSOMHET_VURDERES,
                                    IAProsessStatusEnum.enum.NY,
                                );
                            }}
                        />
                    </EnkeltKnappContainer>
                </Statuscontainer>
            )
        );
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
            <Knappecontainer>
                {destruktiveHendelser.map((hendelse, index) => (
                    <KnappForHendelse
                        key={index}
                        hendelse={hendelse}
                        sak={iaSak}
                        nesteSteg={nesteSteg.nesteSteg}
                        setNesteSteg={setNesteSteg}
                        variant={"danger"}
                        onStatusEndret={onStatusEndret}
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
                setVisKonfetti={setVisKonfetti}
            />
        </Statuscontainer>
    );
}
