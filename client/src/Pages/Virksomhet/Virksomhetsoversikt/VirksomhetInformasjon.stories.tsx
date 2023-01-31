import { ComponentMeta } from "@storybook/react";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { virksomhetMock } from "../../Prioritering/mocks/virksomhetMock";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Virksomhetsinformasjon",
    component: VirksomhetInformasjon,
} as ComponentMeta<typeof VirksomhetInformasjon>;

export const Hovedstory = () => (
    <VirksomhetInformasjon virksomhet={virksomhetMock} />
);
