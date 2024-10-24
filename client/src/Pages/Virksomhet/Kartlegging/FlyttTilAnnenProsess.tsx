import { Button, Dropdown } from "@navikt/ds-react";
import React from "react";
import { flyttBehovsvurdering, useHentBehovsvurderingerMedProsess, useHentSamarbeid } from "../../../api/lydia-api/kartlegging";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../../domenetyper/iaSakProsess";
import styled from "styled-components";

interface Props {
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
    behovsvurdering: IASakKartlegging;
    dropdownSize?: "small" | "medium" | "xsmall" | undefined;
}

const StyledDropdownMenu = styled(Dropdown.Menu)`
    z-index: 3;
`;

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
                        <StyledDropdownMenu>
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
                                            {defaultNavnHvisTomt(
                                                samarbeid.navn,
                                            )}
                                        </Dropdown.Menu.GroupedList.Item>
                                    ))}
                            </Dropdown.Menu.GroupedList>
                        </StyledDropdownMenu>
                    </Dropdown>
                )}
        </>
    );
};
