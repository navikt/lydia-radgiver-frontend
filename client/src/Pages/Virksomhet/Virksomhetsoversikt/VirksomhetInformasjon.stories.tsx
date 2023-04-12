import { Meta } from "@storybook/react";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { virksomhetMock } from "../../Prioritering/mocks/virksomhetMock";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Virksomhetsinformasjon",
    component: VirksomhetInformasjon,
} as Meta<typeof VirksomhetInformasjon>;

export const Hovedstory = () => (
    <VirksomhetInformasjon virksomhet={virksomhetMock} />
);
