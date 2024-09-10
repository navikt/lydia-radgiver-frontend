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
    const { iaSak, gjeldendeSamarbeid, alleSamarbeid } = useSamarbeidsContext();

    const { mutate: muterKartlegginger } = useHentNyeKartlegginger(
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
            {gjeldendeSamarbeid && alleSamarbeid.length > 1 && (
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
                                        samarbeid.id !== gjeldendeSamarbeid.id,
                                )
                                .map((samarbeid) => (
                                    <Dropdown.Menu.GroupedList.Item
                                        onClick={() =>
                                            flyttTilValgtSamarbeid(samarbeid.id)
                                        }
                                        key={samarbeid.id}
                                    >
                                        {samarbeid.navn}
                                    </Dropdown.Menu.GroupedList.Item>
                                ))}
                        </Dropdown.Menu.GroupedList>
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </>
    );
};
