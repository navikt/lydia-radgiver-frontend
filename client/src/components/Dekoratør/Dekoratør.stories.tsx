import { Meta } from "@storybook/react";
import { Dekoratør } from "./Dekoratør";
import { http, HttpResponse } from "msw";
import { virksomhetAutocompletePath } from "../../api/lydia-api";
import { virksomhetAutocompleteMock } from "../../Pages/Prioritering/mocks/virksomhetMock";
import {
    brukerMedGyldigToken,
    brukerMedTokenSomHolderPåÅLøpeUt
} from "../../Pages/Prioritering/mocks/innloggetAnsattMock";

export default {
    title: "Dekoratør",
    component: Dekoratør,
} as Meta<typeof Dekoratør>;

export const Autentisert = () => (
    <div>
        <Dekoratør brukerInformasjon={brukerMedGyldigToken} />
    </div>
)

Autentisert.parameters = {
    msw: {
        handlers: [
            http.get(`${virksomhetAutocompletePath}`, ({ request }) => {
                const url = new URL(request.url);
                const søketekst = url.searchParams.get("q")
                return HttpResponse.json(søketekst === null
                    ? []
                    : virksomhetAutocompleteMock
                        .filter(virksomhet => virksomhet.navn.startsWith(søketekst)
                            || virksomhet.orgnr.startsWith(søketekst)
                        ));
            }),
        ]
    },
};

export const IkkeAutentisert = () => <Dekoratør brukerInformasjon={brukerMedTokenSomHolderPåÅLøpeUt} />
