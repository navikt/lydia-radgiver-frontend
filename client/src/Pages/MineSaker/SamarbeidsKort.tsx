import { IASak } from "../../domenetyper/domenetyper";
import {
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../domenetyper/iaSakProsess";
import { useState } from "react";
import { Chips, VStack } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { SamarbeidsInnhold } from "./SamarbeidsInnhold";

export const SamarbeidsKort = ({
    iaSak,
    alleSamarbeid,
    gåTilSakUrl,
}: {
    iaSak: IASak;
    alleSamarbeid: IaSakProsess[];
    gåTilSakUrl: string;
}) => {
    const [valgtSamarbeid, setValgtSamarbeid] = useState<IaSakProsess>(
        alleSamarbeid[0],
    );
    return (
        valgtSamarbeid && (
            <VStack gap="4" width={"100%"}>
                <>
                    {erIDev && (
                        <Chips>
                            {alleSamarbeid.map((samarbeid) => (
                                <Chips.Toggle
                                    key={samarbeid.id}
                                    selected={
                                        samarbeid.id === valgtSamarbeid?.id
                                    }
                                    onClick={() => setValgtSamarbeid(samarbeid)}
                                >
                                    {defaultNavnHvisTomt(samarbeid.navn)}
                                </Chips.Toggle>
                            ))}
                        </Chips>
                    )}
                </>
                <SamarbeidsInnhold
                    iaSak={iaSak}
                    gåTilSakUrl={gåTilSakUrl}
                    iaSamarbeid={valgtSamarbeid}
                />
            </VStack>
        )
    );
};
