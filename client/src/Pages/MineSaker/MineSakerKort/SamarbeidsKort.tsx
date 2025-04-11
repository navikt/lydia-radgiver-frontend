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
    const [valgtSamarbeid, setValgtSamarbeid] = useState<IaSakProsess>(
        alleSamarbeid[0],
    );
    return (
        valgtSamarbeid && (
            <VStack gap="4" width={"100%"}>
                <Samarbeidsvelger
                    alleSamarbeid={alleSamarbeid}
                    valgtSamarbeid={valgtSamarbeid}
                    setValgtSamarbeid={setValgtSamarbeid}
                />
                <SamarbeidsInnhold iaSak={iaSak} iaSamarbeid={valgtSamarbeid} />
            </VStack>
        )
    );
};

