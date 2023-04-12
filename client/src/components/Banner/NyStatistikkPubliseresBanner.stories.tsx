import { Meta } from "@storybook/react";
import { NyStatistikkPubliseresBanner } from "./NyStatistikkPubliseresBanner";
import { rest } from "msw";
import {
    gjeldendePeriodePath,
    sykefraværsstatistikkPath,
    useHentGjeldendePeriodeForVirksomhetSiste4Kvartal
} from "../../api/lydia-api";
import {
    forrigePeriodeSiste4Kvartal,
    gjeldendePeriodeSiste4Kvartal
} from "../../Pages/Prioritering/mocks/sykefraværsstatistikkMock";

export default {
    title: "NyStatistikkPubliseres-banner",
    component: NyStatistikkPubliseresBanner,
} as Meta<typeof NyStatistikkPubliseresBanner>;

export const StatistikkIkkePublisert = () => {
    const { data: periode } = useHentGjeldendePeriodeForVirksomhetSiste4Kvartal()

    return (
        <>
            <NyStatistikkPubliseresBanner />
            <p>Periode: {`${periode?.fra.kvartal}. kvartal ${periode?.fra.årstall} til ${periode?.til.kvartal}. kvartal ${periode?.til.årstall}`}</p>
        </>
    )
};

export const StatistikkPublisert = () => {
    const { data: periode } = useHentGjeldendePeriodeForVirksomhetSiste4Kvartal()

    return (
        <>
            <NyStatistikkPubliseresBanner />
            <p>Periode: {`${periode?.fra.kvartal}. kvartal ${periode?.fra.årstall} til ${periode?.til.kvartal}. kvartal ${periode?.til.årstall}`}</p>
        </>
    )
};


StatistikkIkkePublisert.parameters = {
    msw: {
        handlers: {
            gjeldendePeriodeSiste4Kvartal: [
                rest.get(`${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(forrigePeriodeSiste4Kvartal)
                    );
                }),
            ],
        }
    },
};

StatistikkPublisert.parameters = {
    msw: {
        handlers: {
            gjeldendePeriodeSiste4Kvartal: [
                rest.get(`${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(gjeldendePeriodeSiste4Kvartal)
                    );
                }),
            ],
        }
    },
};
