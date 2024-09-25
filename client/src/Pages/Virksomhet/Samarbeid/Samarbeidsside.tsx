import { useParams } from "react-router-dom";
import { statiskeSidetitler, useTittel } from "../../../util/useTittel";
import {
    useHentAktivSakForVirksomhet,
    useHentSamarbeid,
    useHentVirksomhetsinformasjon,
} from "../../../api/lydia-api";
import React, { useEffect } from "react";
import { loggSideLastet } from "../../../util/amplitude-klient";
import { Loader } from "@navikt/ds-react";
import { SamarbeidsVisning } from "./SamarbeidsVisning";

export const Samarbeidsside = () => {
    const { oppdaterTittel } = useTittel(statiskeSidetitler.virksomhetsside);
    const { orgnummer, saksnummer, prosessId } = useParams();

    const { data: virksomhetsinformasjon, loading: lasterVirksomhet } =
        useHentVirksomhetsinformasjon(orgnummer);

    const { data: iaSak } = useHentAktivSakForVirksomhet(orgnummer);

    const { data: alleSamarbeid } = useHentSamarbeid(orgnummer, saksnummer);
    useEffect(() => {
        if (virksomhetsinformasjon) {
            oppdaterTittel(`Fia - ${virksomhetsinformasjon.navn}`);
            loggSideLastet("Virksomhetsside");
        }
    }, [virksomhetsinformasjon?.navn]);

    if (lasterVirksomhet) {
        return <LasterVirksomhet />;
    }

    if (virksomhetsinformasjon && iaSak && alleSamarbeid) {
        return (
            <>
                <SamarbeidsVisning
                    virksomhet={virksomhetsinformasjon}
                    iaSak={iaSak}
                    alleSamarbeid={alleSamarbeid}
                    gjeldendeProsessId={Number(prosessId)}
                />
            </>
        );
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
