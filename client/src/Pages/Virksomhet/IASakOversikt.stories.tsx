import {ComponentMeta} from "@storybook/react";

import {StyledIaSakOversikt} from "./IASakOversikt";
import {IAProsessStatusEnum} from "../../domenetyper";

export default {
    title: "Virksomhet/Oversikt over IA-sak",
    component: StyledIaSakOversikt,
} as ComponentMeta<typeof StyledIaSakOversikt>;

const saksnummer = "IA-01234567890"

export const IkkeAktiv = () => (
    <StyledIaSakOversikt
        saksnummer={saksnummer}
        iaProsessStatus={IAProsessStatusEnum.enum.IKKE_AKTIV}
        innsatsteam={false}
    />
);

export const Vurderes = () => (
    <StyledIaSakOversikt
        saksnummer={saksnummer}
        iaProsessStatus={IAProsessStatusEnum.enum.VURDERES}
        innsatsteam={false}
    />
);

export const Kontaktes = () => (
    <StyledIaSakOversikt
        saksnummer={saksnummer}
        iaProsessStatus={IAProsessStatusEnum.enum.KONTAKTES}
        innsatsteam={false}
    />
);

export const IkkeAktuell = () => (
    <StyledIaSakOversikt
        saksnummer={saksnummer}
        iaProsessStatus={IAProsessStatusEnum.enum.IKKE_AKTUELL}
        innsatsteam={false}
    />
);
