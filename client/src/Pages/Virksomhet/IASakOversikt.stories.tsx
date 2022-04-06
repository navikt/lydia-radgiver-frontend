import {ComponentMeta} from "@storybook/react";

import {StyledIaSakOversikt} from "./IASakOversikt";
import {IAProsessStatusEnum} from "../../domenetyper";

export default {
    title: "Virksomhet/Oversikt over IA-sak",
    component: StyledIaSakOversikt,
} as ComponentMeta<typeof StyledIaSakOversikt>;

const saksnummer = "IA-01234567890"

export const BrukerHarTakketNei = () => (
    <StyledIaSakOversikt
        saksnummer={saksnummer}
        iaProsessStatus={IAProsessStatusEnum.enum.TAKKET_NEI}
        innsatsteam={false}
    />
);

export const Kartlegges = () => (
    <StyledIaSakOversikt
        saksnummer={saksnummer}
        iaProsessStatus={IAProsessStatusEnum.enum.KARTLEGGING}
        innsatsteam={false}
    />
);

export const KartleggesMedInnsatsteam = () => (
    <StyledIaSakOversikt
        saksnummer={saksnummer}
        iaProsessStatus={IAProsessStatusEnum.enum.KARTLEGGING}
        innsatsteam={true}
    />
);
