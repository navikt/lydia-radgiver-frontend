import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { IATjenestekort } from "./IATjenestekort";
import { useMineIATjenester } from "../../api/lydia-api";
import { useEffect } from "react";
import { loggSideLastet } from "../../util/amplitude-klient";

export const IATjenesteoversiktside = () => {
    if (!erIDev) {
        return null;
    }

    useEffect(() => {
        loggSideLastet("MineIATjenesterside");
    });

    const { data, loading, error } = useMineIATjenester();

    if (loading) {
        return (
            <div>
                <Heading size="large">IA-tjenester på saker jeg eier</Heading>
                <Loader />
            </div>
        )
    }
    if (error) {
        return (
            <div>
                <Heading size="large">IA-tjenester på saker jeg eier</Heading>
                <BodyShort>Kunne ikke hente IA-tjenester</BodyShort>
            </div>
        )
    }

    return (
        <div>
            <Heading size="large">IA-tjenester på saker jeg eier</Heading>
            {data?.length ?
                data.map((leveranse, index) => {
                    return (
                        <IATjenestekort iaTjeneste={leveranse} key={index} />
                    );
                })
                : <BodyShort>Du har ingen IA-tjenester som er under arbeid</BodyShort>
            }
        </div>
    );
}
