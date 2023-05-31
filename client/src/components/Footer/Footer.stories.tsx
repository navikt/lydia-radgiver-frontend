import { Meta } from "@storybook/react";
import { Footer } from "./Footer";
import { rest } from "msw";
import { publiseringsinfoPath, sykefraværsstatistikkPath } from "../../api/lydia-api";
import { gjeldendePeriodePubliseringsinfo } from "../../Pages/Prioritering/mocks/sykefraværsstatistikkMock";

export default {
    title: "Footer",
    component: Footer,
} as Meta<typeof Footer>;

export const Hovedstory = () => (
    <div>
        <Footer />
    </div>
)

Hovedstory.parameters = {
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

export const HentGjeldendePeriodeErTreig = () => (
    <div>
        <Footer />
    </div>
)

HentGjeldendePeriodeErTreig.parameters = {
    msw: {
        handlers: [
            rest.get(`${sykefraværsstatistikkPath}/${publiseringsinfoPath}`, async (req, res, ctx) => {
                await sleep(5000)
                return res(
                    ctx.json(gjeldendePeriodePubliseringsinfo)
                );
            }),
        ],
    },
};

function sleep(timeMs: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs)
    })
}
