import { ComponentMeta } from "@storybook/react";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { virksomhetMock } from "../../Prioritering/mocks/virksomhetMock";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Informasjon om en virksomhet",
    component: VirksomhetInformasjon,
} as ComponentMeta<typeof VirksomhetInformasjon>;

export const Header = () => (
    <VirksomhetInformasjon virksomhet={virksomhetMock} />
);
