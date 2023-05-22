import { Meta, StoryObj } from "@storybook/react";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { virksomhetMock } from "../../Prioritering/mocks/virksomhetMock";

const meta = {
    title: "Virksomhet/Virksomhetsoversikt/Virksomhetsinformasjon",
    component: VirksomhetInformasjon,
} satisfies Meta<typeof VirksomhetInformasjon>;

export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        virksomhet: virksomhetMock,
    },
}
