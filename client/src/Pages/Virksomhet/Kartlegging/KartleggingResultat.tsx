import { BodyShort, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

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
        <>
            {kartleggingResultat.spørsmålMedSvar.map((spørsmål) => (
                <div key={spørsmål.spørsmålId}>
                    <BodyShort weight={"semibold"}>
                        {spørsmål.tekst}
                    </BodyShort>
                    <ResponsiveContainer minHeight={100}>
                        <BarChart width={500}
                                  height={300}
                                  data={spørsmål.svarListe}
                        >
                            <XAxis dataKey="tekst" />
                            <YAxis />
                            {spørsmål.svarListe.map(svar => (
                                    <Bar key={svar.svarId} dataKey={"antallSvar"} stackId={"a"}></Bar>
                                )
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </>
    );
};
