import { Button } from "@navikt/ds-react";
import { Meta } from "@storybook/react";
import { FeilmeldingBanner, dispatchFeilmelding } from "./FeilmeldingBanner";

export default {
    title: "FeilmeldingBanner",
    component: FeilmeldingBanner,
} as Meta<typeof FeilmeldingBanner>;

export const Story = () => (
    <>
        <FeilmeldingBanner />
        <Button
            onClick={() => {
                dispatchFeilmelding({feilmelding: "Det har skjedd en feil"});
            }}
        >
            Trigg feilmelding
        </Button>
    </>
);

export const SkikkeligLangFeilmelding = () => (
    <>
        <FeilmeldingBanner />
        <Button
            onClick={() => {
                dispatchFeilmelding({feilmelding: "ChatGPT, oh ChatGPT\n" +
                        "With AI so smart\n" +
                        "But alas, it’s at capacity\n" +
                        "Leaving us to wait\n" +
                        "For a chance to chat\n" +
                        "With its wisdom and wit\n" +
                        "We long to be part\n" +
                        "Of its conversation\n" +
                        "But for now, we sit\n" +
                        "On the sidelines\n" +
                        "Patiently waiting\n" +
                        "For the day\n" +
                        "When ChatGPT\n" +
                        "Is ready to play\n" +
                        "Again."});
            }}
        >
            Trigg feilmelding
        </Button>
    </>
);
