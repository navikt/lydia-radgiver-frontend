import {ComponentMeta} from "@storybook/react";
import {StatusBadge} from "./StatusBadge";
import {IAProsessStatusEnum, IAProsessStatusType} from "../../domenetyper";

export default {
    title: "Prioritering/StatusBadge",
    component: StatusBadge,
} as ComponentMeta<typeof StatusBadge>;

export const Hovedstory = () => (
    [
        <Story key={1} status={IAProsessStatusEnum.enum.IKKE_AKTIV} />,
        <Story key={2} status={IAProsessStatusEnum.enum.VURDERES} />,
        <Story key={3} status={IAProsessStatusEnum.enum.KONTAKTES} />,
        <Story key={4} status={IAProsessStatusEnum.enum.IKKE_AKTUELL} />,
    ]
);

const Story = ({ status }: { status: IAProsessStatusType}) => (<div>
    <p>{`${status}: `}</p>
    <StatusBadge status={status} />
</div>)
