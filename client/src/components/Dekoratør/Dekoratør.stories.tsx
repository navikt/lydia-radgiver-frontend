import { ComponentMeta } from "@storybook/react";
import { Dekoratør } from "./Dekoratør";
import { rest } from "msw";
import { virksomhetAutocompletePath } from "../../api/lydia-api";
import { virksomhetAutocompleteMock } from "../../Pages/Prioritering/mocks/virksomhetMock";
import {
    brukerMedGyldigToken,
    brukerMedTokenSomHolderPåÅLøpeUt
} from "../../Pages/Prioritering/mocks/innloggetAnsattMock";

export default {
    title: "Dekoratør",
    component: Dekoratør,
} as ComponentMeta<typeof Dekoratør>;

export const Autentisert = () => (
    <div data-theme="dark">
        <Dekoratør brukerInformasjon={brukerMedGyldigToken} />
    </div>
)

Autentisert.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${virksomhetAutocompletePath}`, (req, res, ctx) => {
                    const søketekst = req.url.searchParams.get("q")
                    return res(ctx.json(søketekst === null
                        ? []
                        : virksomhetAutocompleteMock
                            .filter(virksomhet => virksomhet.navn.startsWith(søketekst)
                                || virksomhet.orgnr.startsWith(søketekst)
                            )
                    ));
                }),
            ],
        }
    },
};

export const IkkeAutentisert = () => <Dekoratør brukerInformasjon={brukerMedTokenSomHolderPåÅLøpeUt} />
