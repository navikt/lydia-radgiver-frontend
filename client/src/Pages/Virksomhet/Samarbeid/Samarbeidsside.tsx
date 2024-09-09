import { useParams } from "react-router-dom";
import { statiskeSidetitler, useTittel } from "../../../util/useTittel";
import {
    useHentAktivSakForVirksomhet,
    useHentIaProsesser,
    useHentVirksomhetsinformasjon,
} from "../../../api/lydia-api";
import React, { useEffect } from "react";
import { loggSideLastet } from "../../../util/amplitude-klient";
import { erIDev } from "../../../components/Dekoratør/Dekoratør";
import { Loader } from "@navikt/ds-react";
import { SamarbeidsVisning } from "./SamarbeidsVisning";

export const Samarbeidsside = () => {
    const { oppdaterTittel } = useTittel(statiskeSidetitler.virksomhetsside);
    const { orgnummer, saksnummer, prosessId } = useParams();

    const { data: virksomhetsinformasjon, loading: lasterVirksomhet } =
        useHentVirksomhetsinformasjon(orgnummer);

    const { data: iaSak } = useHentAktivSakForVirksomhet(orgnummer);

    const { data: samarbeid } = useHentIaProsesser(orgnummer, saksnummer);
    useEffect(() => {
        if (virksomhetsinformasjon) {
            oppdaterTittel(`Fia - ${virksomhetsinformasjon.navn}`);
            loggSideLastet("Virksomhetsside");
        }
    }, [virksomhetsinformasjon?.navn]);

    if (lasterVirksomhet) {
        return <LasterVirksomhet />;
    }

    if (virksomhetsinformasjon && iaSak && samarbeid) {
        if (erIDev) {
            return (
                <>
                    <SamarbeidsVisning
                        virksomhet={virksomhetsinformasjon}
                        iaSak={iaSak}
                        iaProsesser={samarbeid}
                        gjeldendeProsessId={Number(prosessId)}
                    />
                </>
            );
        } else {
            return null;
        }
    } else {
        return <p>Kunne ikke laste ned informasjon om virksomhet</p>;
    }
};

const LasterVirksomhet = () => (
    <Loader
        title={"Laster inn virksomhet"}
        variant={"interaction"}
        size={"xlarge"}
    />
);
