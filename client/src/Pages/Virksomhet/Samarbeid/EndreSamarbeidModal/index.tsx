import {
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../../../domenetyper/iaSakProsess";
import { IASak, IASakshendelseType } from "../../../../domenetyper/domenetyper";
import React, { useState } from "react";
import {
    getKanGjennomføreStatusendring,
    useHentSakForVirksomhet,
    useHentSakshistorikk,
} from "../../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../../api/lydia-api/sak";
import { useHentSamarbeid } from "../../../../api/lydia-api/spørreundersøkelse";
import { KanGjennomføreStatusendring, MuligSamarbeidsgandling } from "../../../../domenetyper/samarbeidsEndring";
import BekreftHandlingModal from "./BekreftHandlingModal";
import EndreSamarbeidModalInnhold from "./EndreSamarbeidInnhold";
import AvsluttModal from "./AvsluttModal";

interface EndreSamarbeidModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    samarbeid: IaSakProsess;
    iaSak: IASak;
}

export const EndreSamarbeidModal = ({
    open,
    setOpen,
    samarbeid,
    iaSak,
}: EndreSamarbeidModalProps) => {
    const [navn, setNavn] = useState(defaultNavnHvisTomt(samarbeid.navn));
    const [kanGjennomføreResultat, setKanGjennomføreResultat] = useState<KanGjennomføreStatusendring>();
    const [sisteType, setSisteType] = useState<MuligSamarbeidsgandling | null>(null);
    const [lagreNavnVellykket, setLagreNavnVellykket] = useState(false);
    const [avsluttModalÅpen, setAvsluttModalÅpen] = useState(false);

    const { mutate: mutateSamarbeidshistorikk } = useHentSakshistorikk(
        iaSak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentSakForVirksomhet(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { mutate: hentSamarbeidPåNytt, data: samarbeidData } =
        useHentSamarbeid(iaSak.orgnr, iaSak.saksnummer);



    const nyHendelse = (hendelsestype: IASakshendelseType) => {
        const nyttNavn = navn.trim();
        return nyHendelsePåSak(
            iaSak,
            {
                saksHendelsestype: hendelsestype,
                gyldigeÅrsaker: [],
            },
            null,
            {
                ...samarbeid,
                sistEndret: null,
                opprettet: null,
                navn: nyttNavn,
            },
        ).then(() => {
            mutateHentSaker();
            mutateSamarbeidshistorikk();
            hentSamarbeidPåNytt().then(() => {
                setLagreNavnVellykket(true);
            });
        });
    };
    const [lasterKanGjennomføreHandling, setLasterKanGjennomføreHandling] = useState<string | null>(null);

    const prøvÅGjennomføreHandling = (handling: MuligSamarbeidsgandling) => {
        setLasterKanGjennomføreHandling(handling);
        setSisteType(handling);
        getKanGjennomføreStatusendring(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            handling,
        ).then((kanGjennomføreResult) => {
            setLasterKanGjennomføreHandling(null);
            setKanGjennomføreResultat(kanGjennomføreResult);
        });
    };

    return (
        <>
            <EndreSamarbeidModalInnhold
                open={open}
                setOpen={setOpen}
                samarbeid={samarbeid}
                samarbeidData={samarbeidData}
                navn={navn}
                setNavn={setNavn}
                setLagreNavnVellykket={setLagreNavnVellykket}
                setSisteType={setSisteType}
                setKanGjennomføreResultat={setKanGjennomføreResultat}
                hentSamarbeidPåNytt={hentSamarbeidPåNytt}
                nyHendelse={nyHendelse}
                lagreNavnVellykket={lagreNavnVellykket}
                setLasterKanGjennomføreHandling={setLasterKanGjennomføreHandling}
                prøvÅGjennomføreHandling={prøvÅGjennomføreHandling}
                lasterKanGjennomføreHandling={lasterKanGjennomføreHandling}
                setAvsluttModalÅpen={setAvsluttModalÅpen} />
            <AvsluttModal
                iaSak={iaSak}
                samarbeid={samarbeid}
                åpen={avsluttModalÅpen}
                prøvÅGjennomføreHandling={prøvÅGjennomføreHandling}
                setÅpen={setAvsluttModalÅpen} />
            <BekreftHandlingModal
                type={sisteType}
                open={kanGjennomføreResultat !== undefined}
                onCancel={() => setKanGjennomføreResultat(undefined)}
                onConfirm={() => {
                    nyHendelse(sisteType === "slettes" ? "SLETT_PROSESS" : "FULLFØR_PROSESS").then(() => {
                        setKanGjennomføreResultat(undefined);
                        setSisteType(null);
                    });
                }}
                erTillatt={kanGjennomføreResultat?.kanGjennomføres}
                samarbeid={samarbeid}
                advarsler={kanGjennomføreResultat?.advarsler}
                blokkerende={kanGjennomføreResultat?.blokkerende} />
        </>
    );
};
