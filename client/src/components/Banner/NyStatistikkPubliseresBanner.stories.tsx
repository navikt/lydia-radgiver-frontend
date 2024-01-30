import { Meta } from "@storybook/react";
import { NyStatistikkPubliseresBanner } from "./NyStatistikkPubliseresBanner";
import { http, HttpResponse } from "msw";
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
            http.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, () => {
                return HttpResponse.json(forrigePeriodePubliseringsinfo);
            }),
        ],
    },
};

StatistikkPublisert.parameters = {
    msw: {
        handlers: [
            http.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, () => {
                return HttpResponse.json(gjeldendePeriodePubliseringsinfo);
            }),
        ],
    },
};
