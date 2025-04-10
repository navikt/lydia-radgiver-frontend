import { Meta } from "@storybook/react";
import { IAProsessStatusBadge } from "./IAProsessStatusBadge";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "../../domenetyper/domenetyper";

export default {
    title: "Prioritering/StatusBadge",
    component: IAProsessStatusBadge,
} as Meta<typeof IAProsessStatusBadge>;

const statuser = [
    IAProsessStatusEnum.enum.NY,
    IAProsessStatusEnum.enum.IKKE_AKTIV,
    IAProsessStatusEnum.enum.VURDERES,
    IAProsessStatusEnum.enum.KONTAKTES,
    IAProsessStatusEnum.enum.KARTLEGGES,
    IAProsessStatusEnum.enum.VI_BISTÅR,
    IAProsessStatusEnum.enum.IKKE_AKTUELL,
    IAProsessStatusEnum.enum.FULLFØRT,
    IAProsessStatusEnum.enum.SLETTET,
];

export const Hovedstory = () =>
    statuser.map((status) => <Story status={status} key={status} />);

interface Props {
    status: IAProsessStatusType;
}

const Story = ({ status }: Props) => (
    <div>
        <p>{`${status}: `}</p>
        <IAProsessStatusBadge status={status} />
    </div>
);
