import {
    BodyLong,
    Button,
    ConfirmationPanel,
    Heading,
    Modal,
} from "@navikt/ds-react";
import React, { useState } from "react";
import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IASak,
    IASakshendelseTypeEnum,
} from "../../../../../../domenetyper/domenetyper";
import {
    useHentSakForVirksomhet,
    useHentSakshistorikk,
} from "../../../../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../../../../api/lydia-api/sak";
import { loggStatusendringPåSak } from "../../../../../../util/analytics-klient";
import { StatusHendelseSteg } from "../Statusknapper";
import { penskrivIAStatus } from "../../../../../../components/Badge/IAProsessStatusBadge";
import { PlusIcon } from "@navikt/aksel-icons";
import { useHentSamarbeid } from "../../../../../../api/lydia-api/spørreundersøkelse";
import { useHentBrukerinformasjon } from "../../../../../../api/lydia-api/bruker";
import { FullførKartleggingerFørstSeksjon } from "./FullførKartleggingerFørstSeksjon";
import { BegrunnelseFørstSeksjon } from "./BegrunnelseFørstSeksjon";
import { FullførSamarbeidFørstSeksjon } from "./FullførSamarbeidFørstSeksjon";
import styles from "../endrestatusmodal.module.scss";
import { NyttSamarbeidModal } from "../../../../Samarbeid/NyttSamarbeidModal";
import { useVirksomhetContext } from "../../../../VirksomhetContext";

export const Knappecontainer = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className={`${styles.knappeContainer} ${className}`} />
);

export default function NesteSteg({
    nesteSteg,
    lukkModal,
    sak,
    clearNesteSteg,
}: {
    nesteSteg: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    };
    lukkModal: () => void;
    clearNesteSteg: () => void;
    sak: IASak;
}) {
    const { data: alleSamarbeid } = useHentSamarbeid(sak.orgnr, sak.saksnummer);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = sak?.eidAv === brukerInformasjon?.ident;

    switch (nesteSteg.nesteSteg) {
        case "FULLFØR_SAMARBEID":
            return (
                <FullførSamarbeidFørstSeksjon
                    lukkModal={lukkModal}
                    clearNesteSteg={clearNesteSteg}
                    alleSamarbeid={alleSamarbeid}
                />
            );
        case "FULLFØR_KARTLEGGINGER":
            return (
                <FullførKartleggingerFørstSeksjon
                    lukkModal={lukkModal}
                    clearNesteSteg={clearNesteSteg}
                    alleSamarbeid={alleSamarbeid}
                    sak={sak}
                />
            );
        case "FULLFØR_SAMARBEIDSPLAN":
            return (
                <FullførSamarbeidsplanFørstSeksjon
                    clearNesteSteg={clearNesteSteg}
                />
            );
        case "BEGRUNNELSE":
            return (
                <BegrunnelseFørstSeksjon
                    lukkModal={lukkModal}
                    hendelse={nesteSteg.hendelse}
                    sak={sak}
                    clearNesteSteg={clearNesteSteg}
                />
            );
        case "BEKREFT":
            return (
                <BekreftelsesSeksjon
                    lukkModal={lukkModal}
                    hendelse={nesteSteg.hendelse}
                    sak={sak}
                    clearNesteSteg={clearNesteSteg}
                />
            );
        case null:
            if (
                alleSamarbeid?.length === 0 &&
                brukerErEierAvSak &&
                sak.status === IAProsessStatusEnum.enum.KARTLEGGES
            ) {
                return <OpprettSamarbeidFørstSeksjon />;
            }
            return null;
        default:
            return null;
    }
}

function OpprettSamarbeidFørstSeksjon() {
    const { virksomhet, iaSak } = useVirksomhetContext();
    const [nyttSamarbeidModalÅpen, setNyttSamarbeidModalÅpen] = useState(false);

    return (
        <div className={styles.underseksjon}>
            <Heading level="2" size="medium">
                Opprett samarbeid
            </Heading>
            <BodyLong>
                Du kan nå opprette samarbeid for å gjennomføre behovsvurdering,
                lage samarbeidsplan og evaluere.
            </BodyLong>
            <br />
            <Knappecontainer>
                <Button
                    icon={<PlusIcon fontSize={"1.5rem"} />}
                    variant="primary"
                    onClick={() => setNyttSamarbeidModalÅpen(true)}
                    title={"Opprett samarbeid"}
                >
                    Opprett samarbeid
                </Button>
            </Knappecontainer>
            {iaSak && virksomhet && (
                <NyttSamarbeidModal
                    iaSak={iaSak}
                    virksomhet={virksomhet}
                    åpen={nyttSamarbeidModalÅpen}
                    setÅpen={setNyttSamarbeidModalÅpen}
                />
            )}
        </div>
    );
}

function FullførSamarbeidsplanFørstSeksjon({
    clearNesteSteg,
}: {
    clearNesteSteg: () => void;
}) {
    return (
        <Modal.Body>
            <Heading level="2" size="medium">
                Saken har ingen fullførte samarbeidsplaner
            </Heading>
            <BodyLong>
                For å gå videre må du fullføre samarbeidsplanen. Hvis en
                behovsvurdering ikke skal eller kan gjennomføres likevel må du
                slette den før du kan gå videre.
            </BodyLong>
            <br />
            <Knappecontainer>
                <Button variant="secondary" onClick={clearNesteSteg}>
                    Den er grei
                </Button>
            </Knappecontainer>
        </Modal.Body>
    );
}

export const hentÅrsakFraÅrsakType = (
    type: string,
    { gyldigeÅrsaker }: GyldigNesteHendelse,
) => {
    return gyldigeÅrsaker.find((årsak) => årsak.type === type);
};

function BekreftelsesSeksjon({
    lukkModal,
    hendelse,
    sak,
    clearNesteSteg,
}: {
    lukkModal: () => void;
    hendelse: GyldigNesteHendelse | null;
    sak: IASak;
    clearNesteSteg: () => void;
}) {
    const { mutate: mutateSamarbeidshistorikk } = useHentSakshistorikk(
        sak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentSakForVirksomhet(
        sak.orgnr,
        sak.saksnummer,
    );

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.();
        mutateSamarbeidshistorikk?.();
    };

    if (!hendelse) {
        return <></>;
    }

    const onConfirm = () => {
        nyHendelsePåSak(sak, hendelse)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .finally(() => {
                loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status);
                lukkModal();
            });
    };

    const tekst = modalTekstForHendelse({ hendelse, sak });
    const [bekreftet, setBekreftet] = useState(
        hendelse.saksHendelsestype !== "FULLFØR_BISTAND",
    );

    return (
        <Modal.Body>
            <Heading level="2" size="medium">
                {tekst.tittel}
            </Heading>
            <BekreftelsesInnhold
                sak={sak}
                hendelse={hendelse}
                bekreftet={bekreftet}
                setBekreftet={setBekreftet}
                tekst={tekst}
            />
            <br />
            <Knappecontainer>
                <Button variant="secondary" onClick={clearNesteSteg}>
                    Avbryt
                </Button>
                <Button
                    variant="primary"
                    onClick={onConfirm}
                    disabled={!bekreftet}
                >
                    {tekst.bekreftendeTekst || "Ja"}
                </Button>
            </Knappecontainer>
        </Modal.Body>
    );
}

function BekreftelsesInnhold({
    sak,
    hendelse,
    bekreftet,
    setBekreftet,
    tekst,
}: {
    sak: IASak;
    hendelse: GyldigNesteHendelse;
    bekreftet: boolean;
    setBekreftet: (a: boolean) => void;
    tekst: ModalTekst;
}) {
    if (hendelse.saksHendelsestype === "FULLFØR_BISTAND") {
        const { data } = useHentSamarbeid(sak.orgnr, sak.saksnummer);
        return (
            <ConfirmationPanel
                checked={bekreftet}
                onChange={() => setBekreftet(!bekreftet)}
                label="Jeg bekrefter at saken skal fullføres"
            >
                <BodyLong>
                    {tekst.beskrivelse}
                    <ul>
                        {data &&
                            data.map((samarbeid) => {
                                return (
                                    <li key={samarbeid.id}>{samarbeid.navn}</li>
                                );
                            })}
                    </ul>
                </BodyLong>
            </ConfirmationPanel>
        );
    }
    return <BodyLong>{tekst.beskrivelse}</BodyLong>;
}

const DEFAULT_TITTEL_FOR_MODAL = "Er du sikker på at du vil gjøre dette?";

interface ModalTekst {
    tittel: string;
    beskrivelse?: string;
    bekreftendeTekst?: string;
}

interface ModalTekstForHendelseProps {
    hendelse: GyldigNesteHendelse | null;
    sak: IASak;
}

const modalTekstForHendelse = ({
    hendelse,
    sak,
}: ModalTekstForHendelseProps): ModalTekst => {
    if (!hendelse)
        return {
            tittel: DEFAULT_TITTEL_FOR_MODAL,
            beskrivelse: "",
        };

    switch (hendelse.saksHendelsestype) {
        case "FULLFØR_BISTAND":
            return {
                tittel: "Er du sikker på at du vil fullføre?",
                beskrivelse: "Dette vil lukke saken og følgende samarbeid:",
                bekreftendeTekst: "Fullfør",
            };
        case "TILBAKE": {
            if (sak.status === IAProsessStatusEnum.enum.FULLFØRT) {
                return {
                    tittel: "Er du sikker på at du vil gjenåpne saken?",
                    beskrivelse: `Dette setter saken tilbake til "${penskrivIAStatus(IAProsessStatusEnum.enum.VI_BISTÅR)}"`,
                };
            }
            if (sak.status === IAProsessStatusEnum.enum.IKKE_AKTUELL) {
                return {
                    tittel: "Er du sikker på at du vil gjenåpne saken?",
                    beskrivelse:
                        "Dette setter saken tilbake til forrige status.",
                };
            }
            return {
                tittel: "Er du sikker på at du vil gå tilbake?",
                beskrivelse: "Dette setter saken tilbake til forrige status.",
            };
        }
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            if (sak.eidAv === null) {
                return {
                    tittel: "Ønsker du å ta eierskap til saken?",
                };
            }
            return {
                tittel: "Ønsker du å ta eierskap til saken?",
                beskrivelse: "Nåværende eier blir automatisk fjernet.",
            };
        default:
            return {
                tittel: DEFAULT_TITTEL_FOR_MODAL,
                beskrivelse: "",
            };
    }
};
