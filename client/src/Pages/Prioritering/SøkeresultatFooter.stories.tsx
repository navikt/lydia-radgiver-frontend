import { useEffect, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { SøkeresultatFooter } from "./SøkeresultatFooter";
import { ANTALL_RESULTATER_PER_SIDE } from "./Prioriteringsside";

export default {
    title: "Prioritering/SøkeresultatFooter",
    component: SøkeresultatFooter,
} as Meta<typeof SøkeresultatFooter>;

interface Props {
    side: number;
    endreSide: (side: number) => void;
    antallTreffPåSide: number;
    totaltAntallTreff?: number;
}

const Template: StoryFn<typeof SøkeresultatFooter> = ({totaltAntallTreff}: Props) => {
    const [side, setSide] = useState(1);
    const antallTreffPåSide = side === 10 ? 10 : ANTALL_RESULTATER_PER_SIDE;

    const endreSide = (side: number) => {
        setSide(side)
    }

    return <SøkeresultatFooter side={side} endreSide={endreSide} antallTreffPåSide={antallTreffPåSide}
                               totaltAntallTreff={totaltAntallTreff} />
}

export const Hovedstory = Template.bind({});
Hovedstory.args = {totaltAntallTreff: 910};

export const MedSpinner = Template.bind({});
MedSpinner.args = {totaltAntallTreff: undefined}

export const TreffKommerEtterHvert = () => {
    const [side, setSide] = useState(1);
    const [antallTreff, setAntallTreff] = useState<number>()
    const antallTreffPåSide = side === 10 ? 10 : ANTALL_RESULTATER_PER_SIDE;

    const endreSide = (side: number) => {
        setSide(side)
    }

    useEffect(() => {
        setTimeout(() => {
            setAntallTreff(910)
        }, 3000)
    }, [])

    return (
        <SøkeresultatFooter
            side={side}
            endreSide={endreSide}
            antallTreffPåSide={antallTreffPåSide}
            totaltAntallTreff={antallTreff}
        />
    )
}