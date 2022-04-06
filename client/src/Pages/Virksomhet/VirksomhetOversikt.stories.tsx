import {ComponentMeta} from "@storybook/react";
import {virksomhetMock} from "../Prioritering/mocks/virksomhetMock";
import {VirksomhetOversikt} from "./VirksomhetOversikt";
import {sykefraværsstatistikkMock} from "../Prioritering/mocks/sykefraværsstatistikkMock";

export default {
    title: "VirksomhetOversikt",
    component: VirksomhetOversikt,
} as ComponentMeta<typeof VirksomhetOversikt>;

export const Header = () => (
    <VirksomhetOversikt
        virksomhet={virksomhetMock}
        sykefraværsstatistikk={sykefraværsstatistikkMock[0]}
    />
);
