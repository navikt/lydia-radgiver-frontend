import { Meta, StoryObj } from "@storybook/react";
import { IngenAktivitetInfo } from "./IngenAktivitetInfo";
import {
    iaSakIngenAktivitetPåOverEtKvartal,
    iaSakKontaktes,
} from "../../../mocks/iaSakMock";

const meta = {
    title: "Virksomhet/Virksomhetsoversikt/Infoboks: Ingen aktivitet på sak",
    component: IngenAktivitetInfo,
} satisfies Meta<typeof IngenAktivitetInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    args: {
        sak: iaSakIngenAktivitetPåOverEtKvartal,
    },
};

export const InniContainer: Story = {
    args: { ...Hovedstory.args },
    decorators: [
        (Story) => (
            <div
                style={{
                    background: "white",
                    display: "flex",
                    border: "1px solid black",
                    width: "18.75rem",
                    padding: "1rem",
                }}
            >
                <Story />
            </div>
        ),
    ],
};

export const VisesIkkeNårSakHarNyeEndringer: Story = {
    args: {
        sak: iaSakKontaktes,
    },
};
