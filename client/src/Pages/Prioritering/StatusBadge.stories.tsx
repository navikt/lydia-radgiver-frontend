import {ComponentMeta} from "@storybook/react";
import {StatusBadge} from "./StatusBadge";
import {IAProsessStatusType} from "../../domenetyper";

export default {
    title: "Prioritering/StatusBadge",
    component: StatusBadge,
} as ComponentMeta<typeof StatusBadge>;

export const Hovedstory = () => (
    [
        <Story key={1} status={"IKKE_AKTIV"} />,
        <Story key={2} status={"VURDERES"} />,
        <Story key={3} status={"KONTAKTES"} />,
        <Story key={4} status={"IKKE_AKTUELL"} />,
    ]
);

const Story = ({ status }: { status: IAProsessStatusType}) => (<div>
    <p>{`${status}: `}</p>
    <StatusBadge status={status} />
</div>)
