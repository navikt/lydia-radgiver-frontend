import { Button, Dropdown } from "@navikt/ds-react";
import React from "react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    IaSakProsess,
} from "../../../domenetyper/iaSakProsess";
import { useSpørreundersøkelse } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";

interface Props {
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
    dropdownSize?: "small" | "medium" | "xsmall" | undefined;
    flyttTilValgtSamarbeid: (samarbeidId: number) => void;
}

export const FlyttTilAnnenProsess = ({
    iaSak,
    gjeldendeSamarbeid,
    dropdownSize,
    flyttTilValgtSamarbeid,
}: Props) => {
    const { data: alleSamarbeid } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const { spørreundersøkelseType } = useSpørreundersøkelse();

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
                                    Flytt{" "}
                                    {spørreundersøkelseType.toLocaleLowerCase()}{" "}
                                    til:
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
