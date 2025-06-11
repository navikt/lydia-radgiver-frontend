import {
    IaSakProsess,
} from "../../../../domenetyper/iaSakProsess";
import { IASak, IASakshendelseType, IASakshendelseTypeEnum } from "../../../../domenetyper/domenetyper";
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
import VelgHandlingModal from "./VelgHandlingModal";

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
    const [navn, setNavn] = useState(samarbeid.navn ?? "");
    const [kanGjennomføreResultat, setKanGjennomføreResultat] = useState<KanGjennomføreStatusendring>();
    const [bekreftType, setBekreftType] = useState<MuligSamarbeidsgandling | null>(null);
    const [lagreNavnVellykket, setLagreNavnVellykket] = useState(false);
    const [velgHandlingModalÅpen, setVelgHandlingModalÅpen] = useState(false);

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

    const hentKanGjennomføreStatusendring = (
        handling: MuligSamarbeidsgandling,
    ) => {
        setLasterKanGjennomføreHandling(handling);
        return getKanGjennomføreStatusendring(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeid.id,
            handling,
        ).then((resultat) => {
            setLasterKanGjennomføreHandling(null);
            setKanGjennomføreResultat(resultat);
            return resultat;
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
                setKanGjennomføreResultat={setKanGjennomføreResultat}
                hentSamarbeidPåNytt={hentSamarbeidPåNytt}
                nyHendelse={nyHendelse}
                lagreNavnVellykket={lagreNavnVellykket}
                setLasterKanGjennomføreHandling={setLasterKanGjennomføreHandling}
                setBekreftType={setBekreftType}
                hentKanGjennomføreStatusendring={hentKanGjennomføreStatusendring}
                lasterKanGjennomføreHandling={lasterKanGjennomføreHandling}
                setVelgHandlingModalÅpen={setVelgHandlingModalÅpen} />
            {velgHandlingModalÅpen && bekreftType === null && <VelgHandlingModal
                iaSak={iaSak}
                samarbeid={samarbeid}
                åpen={velgHandlingModalÅpen && bekreftType === null}
                hentKanGjennomføreStatusendring={hentKanGjennomføreStatusendring}
                kanGjennomføreResultat={kanGjennomføreResultat}
                lasterKanGjennomføreHandling={lasterKanGjennomføreHandling}
                setBekreftType={setBekreftType}
                setÅpen={setVelgHandlingModalÅpen} />}
            <BekreftHandlingModal
                type={bekreftType}
                open={bekreftType !== undefined}
                onCancel={() => {
                    setKanGjennomføreResultat(undefined);
                    setBekreftType(null);
                    setVelgHandlingModalÅpen(false);
                }}
                onConfirm={() => {
                    if (bekreftType) {
                        nyHendelse(getHendelseFromType(bekreftType)).then(() => {
                            setKanGjennomføreResultat(undefined);
                            setBekreftType(null);
                            setVelgHandlingModalÅpen(false);
                            setOpen(false);
                        });
                    }
                }}
                erTillatt={kanGjennomføreResultat?.kanGjennomføres}
                samarbeid={samarbeid}
                advarsler={kanGjennomføreResultat?.advarsler}
                blokkerende={kanGjennomføreResultat?.blokkerende} />
        </>
    );
};

function getHendelseFromType(type: MuligSamarbeidsgandling): IASakshendelseType {
    switch (type) {
        case "fullfores":
            return IASakshendelseTypeEnum.enum.FULLFØR_PROSESS;
        case "avbrytes":
            return IASakshendelseTypeEnum.enum.AVBRYT_PROSESS;
        case "slettes":
            return IASakshendelseTypeEnum.enum.SLETT_PROSESS;
    }
}