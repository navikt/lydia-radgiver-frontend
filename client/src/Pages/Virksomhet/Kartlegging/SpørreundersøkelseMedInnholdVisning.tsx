import React from "react";
import {
    SpørsmålDto,
    SvaralternativDto,
    TemaDto,
} from "../../../domenetyper/spørreundersøkelseMedInnhold";
import {
    Accordion,
    BodyShort,
    Box,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
} from "@navikt/ds-react";

interface SpørreundersøkelseMedInnholdVisningProps {
    erModalÅpen: boolean;
    lukkModal: () => void;
}

export const SpørreundersøkelseMedInnholdVisning = ({
    erModalÅpen,
    lukkModal,
}: SpørreundersøkelseMedInnholdVisningProps) => {
    return <></>;
};

function GruppertSpørsmålRenderer({ tema }: { tema: TemaDto }) {
    const grupperteSpørsmål = tema.spørsmålOgSvaralternativer.reduce(
        (acc, spørsmål) => {
            if (spørsmål.undertemanavn) {
                acc[spørsmål.undertemanavn] = acc[spørsmål.undertemanavn] || [];
                acc[spørsmål.undertemanavn].push(spørsmål);
            } else {
                acc["Uten gruppe"] = acc["Uten gruppe"] || [];
                acc["Uten gruppe"].push(spørsmål);
            }
            return acc;
        },
        {} as { [key: string]: SpørsmålDto[] },
    );

    return (
        <>
            {Object.entries(grupperteSpørsmål).map(([kategori, spørsmål]) => (
                <React.Fragment key={kategori}>
                    <Kategori tittel={kategori} />
                    <SpørsmålRenderer
                        tema={{ ...tema, spørsmålOgSvaralternativer: spørsmål }}
                    />
                </React.Fragment>
            ))}
        </>
    );
}

const KATEGORI_BESKRIVELSER: { [key: string]: string } = {
    //Arbeidsmiljø
    "Utvikle arbeidsmiljøet":
        "Mål: Øke anvendelse og kompetanse innen verktøy og bransjerettet kunnskap for å jobbe målrettet og kunnskapsbasert med eget arbeidsmiljø.",
    "Endring og omstilling":
        "Mål: Øke kunnskap om hvordan ivareta arbeidsmiljø og forebygge sykefravær under endring og omstilling.",
    "Oppfølging av arbeidsmiljøundersøkelser":
        "Mål: Øke ferdigheter og gi støtte til hvordan man kan jobbe med forhold på arbeidsplassen som belyses i egne arbeidsmiljøundersøkelser.",
    "Livsfaseorientert personalpolitikk":
        "Mål: Utvikle kultur og personalpolitikk som ivaretar medarbeideres ulike behov, krav, begrensninger og muligheter i ulike livsfaser.",
    "Psykisk helse":
        "Mål: Gi innsikt i hvordan psykiske utfordringer kan komme til uttrykk i arbeidshverdagen og øke ferdigheter for hvordan man møter medarbeidere med psykiske helseutfordringer.",
    HelseIArbeid:
        "Mål: Øke kompetansen og få ansatte til å mestre jobb, selv med muskel/skjelett- og psykiske helseplager.",
    //Sykefraværsarbeid
    Sykefraværsrutiner:
        "Mål: Jobbe systematisk og forebyggende med sykefravær, samt forbedre rutiner og oppfølging av ansatte som er sykmeldte eller står i fare for å bli det.",
    Oppfølgingssamtaler:
        "Mål:  Øke kompetanse og ferdigheter for hvordan man gjennomfører gode oppfølgingssamtaler, både gjennom teori og praksis.",
    "Tilretteleggings- og medvirkningsplikt":
        "Mål: Utvikle rutiner og kultur for tilrettelegging og medvirkning, samt kartlegging av tilretteleggingsmuligheter på arbeidsplassen.",
    "Sykefravær - enkeltsaker":
        "Mål: Øke kompetanse og ferdigheter for hvordan man tar tak i, følger opp og løser enkeltsaker.",
    //Partssamarbeid
    "Utvikle partssamarbeidet":
        "Mål: Styrke og strukturere samarbeidet mellom leder, tillitsvalgt og verneombud, samt øke kunnskap og ferdigheter for å jobbe systematisk og forebyggende med sykefravær og arbeidsmiljø.",
};

function Kategori({ tittel }: { tittel: string }) {
    if (KATEGORI_BESKRIVELSER[tittel]) {
        return (
            <div className={introsideStyles.kategoriHeader}>
                <Heading
                    level="4"
                    size="xsmall"
                    className={introsideStyles.kategoriTittel}
                >
                    {tittel}
                </Heading>
                <BodyShort size="small" className={introsideStyles.kategoriMål}>
                    {KATEGORI_BESKRIVELSER[tittel]}
                </BodyShort>
            </div>
        );
    }

    if (tittel === "Uten gruppe") {
        return null;
    }

    return (
        <div className={introsideStyles.kategoriHeader}>
            <Heading
                level="4"
                size="xsmall"
                className={introsideStyles.kategoriTittel}
            >
                {tittel}
            </Heading>
        </div>
    );
}

function SpørsmålRenderer({ tema }: { tema: TemaDto }) {
    const boxRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (boxRef !== null) {
            boxRef?.current?.scrollIntoView({
                block: "end",
                inline: "center",
            });
        }
    }, []);

    return (
        <Accordion className={introsideStyles.spørsmålsAccordion}>
            {tema.spørsmålOgSvaralternativer.map((spørsmål, index) => (
                <SpørsmålAccordion
                    key={index}
                    spørsmål={spørsmål}
                    index={index}
                />
            ))}
        </Accordion>
    );
}

function SpørsmålAccordion({
    spørsmål,
    index,
}: {
    spørsmål: SpørsmålDto;
    index: number;
}) {
    return (
        <Accordion.Item className={introsideStyles.accordionItem}>
            <Accordion.Header
                className={`${index === 0 ? introsideStyles.førstespørsmåltittel : ""} ${introsideStyles.spørsmåltittel}`}
            >
                {spørsmål.tekst}
            </Accordion.Header>
            <Accordion.Content>
                <Svaralternativer
                    svaralternativer={spørsmål.svaralternativer}
                    flervalg={spørsmål.flervalg}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
}

function Svaralternativer({
    svaralternativer,
    flervalg,
}: {
    svaralternativer: SvaralternativDto[];
    flervalg: boolean;
}) {
    const OptionGroup = flervalg ? CheckboxGroup : RadioGroup;
    const Option = flervalg ? Checkbox : Radio;

    return (
        <OptionGroup hideLegend legend={""}>
            {svaralternativer.map((svaralternativ) => (
                <Option
                    key={svaralternativ.svarId}
                    value={svaralternativ.svarId}
                    className={introsideStyles.disabletOption}
                >
                    {svaralternativ.svartekst}
                </Option>
            ))}
        </OptionGroup>
    );
}

function SvarRenderer({ tema }: { tema: TemaDto }) {
    const boxRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (boxRef !== null) {
            boxRef?.current?.scrollIntoView({
                block: "end",
                inline: "center",
            });
        }
    }, []);

    const erGruppert = tema.spørsmålOgSvaralternativer.some(
        (spørsmål) => spørsmål.undertemanavn,
    );

    return (
        <Box
            borderRadius="xlarge"
            padding="12"
            background="surface-default"
            className={introsideStyles.spørsmålsseksjon}
            ref={boxRef}
        >
            {erGruppert ? (
                <GruppertSpørsmålRenderer tema={tema} />
            ) : (
                <SpørsmålRenderer tema={tema} />
            )}
        </Box>
    );
}
