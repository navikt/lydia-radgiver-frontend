import { Button, Dropdown } from "@navikt/ds-react";
import React from "react";
import {
    flyttBehovsvurdering,
    useHentBehovsvurderingerMedProsess,
    useHentSamarbeid,
} from "../../../api/lydia-api";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

interface Props {
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
    behovsvurdering: IASakKartlegging;
    dropdownSize?: "small" | "medium" | "xsmall" | undefined;
}

export const FlyttTilAnnenProsess = ({
    iaSak,
    gjeldendeSamarbeid,
    behovsvurdering,
    dropdownSize,
}: Props) => {
    const { data: alleSamarbeid } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { mutate: muterKartlegginger } = useHentBehovsvurderingerMedProsess(
        iaSak.orgnr,
        iaSak.saksnummer,
        gjeldendeSamarbeid.id,
    );

    const flyttTilValgtSamarbeid = (samarbeidId: number) => {
        flyttBehovsvurdering(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeidId,
            behovsvurdering.kartleggingId,
        ).then(() => muterKartlegginger?.());
    };

    return (
        <>
            {gjeldendeSamarbeid &&
                alleSamarbeid &&
                alleSamarbeid.length > 1 && (
                    <Dropdown>
                        <Button
                            as={Dropdown.Toggle}
                            variant={"tertiary"}
                            size={dropdownSize}
                        >
                            Endre samarbeid
                        </Button>
                        <Dropdown.Menu>
                            <Dropdown.Menu.GroupedList>
                                <Dropdown.Menu.GroupedList.Heading>
                                    Flytt behovsvurdering til:
                                </Dropdown.Menu.GroupedList.Heading>
                                {alleSamarbeid
                                    .filter(
                                        (samarbeid) =>
                                            samarbeid.id !==
                                            gjeldendeSamarbeid.id,
                                    )
                                    .map((samarbeid) => (
                                        <Dropdown.Menu.GroupedList.Item
                                            onClick={() =>
                                                flyttTilValgtSamarbeid(
                                                    samarbeid.id,
                                                )
                                            }
                                            key={samarbeid.id}
                                        >
                                            {samarbeid.navn ||
                                                "Samarbeid uten navn"}
                                        </Dropdown.Menu.GroupedList.Item>
                                    ))}
                            </Dropdown.Menu.GroupedList>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
        </>
    );
};
