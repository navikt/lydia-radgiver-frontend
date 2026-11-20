import React from "react";
import { BodyShort, Box, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import {
    lagreSamarbeidsmål,
    lagreSykefraværsmål,
    useHentMål,
} from "../../../api/lydia-api/mål";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../api/lydia-api/bruker";
import { useHentTeam } from "../../../api/lydia-api/team";
import { Måloversikt } from "./Måloversikt";
import { Sykefraværsmåloversikt } from "./Sykefraværsmåloversikt";
import { Samarbeidsmåloversikt } from "./Samarbeidsmåloversikt";
import { Sykefraværsmåldialog } from "./Sykefraværsmåldialog";
import { Samarbeidsmåldialog } from "./Samarbeidsmåldialog";
import { Mål, Samarbeidsmål, Sykefraværsmål } from "./målskjema";

type Måldialog = "sykefravær" | "samarbeid";

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

    // Dialogen blir stående etter lukking, så lukkeanimasjonen får kjøre.
    const [valgtDialog, setValgtDialog] = React.useState<Måldialog>();
    const [dialogÅpen, setDialogÅpen] = React.useState(false);
    const [dialogversjon, setDialogversjon] = React.useState(0);

    const erEier = iaSak.eidAv === brukerinformasjon?.ident;
    const erFølger =
        erSaksbehandler(brukerinformasjon) &&
        følgere.some((følger) => følger === brukerinformasjon?.ident);
    const eierEllerFølger = erEier || erFølger;
    const samarbeidErAktivt = samarbeid.status === "AKTIV";

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

    const åpneDialog = (dialog: Måldialog) => {
        setValgtDialog(dialog);
        setDialogversjon((n) => n + 1);
        setDialogÅpen(true);
    };
    // Knappene vises bare i aktive samarbeid, og er deaktivert uten tilgang.
    const åpneSykefraværsdialog = samarbeidErAktivt
        ? () => åpneDialog("sykefravær")
        : undefined;
    const åpneSamarbeidsdialog = samarbeidErAktivt
        ? () => åpneDialog("samarbeid")
        : undefined;

    const oppdaterLagret = async (lagret: Mål) => {
        await mutate(lagret, { revalidate: false });
        return lagret;
    };

    const lagreSykefravær = async (liste: Sykefraværsmål[]) =>
        (
            await oppdaterLagret(
                await lagreSykefraværsmål(
                    iaSak.orgnr,
                    iaSak.saksnummer,
                    samarbeid.id,
                    liste,
                ),
            )
        ).sykefraværsmål;

    const lagreSamarbeid = async (liste: Samarbeidsmål[]) =>
        (
            await oppdaterLagret(
                await lagreSamarbeidsmål(
                    iaSak.orgnr,
                    iaSak.saksnummer,
                    samarbeid.id,
                    liste,
                ),
            )
        ).samarbeidsmål;

    return (
        <Box paddingBlock="space-24">
            <Måloversikt>
                <Sykefraværsmåloversikt
                    sykefraværsmål={mål.sykefraværsmål}
                    onÅpneDialog={åpneSykefraværsdialog}
                    deaktivert={!eierEllerFølger}
                />
                <Samarbeidsmåloversikt
                    samarbeidsmål={mål.samarbeidsmål}
                    onÅpneDialog={åpneSamarbeidsdialog}
                    deaktivert={!eierEllerFølger}
                />
            </Måloversikt>
            {valgtDialog === "sykefravær" && (
                <Sykefraværsmåldialog
                    key={dialogversjon}
                    open={dialogÅpen}
                    onOpenChange={setDialogÅpen}
                    lagret={mål.sykefraværsmål}
                    onLagre={lagreSykefravær}
                />
            )}
            {valgtDialog === "samarbeid" && (
                <Samarbeidsmåldialog
                    key={dialogversjon}
                    open={dialogÅpen}
                    onOpenChange={setDialogÅpen}
                    lagret={mål.samarbeidsmål}
                    onLagre={lagreSamarbeid}
                    iaSak={iaSak}
                />
            )}
        </Box>
    );
}
