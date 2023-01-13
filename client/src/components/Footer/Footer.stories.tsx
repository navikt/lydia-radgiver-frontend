import { ComponentMeta } from "@storybook/react";
import { Footer } from "./Footer";
import { rest } from "msw";
import { gjeldendePeriodePath, sykefraværsstatistikkPath } from "../../api/lydia-api";
import { gjeldendePeriodeSiste4Kvartal } from "../../Pages/Prioritering/mocks/sykefraværsstatistikkMock";

export default {
    title: "Footer",
    component: Footer,
} as ComponentMeta<typeof Footer>;

export const Hovedstory = () => (
    <div>
        <Footer />
    </div>
)

Hovedstory.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(gjeldendePeriodeSiste4Kvartal)
                    );
                }),
            ],
        }
    },
};

export const HentGjeldendePeriodeErTreig = () => (
    <div>
        <Footer />
    </div>
)

HentGjeldendePeriodeErTreig.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`, async (req, res, ctx) => {
                    await sleep(5000)
                    return res(
                        ctx.json(gjeldendePeriodeSiste4Kvartal)
                    );
                }),
            ],
        }
    },
};

function sleep(timeMs: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs)
    })
}
