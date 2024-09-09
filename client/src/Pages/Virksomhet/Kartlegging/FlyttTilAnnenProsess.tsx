import { Button, Dropdown } from "@navikt/ds-react";
import React from "react";
import {
    flyttBehovsvurdering,
    useHentNyeKartlegginger,
} from "../../../api/lydia-api";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { useSamarbeidsContext } from "../Samarbeid/SamarbeidsContext";

interface Props {
    behovsvurdering: IASakKartlegging;
    dropdownSize?: "small" | "medium" | "xsmall" | undefined;
}

export const FlyttTilAnnenProsess = ({
    behovsvurdering,
    dropdownSize,
}: Props) => {
    const { iaSak, iaProsesser, gjeldendeProsessId } = useSamarbeidsContext();

    const { mutate: muterKartlegginger } = useHentNyeKartlegginger(
        iaSak.orgnr,
        iaSak.saksnummer,
        gjeldendeProsessId,
    );

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
                                        prosess.id !== gjeldendeProsessId,
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
