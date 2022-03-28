import {ComponentMeta} from "@storybook/react";
import {StatusBadge} from "./StatusBadge";
import {IAProsessStatusType} from "../../domenetyper";

export default {
    title: "StatusBadge",
    component: StatusBadge,
} as ComponentMeta<typeof StatusBadge>;

export const Hovedstory = () => (
    [
        <Story key={1} status={"IKKE_AKTIV"} />,
        <Story key={2} status={"NY"} />,
        <Story key={3} status={"AVSLUTTET"} />,
        <Story key={4} status={"EVALUERING"} />,
        <Story key={5} status={"GJENNOMFORING"} />,
        <Story key={6} status={"KARTLEGGING"} />,
        <Story key={7} status={"TAKKET_NEI"} />,
        <Story key={8} status={"AVSLATT_AV_NALS"} />,
        <Story key={9} status={"PRIORITERT"} />,
    ]
);

const Story = ({ status }: { status: IAProsessStatusType}) => (<div>
    <p>{`${status}: `}</p>
    <StatusBadge status={status} />
</div>)
