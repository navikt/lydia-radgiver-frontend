import {
    Alert,
    BodyLong,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    ConfirmationPanel,
    Heading,
    Modal,
    Select,
} from "@navikt/ds-react";
import React, { useState } from "react";
import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IASak,
    IASakshendelseTypeEnum,
    ValgtÅrsakDto,
    Årsak,
} from "../../../../../domenetyper/domenetyper";
import styled from "styled-components";
import { useHentSamarbeidshistorikk } from "../../../../../api/lydia-api/virksomhet";
import { useHentAktivSakForVirksomhet } from "../../../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../../../api/lydia-api/sak";
import {
    loggSendBrukerTilIATjenesterTab,
    loggSendBrukerTilKartleggingerTab,
    loggStatusendringPåSak,
} from "../../../../../util/amplitude-klient";
import { useSendTilIATjenesterTab } from "../../../../../util/useSendTilIATjenesterTab";
import { useSendTilKartleggingerTab } from "../../../../../util/useSendTilKartleggingerTab";
import { StatusHendelseSteg } from "./Statusknapper";
import { penskrivIAStatus } from "../../../../../components/Badge/StatusBadge";

const Knappecontainer = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    align-items: center;
`;

export default function NesteSteg({
    nesteSteg,
    lukkModal,
    sak,
    setVisKonfetti,
    clearNesteSteg,
}: {
    nesteSteg: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    };
    lukkModal: () => void;
    clearNesteSteg: () => void;
    sak: IASak;
    setVisKonfetti?: (visKonfetti: boolean) => void;
}) {
    switch (nesteSteg.nesteSteg) {
        case "FULLFØR_LEVERANSE":
            return (
                <FullførLeveranserFørstSeksjon
                    lukkModal={lukkModal}
                    clearNesteSteg={clearNesteSteg}
                />
            );
        case "FULLFØR_KARTLEGGINGER":
            return (
                <FullførKartleggingerFørstSeksjon
                    lukkModal={lukkModal}
                    clearNesteSteg={clearNesteSteg}
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
                    setVisKonfetti={setVisKonfetti}
                    clearNesteSteg={clearNesteSteg}
                />
            );
        default:
            return <></>;
    }
}

function FullførLeveranserFørstSeksjon({
    lukkModal,
    clearNesteSteg,
}: {
    lukkModal: () => void;
    clearNesteSteg: () => void;
}) {
    const { sendBrukerTilIATjenesterTab } = useSendTilIATjenesterTab();

    return (
        <Modal.Body>
            <Heading level="2" size="medium">
                Saken har IA-tjenester som ikke er levert
            </Heading>
            <BodyLong>
                For å gå videre må du bekrefte at IA-tjenester er levert. Hvis
                en IA-tjeneste ikke skal utføres likevel må du slette den før du
                kan gå videre.
            </BodyLong>
            <br />
            <Knappecontainer>
                <Button variant="secondary" onClick={clearNesteSteg}>
                    Den er grei
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        sendBrukerTilIATjenesterTab();
                        loggSendBrukerTilIATjenesterTab("fullfør leveranser");
                        lukkModal();
                    }}
                >
                    Ta meg til IA-tjenester
                </Button>
            </Knappecontainer>
        </Modal.Body>
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

function FullførKartleggingerFørstSeksjon({
    lukkModal,
    clearNesteSteg,
}: {
    lukkModal: () => void;
    clearNesteSteg: () => void;
}) {
    const { sendBrukerTilKartleggingerTab } = useSendTilKartleggingerTab();

    return (
        <Modal.Body>
            <Heading level="2" size="medium">
                Saken har behovsvurderinger som ikke er fullført
            </Heading>
            <BodyLong>
                For å gå videre må du fullføre behovsvurderingene. Hvis en
                behovsvurdering ikke skal eller kan gjennomføres likevel må du
                slette den før du kan gå videre.
            </BodyLong>
            <br />
            <Knappecontainer>
                <Button variant="secondary" onClick={clearNesteSteg}>
                    Den er grei
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        sendBrukerTilKartleggingerTab();
                        loggSendBrukerTilKartleggingerTab(
                            "fullfør kartlegginger",
                        );
                        lukkModal();
                    }}
                >
                    Ta meg til kartleggings-fane
                </Button>
            </Knappecontainer>
        </Modal.Body>
    );
}

const hentÅrsakFraÅrsakType = (
    type: string,
    { gyldigeÅrsaker }: GyldigNesteHendelse,
) => {
    return gyldigeÅrsaker.find((årsak) => årsak.type === type);
};

function BegrunnelseFørstSeksjon({
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
    const [valgtÅrsak, setValgtÅrsak] = React.useState<Årsak | undefined>(
        () => {
            return hendelse?.gyldigeÅrsaker.length
                ? hendelse.gyldigeÅrsaker[0]
                : undefined;
        },
    );
    const [valgteBegrunnelser, setValgteBegrunnelser] = React.useState<
        string[]
    >([]);
    const [valideringsfeil, setValideringsfeil] = React.useState<string[]>([]);

    const begrunnelserCheckboxId = "begrunnelser-checkbox";

    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(
        sak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr);

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.();
        mutateSamarbeidshistorikk?.();
    };

    const lagreBegrunnelsePåSak = (valgtÅrsak: ValgtÅrsakDto) => {
        if (hendelse) {
            nyHendelsePåSak(sak, hendelse, valgtÅrsak)
                .then(mutateIASakerOgSamarbeidshistorikk)
                .finally(() => {
                    lukkModal();
                });
            loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status);
        }
    };

    if (!hendelse) {
        return <></>;
    }

    return (
        <Modal.Body>
            <Heading level="2" size="medium">
                Er du sikker på at du vil sette saken til &quot;Ikke
                aktuell&quot;?
            </Heading>
            <form onSubmit={(e) => e.preventDefault()}>
                <Select
                    label="Begrunnelse for at samarbeid ikke er aktuelt:"
                    onChange={(e) => {
                        setValgtÅrsak(
                            hentÅrsakFraÅrsakType(e.target.value, hendelse),
                        );
                        setValgteBegrunnelser([]);
                    }}
                    value={valgtÅrsak?.type}
                >
                    {hendelse.gyldigeÅrsaker.map((årsak) => (
                        <option key={årsak.type} value={årsak.type}>
                            {årsak.navn}
                        </option>
                    ))}
                </Select>
                <br />
                <CheckboxGroup
                    size="medium"
                    id={begrunnelserCheckboxId}
                    legend="Velg en eller flere begrunnelser"
                    hideLegend
                    value={valgteBegrunnelser}
                    onChange={(v) => {
                        setValgteBegrunnelser(v);
                        setValideringsfeil([]);
                    }}
                >
                    {valgtÅrsak?.begrunnelser.map((begrunnelse) => (
                        <Checkbox
                            value={begrunnelse.type}
                            key={begrunnelse.type}
                        >
                            {begrunnelse.navn}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
                {valideringsfeil.length > 0 && (
                    <Box
                        background={"bg-default"}
                        borderColor="border-danger"
                        padding="4"
                        borderWidth="2"
                        borderRadius="xlarge"
                    >
                        {valideringsfeil.map((feil) => (
                            <Alert key={feil} inline variant="error">
                                {feil}
                            </Alert>
                        ))}
                    </Box>
                )}
            </form>
            <Knappecontainer>
                <Button variant="secondary" onClick={clearNesteSteg}>
                    Avbryt
                </Button>
                <Button
                    onClick={() => {
                        if (!valgtÅrsak || valgteBegrunnelser.length == 0) {
                            if (
                                !valideringsfeil.includes(
                                    "Du må velge minst én begrunnelse",
                                )
                            ) {
                                setValideringsfeil([
                                    ...valideringsfeil,
                                    "Du må velge minst én begrunnelse",
                                ]);
                            }
                            return;
                        }
                        const valgtÅrsakDto: ValgtÅrsakDto = {
                            type: valgtÅrsak.type,
                            begrunnelser: valgteBegrunnelser,
                        };
                        lagreBegrunnelsePåSak(valgtÅrsakDto);
                        setValideringsfeil([]);
                    }}
                >
                    Lagre
                </Button>
            </Knappecontainer>
        </Modal.Body>
    );
}

function BekreftelsesSeksjon({
    lukkModal,
    hendelse,
    sak,
    setVisKonfetti,
    clearNesteSteg,
}: {
    lukkModal: () => void;
    hendelse: GyldigNesteHendelse | null;
    sak: IASak;
    setVisKonfetti?: (visKonfetti: boolean) => void;
    clearNesteSteg: () => void;
}) {
    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(
        sak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr);

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
            .then(() => {
                if (
                    hendelse.saksHendelsestype ===
                    IASakshendelseTypeEnum.enum.FULLFØR_BISTAND
                ) {
                    setVisKonfetti?.(true);
                }
            })
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
    hendelse,
    bekreftet,
    setBekreftet,
    tekst,
}: {
    hendelse: GyldigNesteHendelse;
    bekreftet: boolean;
    setBekreftet: (a: boolean) => void;
    tekst: ModalTekst;
}) {
    if (hendelse.saksHendelsestype === "FULLFØR_BISTAND") {
        return (
            <ConfirmationPanel
                checked={bekreftet}
                onChange={() => setBekreftet(!bekreftet)}
                label="Jeg bekrefter at saken skal avsluttes"
            >
                {tekst.beskrivelse}
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
                beskrivelse:
                    "Dette vil lukke saken og skal gjøres når avtalt IA-oppfølging er fullført.",
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
