import { Button, Dropdown } from "@navikt/ds-react";
import React from "react";
import {
    flyttBehovsvurdering,
    useHentIaProsesser,
    useHentKartlegginger,
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";

interface Props {
    iaSak: IASak;
    behovsvurdering: IASakKartlegging;
    dropdownSize?: "small" | "medium" | "xsmall" | undefined;
}

export const FlyttTilAnnenProsess = ({
    iaSak,
    behovsvurdering,
    dropdownSize,
}: Props) => {
    const { data: iaProsesser } = useHentIaProsesser(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const { mutate: muterKartlegginger } = useHentKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const prosessKnyttetTilBehovsvurdering =
        iaProsesser &&
        iaProsesser.find((prosess) => prosess.id === behovsvurdering.prosessId);

    const flyttTilValgtProsess = (flyttTilProsess: number) => {
        flyttBehovsvurdering(
            iaSak.orgnr,
            iaSak.saksnummer,
            flyttTilProsess,
            behovsvurdering.kartleggingId,
        ).then(() => muterKartlegginger?.());
    };

    return (
        <>
            {iaProsesser && (
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
                            {iaProsesser
                                .filter(
                                    (prosess) =>
                                        prosess.id !==
                                        prosessKnyttetTilBehovsvurdering?.id,
                                )
                                .map((prosess) => (
                                    <Dropdown.Menu.GroupedList.Item
                                        onClick={() =>
                                            flyttTilValgtProsess(prosess.id)
                                        }
                                        key={prosess.id}
                                    >
                                        {prosess.navn}
                                    </Dropdown.Menu.GroupedList.Item>
                                ))}
                        </Dropdown.Menu.GroupedList>
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </>
    );
};
