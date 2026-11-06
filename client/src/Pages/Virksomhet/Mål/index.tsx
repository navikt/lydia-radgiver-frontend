import React from "react";
import {
    BodyLong,
    BodyShort,
    Box,
    Button,
    Heading,
    HStack,
    List,
    Loader,
    VStack,
} from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { lagreMål, useHentMål } from "../../../api/lydia-api/mål";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../api/lydia-api/bruker";
import { useHentTeam } from "../../../api/lydia-api/team";
import { MålDialog } from "./MålDialog";
import { Mål } from "./målskjema";
import {
    SykefraværsmåltypeOverskrift,
    Målverdier,
} from "./Sykefraværsmålvisning";
import styles from "./mål.module.scss";

export default function MålFane({
    iaSak,
    samarbeid,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
}) {
    const {
        data: mål,
        loading,
        error,
        mutate,
    } = useHentMål(iaSak.orgnr, iaSak.saksnummer, samarbeid.id);
    const { data: brukerinformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak.saksnummer);

    const [dialogÅpen, setDialogÅpen] = React.useState(false);
    const [dialogversjon, setDialogversjon] = React.useState(0);

    const erEier = iaSak.eidAv === brukerinformasjon?.ident;
    const erFølger =
        erSaksbehandler(brukerinformasjon) &&
        følgere.some((følger) => følger === brukerinformasjon?.ident);
    const eierEllerFølger = erEier || erFølger;
    const kanEndre = eierEllerFølger && samarbeid.status === "AKTIV";

    if (loading) {
        return <Loader title="Henter mål" />;
    }

    if (error || !mål) {
        return (
            <Box paddingBlock="space-24">
                <BodyShort>Kunne ikke hente målene.</BodyShort>
            </Box>
        );
    }

    const harMål =
        mål.sykefraværsmål.length > 0 || mål.samarbeidsmål.length > 0;

    const åpneDialog = () => {
        setDialogversjon((n) => n + 1);
        setDialogÅpen(true);
    };

    const lagre = async (nyeMål: Mål) => {
        const lagret = await lagreMål(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            nyeMål,
        );
        await mutate(lagret, { revalidate: false });
    };

    return (
        <Box paddingBlock="space-24">
            <VStack gap="space-16">
                {harMål ? (
                    <LagredeMål
                        mål={mål}
                        onRediger={kanEndre ? åpneDialog : undefined}
                    />
                ) : (
                    <IngenMål
                        onLeggTil={kanEndre ? åpneDialog : undefined}
                        manglerTilgang={
                            !eierEllerFølger && samarbeid.status === "AKTIV"
                        }
                    />
                )}
            </VStack>
            {dialogversjon > 0 && (
                <MålDialog
                    key={dialogversjon}
                    open={dialogÅpen}
                    onOpenChange={setDialogÅpen}
                    lagret={mål}
                    onLagre={lagre}
                    iaSak={iaSak}
                />
            )}
        </Box>
    );
}

function IngenMål({
    onLeggTil,
    manglerTilgang,
}: {
    onLeggTil?: () => void;
    manglerTilgang: boolean;
}) {
    return (
        <Box
            as="section"
            aria-labelledby="maal-overskrift"
            background="default"
            borderRadius="12"
            borderColor="neutral-subtle"
            borderWidth="1"
            padding="space-24"
        >
            <VStack gap="space-16" align="start">
                <div>
                    <Heading level="3" size="medium" id="maal-overskrift">
                        Mål
                    </Heading>
                    <BodyShort textColor="subtle">
                        Legg til mål for sykefraværet og samarbeidet.
                    </BodyShort>
                </div>
                {onLeggTil && (
                    <Button onClick={onLeggTil} aria-haspopup="dialog">
                        Legg til mål
                    </Button>
                )}
                {manglerTilgang && (
                    <BodyShort>
                        Du må være eier eller følger for å legge til mål.
                    </BodyShort>
                )}
            </VStack>
        </Box>
    );
}

function LagredeMål({ mål, onRediger }: { mål: Mål; onRediger?: () => void }) {
    return (
        <Box
            as="section"
            aria-labelledby="maal-overskrift"
            background="default"
            borderRadius="12"
            borderColor="neutral-subtle"
            borderWidth="1"
            padding="space-24"
        >
            <VStack gap="space-16">
                <HStack justify="space-between" align="start" gap="space-16">
                    <div>
                        <Heading level="3" size="medium" id="maal-overskrift">
                            Mål
                        </Heading>
                    </div>
                    {onRediger && (
                        <Button
                            variant="secondary"
                            size="small"
                            icon={<PencilIcon aria-hidden />}
                            onClick={onRediger}
                            aria-haspopup="dialog"
                            aria-describedby="maal-overskrift"
                        >
                            Rediger
                        </Button>
                    )}
                </HStack>
                {mål.sykefraværsmål.map((sykefraværsmål) => (
                    <Box
                        key={sykefraværsmål.type}
                        as="section"
                        aria-labelledby={`lagret-${sykefraværsmål.type}`}
                        background="raised"
                        borderRadius="8"
                        borderColor="neutral-subtle"
                        borderWidth="1"
                        padding="space-16"
                        className={styles.sykefravaersmaalkort}
                    >
                        <VStack gap="space-12">
                            <SykefraværsmåltypeOverskrift
                                type={sykefraværsmål.type}
                                id={`lagret-${sykefraværsmål.type}`}
                                level="4"
                            />
                            <Målverdier mål={sykefraværsmål} />
                        </VStack>
                    </Box>
                ))}
                {mål.samarbeidsmål.length > 0 && (
                    <Box
                        as="section"
                        aria-labelledby="lagret-samarbeidsmal"
                        background="raised"
                        borderRadius="8"
                        borderColor="neutral-subtle"
                        borderWidth="1"
                        padding="space-16"
                    >
                        <VStack gap="space-8">
                            <Heading
                                level="4"
                                size="small"
                                id="lagret-samarbeidsmal"
                            >
                                Mål for samarbeidet
                            </Heading>
                            {mål.samarbeidsmål.length === 1 ? (
                                <BodyLong className={styles.samarbeidsmaal}>
                                    {mål.samarbeidsmål[0].mål}
                                </BodyLong>
                            ) : (
                                <List>
                                    {mål.samarbeidsmål.map((m) => (
                                        <List.Item
                                            key={m.id ?? m.mål}
                                            className={styles.samarbeidsmaal}
                                        >
                                            {m.mål}
                                        </List.Item>
                                    ))}
                                </List>
                            )}
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}
