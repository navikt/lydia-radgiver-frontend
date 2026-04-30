import { BodyShort, Heading } from "@navikt/ds-react";
import React from "react";
import { useSpørreundersøkelse } from "@/components/Spørreundersøkelse/SpørreundersøkelseContext";
import { getGraffargeFromTema } from "@/components/Spørreundersøkelse/TemaResultat";
import {
    SpørsmålDto,
    TemaDto,
} from "@features/kartlegging/types/spørreundersøkelseMedInnhold";
import styles from "./spørreundersøkelseForhåndsvisningModal.module.scss";
import { SpørsmålRenderer } from "./SpørsmålRenderer";

function Spørsmålsgruppe({
    className = "",
    ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props} className={`${styles.spørsmålsgruppe} ${className}`} />
    );
}

function getGrupperteSpørsmål(tema: TemaDto) {
    return React.useMemo(
        () =>
            tema.spørsmålOgSvaralternativer.reduce(
                (acc, spørsmål) => {
                    if (spørsmål.undertemanavn) {
                        acc[spørsmål.undertemanavn] =
                            acc[spørsmål.undertemanavn] || [];
                        acc[spørsmål.undertemanavn].push(spørsmål);
                    } else {
                        acc["Uten gruppe"] = acc["Uten gruppe"] || [];
                        acc["Uten gruppe"].push(spørsmål);
                    }
                    return acc;
                },
                {} as { [key: string]: SpørsmålDto[] },
            ),
        [tema],
    );
}

export function GruppertSpørsmålRenderer({
    tema,
    defaultOpen = false,
    useFarge = false,
    ItemRenderer = SpørsmålRenderer,
    Container = Spørsmålsgruppe,
}: {
    tema: TemaDto;
    useFarge?: boolean;
    defaultOpen?: boolean;
    ItemRenderer?: React.ComponentType<{
        tema: TemaDto;
        defaultOpen?: boolean;
    }>;
    Container?: React.ComponentType<{ children: React.ReactNode }>;
}) {
    const { spørreundersøkelseType } = useSpørreundersøkelse();
    const grupperteSpørsmål = getGrupperteSpørsmål(tema);

    return (
        <>
            {Object.entries(grupperteSpørsmål).map(([kategori, spørsmål]) => (
                <Container key={kategori}>
                    {spørreundersøkelseType !== "BEHOVSVURDERING" && (
                        <Kategori
                            useFarge={useFarge}
                            tittel={kategori}
                            temanavn={tema.navn}
                        />
                    )}
                    <ItemRenderer
                        defaultOpen={defaultOpen}
                        tema={{ ...tema, spørsmålOgSvaralternativer: spørsmål }}
                    />
                </Container>
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

function Kategori({
    tittel,
    useFarge = false,
    temanavn = "",
}: {
    tittel: string;
    useFarge?: boolean;
    temanavn?: string;
}) {
    if (KATEGORI_BESKRIVELSER[tittel]) {
        return (
            <div className={styles.kategoriheader}>
                <Heading
                    className={styles.kategoritittel}
                    level="4"
                    size="xsmall"
                    style={{
                        color: useFarge
                            ? getGraffargeFromTema(temanavn)
                            : "var(--a-text-default)",
                    }}
                >
                    {tittel}
                </Heading>
                <BodyShort className={styles.kategorimål} size="small">
                    {KATEGORI_BESKRIVELSER[tittel]}
                </BodyShort>
            </div>
        );
    }

    if (tittel === "Uten gruppe") {
        return null;
    }

    return (
        <div className={styles.kategoriheader}>
            <Heading
                className={styles.kategoritittel}
                level="4"
                size="xsmall"
                style={{
                    color: useFarge
                        ? getGraffargeFromTema(temanavn)
                        : "var(--a-text-default)",
                }}
            >
                {tittel}
            </Heading>
        </div>
    );
}
