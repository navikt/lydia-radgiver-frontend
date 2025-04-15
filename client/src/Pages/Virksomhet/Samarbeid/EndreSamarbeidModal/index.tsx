import {
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../../../domenetyper/iaSakProsess";
import { IASak, IASakshendelseType } from "../../../../domenetyper/domenetyper";
import React, { useState } from "react";
import {
    useHentSakForVirksomhet,
    useHentSakshistorikk,
} from "../../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../../api/lydia-api/sak";
import { useHentSamarbeid } from "../../../../api/lydia-api/spørreundersøkelse";
import { KanGjennomføreStatusendring, MuligSamarbeidsgandling } from "../../../../domenetyper/samarbeidsEndring";
import BekreftHandlingModal from "./BekreftHandlingModal";
import EndreSamarbeidModalInnhold from "./EndreSamarbeidInnhold";

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

    return (
        <>
            <EndreSamarbeidModalInnhold
                open={open}
                setOpen={setOpen}
                samarbeid={samarbeid}
                iaSak={iaSak}
                samarbeidData={samarbeidData}
                navn={navn}
                setNavn={setNavn}
                setLagreNavnVellykket={setLagreNavnVellykket}
                setSisteType={setSisteType}
                setKanGjennomføreResultat={setKanGjennomføreResultat}
                hentSamarbeidPåNytt={hentSamarbeidPåNytt}
                nyHendelse={nyHendelse}
                lagreNavnVellykket={lagreNavnVellykket}
            />
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
