import { Loader, TextField } from "@navikt/ds-react";
import { FloppydiskIcon } from "@navikt/aksel-icons";
import React, { useState } from "react";
import styled from "styled-components";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import {
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentProsesser,
    useHentSamarbeidshistorikk,
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { NavFarger } from "../../../styling/farger";

const ProsessRadContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const ProsessNavn = styled.div`
    min-width: fit-content;
    width: 50%;
    max-width: 100%;
`;

const LagreNavnIkon = styled(FloppydiskIcon)`
    margin-left: 1rem;
    color: ${NavFarger.interactionPrimary};
    cursor: pointer;
`;

const LagrerNavnLoader = styled(Loader)`
    margin-left: 1rem;
`;

interface ProsessRadProps {
    iaProsess: IaSakProsess;
    iaSak: IASak;
}

export const ProsessRad = ({ iaProsess, iaSak }: ProsessRadProps) => {
    const [navn, setNavn] = useState(iaProsess.navn ?? "");
    const [lagrerNavn, setLagrerNavn] = useState(false);
    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(
        iaSak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(
        iaSak.orgnr,
    );
    const { mutate: muterProsesser } = useHentProsesser(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const endreNavn = () => {
        setLagrerNavn(true);
        nyHendelsePåSak(
            iaSak,
            {
                saksHendelsestype: "ENDRE_PROSESS",
                gyldigeÅrsaker: [],
            },
            null,
            {
                ...iaProsess,
                navn: navn,
            },
        ).then(() => {
            mutateHentSaker();
            mutateSamarbeidshistorikk();
            muterProsesser().then(() => setLagrerNavn(false));
        });
    };

    return (
        <ProsessRadContainer>
            <ProsessNavn>
                <TextField
                    maxLength={25}
                    size="small"
                    label="Navngi samarbeid"
                    defaultValue={navn}
                    onChange={(nyttnavn) => {
                        setNavn(nyttnavn.target.value);
                    }}
                    hideLabel
                />
            </ProsessNavn>
            {!lagrerNavn && iaProsess.navn != navn && (
                <LagreNavnIkon
                    title="Lagre navn"
                    fontSize="1.5rem"
                    onClick={endreNavn}
                />
            )}
            {lagrerNavn && <LagrerNavnLoader size="small" />}
        </ProsessRadContainer>
    );
};
