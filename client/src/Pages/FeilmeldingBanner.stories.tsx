import { Button } from "@navikt/ds-react";
import { ComponentMeta } from "@storybook/react";
import { FeilmeldingBanner, dispatchFeilmelding } from "./FeilmeldingBanner";

export default {
    title: "FeilmeldingBanner",
    component: FeilmeldingBanner,
} as ComponentMeta<typeof FeilmeldingBanner>;

export const Story = () => (
    <>
        <FeilmeldingBanner />
        <Button
            onClick={() => {
                dispatchFeilmelding({ feilmelding: "Det har skjedd en feil" });
            }}
        >
            Trigg feilmelding
        </Button>
    </>
);
