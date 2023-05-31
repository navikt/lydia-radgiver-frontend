import { Meta } from "@storybook/react";
import { NyStatistikkPubliseresBanner } from "./NyStatistikkPubliseresBanner";
import { rest } from "msw";
import { publiseringsinfoPath, sykefraværsstatistikkPath, useHentPubliseringsinfo, } from "../../api/lydia-api";
import {
    forrigePeriodePubliseringsinfo,
    gjeldendePeriodePubliseringsinfo
} from "../../Pages/Prioritering/mocks/sykefraværsstatistikkMock";

export default {
    title: "NyStatistikkPubliseres-banner",
    component: NyStatistikkPubliseresBanner,
} as Meta<typeof NyStatistikkPubliseresBanner>;

export const StatistikkIkkePublisert = () => {
    const { data: publiseringsinfo } = useHentPubliseringsinfo()

    return (
        <>
            <NyStatistikkPubliseresBanner />
            <p>
                Periode: {`${publiseringsinfo?.fraTil.fra.kvartal}. 
                kvartal ${publiseringsinfo?.fraTil.fra.årstall} 
                til ${publiseringsinfo?.fraTil.til.kvartal}. 
                kvartal ${publiseringsinfo?.fraTil.til.årstall}`}
            </p>
        </>
    )
};

export const StatistikkPublisert = () => {
    const { data: publiseringsinfo } = useHentPubliseringsinfo()

    return (
        <>
            <NyStatistikkPubliseresBanner />
            <p>Periode: {`${publiseringsinfo?.fraTil.fra.kvartal}. kvartal ${publiseringsinfo?.fraTil.fra.årstall} til ${publiseringsinfo?.fraTil.til.kvartal}. kvartal ${publiseringsinfo?.fraTil.til.årstall}`}</p>
        </>
    )
};


StatistikkIkkePublisert.parameters = {
    msw: {
        handlers: [
            rest.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(forrigePeriodePubliseringsinfo)
                );
            }),
        ],
    },
};

StatistikkPublisert.parameters = {
    msw: {
        handlers: [
            rest.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, (req, res, ctx) => {
                return res(
                    ctx.json(gjeldendePeriodePubliseringsinfo)
                );
            }),
        ],
    },
};
