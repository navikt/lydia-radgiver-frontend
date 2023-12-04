import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { Leveransekort } from "./Leveransekort";
import { useMineLeveranser } from "../../api/lydia-api";
import { useEffect } from "react";
import { loggSideLastet } from "../../util/amplitude-klient";

export const Leveransebrettside = () => {
    if (!erIDev) {
        return null;
    }

    useEffect(() => {
        loggSideLastet("Leveranseoversiktside");
    });

    const { data, loading, error } = useMineLeveranser();

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
                        <Leveransekort leveranse={leveranse} key={index} />
                    );
                })
                : <BodyShort>Du har ingen IA-tjenester som er under arbeid</BodyShort>
            }
        </div>
    );
}
