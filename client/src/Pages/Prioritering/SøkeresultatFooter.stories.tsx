import {ComponentMeta} from "@storybook/react";
import {SøkeresultatFooter} from "./SøkeresultatFooter";
import {useEffect, useState} from "react";
import {ANTALL_RESULTATER_PER_SIDE} from "./Prioriteringsside";

export default {
    title: "Prioritering/SøkeresultatFooter",
    component: SøkeresultatFooter,
} as ComponentMeta<typeof SøkeresultatFooter>;

export const Hovedstory = () => {
    const [side, setSide] = useState(1);
    const antallTreffPåSide = side === 10 ? 10 : ANTALL_RESULTATER_PER_SIDE;

    const endreSide = (side: number) => {
        setSide(side)
    }

    return <SøkeresultatFooter side={side} endreSide={endreSide} antallTreffPåSide={antallTreffPåSide}
                               totaltAntallTreff={518}/>
}

export const MedSpinner = () => {
    const [side, setSide] = useState(1);
    const antallTreffPåSide = side === 10 ? 10 : ANTALL_RESULTATER_PER_SIDE;

    const endreSide = (side: number) => {
        setSide(side)
    }

    return <SøkeresultatFooter side={side} endreSide={endreSide} antallTreffPåSide={antallTreffPåSide} />
}

export const TreffKommerEtterHvert = () => {
    const [side, setSide] = useState(1);
    const [antallTreff, setAntallTreff] = useState<number>()
    const antallTreffPåSide = side === 10 ? 10 : ANTALL_RESULTATER_PER_SIDE;

    const endreSide = (side: number) => {
        setSide(side)
    }

    useEffect(() => {
        setTimeout(() => {setAntallTreff(518)}, 3000)
    }, [])
    return <SøkeresultatFooter side={side} endreSide={endreSide} antallTreffPåSide={antallTreffPåSide} totaltAntallTreff={antallTreff}/>
}