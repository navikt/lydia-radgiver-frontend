import { BodyShort, List, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentKartleggingResultat } from "../../../api/lydia-api";

interface Props {
    iaSak: IASak;
    kartleggingId: string;
}

export const KartleggingResultat = ({ iaSak, kartleggingId }: Props) => {
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartleggingId,
        );

    if (lasterKartleggingResultat) {
        return <Loader />;
    }

    if (!kartleggingResultat) {
        return <BodyShort>Kunne ikke hente kartleggingsresultater</BodyShort>;
    }

    return (
            <List>
                {kartleggingResultat.spørsmålMedSvar.map((spørsmål) => (
                    <List.Item key={spørsmål.spørsmålId}>
                        <BodyShort weight={"semibold"}>
                            {spørsmål.tekst}
                        </BodyShort>
                        <List>
                            {spørsmål.svarListe.map((svaralternativ) => (
                                <List.Item key={svaralternativ.svarId}>
                                    <BodyShort>
                                        {svaralternativ.antallSvar} :{" "}
                                        {svaralternativ.tekst}
                                    </BodyShort>
                                </List.Item>
                            ))}
                        </List>
                    </List.Item>
                ))}
            </List>
    );
};
