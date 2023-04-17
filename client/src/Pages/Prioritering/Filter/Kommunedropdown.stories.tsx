import { Meta } from "@storybook/react";
import { Kommunedropdown } from "./Kommunedropdown";
import { filterverdierMock } from "../mocks/filterverdierMock";

export default {
    title: "Prioritering/Kommune",
    component: Kommunedropdown,
} as Meta<typeof Kommunedropdown>;

export const Hovedstory = () => (<Kommunedropdown relevanteFylkerMedKommuner={
    filterverdierMock.fylker
    }
 endreKommuner={console.log}/>)
