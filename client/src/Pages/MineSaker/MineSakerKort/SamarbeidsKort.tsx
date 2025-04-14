import { IASak } from "../../../domenetyper/domenetyper";
import {
    IaSakProsess,
} from "../../../domenetyper/iaSakProsess";
import { useState } from "react";
import { VStack } from "@navikt/ds-react";
import { SamarbeidsInnhold } from "./SamarbeidsInnhold";
import { Samarbeidsvelger } from "./Samarbeidsvelger";

export const SamarbeidsKort = ({
    iaSak,
    alleSamarbeid,
}: {
    iaSak: IASak;
    alleSamarbeid: IaSakProsess[];
}) => {
    const sorterteSamarbeid = alleSamarbeid.reduce(splitSamarbeid, { aktive: [], avsluttede: [] });

    const [valgtSamarbeid, setValgtSamarbeid] = useState<IaSakProsess>(
        sorterteSamarbeid.aktive[0],
    );
    return (
        <VStack gap="4" width={"100%"}>
            <Samarbeidsvelger
                sorterteSamarbeid={sorterteSamarbeid}
                valgtSamarbeid={valgtSamarbeid}
                setValgtSamarbeid={setValgtSamarbeid}
                iaSak={iaSak}
            />
            {valgtSamarbeid && <SamarbeidsInnhold iaSak={iaSak} iaSamarbeid={valgtSamarbeid} />}
        </VStack>
    );
};

export interface SplittedeSamarbeid {
    aktive: IaSakProsess[];
    avsluttede: IaSakProsess[];
}

function splitSamarbeid(acc: SplittedeSamarbeid, samarbeid: IaSakProsess): SplittedeSamarbeid {
    if (samarbeid.status === "AKTIV") {
        acc.aktive.push(samarbeid);
    } else {
        acc.avsluttede.push(samarbeid);
    }
    return acc;
}