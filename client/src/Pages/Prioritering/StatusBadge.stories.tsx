import {ComponentMeta} from "@storybook/react";
import {StatusBadge} from "./StatusBadge";
import {IAProsessStatusEnum, IAProsessStatusType} from "../../domenetyper";

export default {
    title: "Prioritering/StatusBadge",
    component: StatusBadge,
} as ComponentMeta<typeof StatusBadge>;

const statuser = [
    IAProsessStatusEnum.enum.IKKE_AKTIV,
    IAProsessStatusEnum.enum.VURDERES,
    IAProsessStatusEnum.enum.KONTAKTES,
    IAProsessStatusEnum.enum.IKKE_AKTUELL
]

export const Hovedstory = () => (
    statuser.map((status, idx) =>
        <Story status={status} key={idx} />
    )
);

const Story = ({ status }: { status: IAProsessStatusType}) => (<div>
    <p>{`${status}: `}</p>
    <StatusBadge status={status} />
</div>)
