import { Meta, StoryObj } from "@storybook/react";
import { BegrunnelseModal } from "./BegrunnelseModal";
import { ikkeAktuellHendelseMock } from "../../mocks/iaSakMock";

const meta = {
    title: "Virksomhet/Virksomhetsoversikt/Modal: begrunnelse for 'Ikke aktuell'",
    component: BegrunnelseModal,
} satisfies Meta<typeof BegrunnelseModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    args: {
        hendelse: ikkeAktuellHendelseMock,
        åpen: true,
        lagre: () => {
            return;
        },
        onClose: () => {
            return;
        },
    },
};
