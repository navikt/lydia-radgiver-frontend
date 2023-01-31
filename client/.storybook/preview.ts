import { initialize, mswDecorator } from "msw-storybook-addon";
import { NavFarger } from "../src/styling/farger";
import { rest } from "msw";
import { brukerMedVeldigLangtNavn } from "../src/Pages/Prioritering/mocks/innloggetAnsattMock";
import { gjeldendePeriodePath, siste4kvartalerPath, sykefraværsstatistikkPath } from "../src/api/lydia-api";
import {
    gjeldendePeriodeSiste4Kvartal,
    sykefraværsstatistikkSisteKvartalMock,
    virksomhetsstatistikkSiste4KvartalerMock
} from "../src/Pages/Prioritering/mocks/sykefraværsstatistikkMock";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
        default: 'canvasBackground',
        values: [
            {
                name: 'canvasBackground',
                value: NavFarger.canvasBackground,
            },
            {
                name: 'white',
                value: NavFarger.white,
            },
            {
                name: 'limegreen-500',
                value: '#A2AD00',
            },
            {
                name: 'limegreen-50',
                value: '#FDFFE6',
            },
            {
                name: 'light',
                value: '#F8F8F8',
            },
            {
                name: 'dark',
                value: '#333333',
            },
        ]
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    msw: { // Handlers to be applied in every story, see https://github.com/mswjs/msw-storybook-addon/tree/d64eb49bf6bb190d25d7c86a2751386068dbda54#advanced-usage
        handlers: {
            innloggetAnsatt: [
                rest.get('/innloggetAnsatt', (req, res, ctx) => {
                    return res(ctx.json(brukerMedVeldigLangtNavn));
                }),
            ],
            sykefraværsstatistikkSisteKvartal: [
                rest.get(`${sykefraværsstatistikkPath}/:orgnummer/sistetilgjengeligekvartal`, (req, res, ctx) => {
                    return res(
                        ctx.json(sykefraværsstatistikkSisteKvartalMock[0])
                    );
                }),
            ],
            sykefraværsstatistikkSiste4Kvartal: [
                rest.get(`${sykefraværsstatistikkPath}/:orgnummer/${siste4kvartalerPath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(virksomhetsstatistikkSiste4KvartalerMock[0])
                    );
                }),
            ],
            gjeldendePeriodeSiste4Kvartal: [
                rest.get(`${sykefraværsstatistikkPath}/${gjeldendePeriodePath}`, (req, res, ctx) => {
                    return res(
                        ctx.json(gjeldendePeriodeSiste4Kvartal)
                    );
                }),
            ],
        }
    }
};

// Initialize MSW (mock service worker)
initialize({
    serviceWorker: {
        url:
            process.env.NODE_ENV === "production"
                ? "/lydia-radgiver-frontend/mockServiceWorker.js"
                : "./mockServiceWorker.js",
    },
});

// Provide the MSW addon decorator globally
export const decorators = [mswDecorator];
