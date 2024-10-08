import { Meta } from "@storybook/react";
import { Footer } from "./Footer";
import { http, HttpResponse } from "msw";
import {
    publiseringsinfoPath,
    sykefraværsstatistikkPath,
} from "../../api/lydia-api";
import { gjeldendePeriodePubliseringsinfo } from "../../Pages/Prioritering/mocks/sykefraværsstatistikkMock";

export default {
    title: "Footer",
    component: Footer,
} as Meta<typeof Footer>;

export const Hovedstory = () => (
    <div>
        <Footer />
    </div>
);

export const HentGjeldendePeriodeErTreig = () => (
    <div>
        <Footer />
    </div>
);

HentGjeldendePeriodeErTreig.parameters = {
    msw: {
        handlers: [
            http.get(
                `${sykefraværsstatistikkPath}/${publiseringsinfoPath}`,
                async () => {
                    await sleep(5000);
                    return HttpResponse.json(gjeldendePeriodePubliseringsinfo);
                },
            ),
        ],
    },
};

function sleep(timeMs: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    });
}
