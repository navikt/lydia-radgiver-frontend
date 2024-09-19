import { IASak } from "../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import {
    useHentBrukerinformasjon,
    useHentSamarbeid,
} from "../../../api/lydia-api";
import {
    BodyShort,
    Button,
    Dropdown,
    Heading,
    HStack,
    Link,
    VStack,
} from "@navikt/ds-react";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import React, { useState } from "react";
import { EndreSamarbeidModal } from "./EndreSamarbeidModal";
import styled from "styled-components";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { NyttSamarbeidModal } from "./NyttSamarbeidModal";

const DropdownContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
`;

const DropdownMenuContainer = styled.div`
    padding: 1rem;
`;

const OpprettKnappWrapper = styled.div`
    display: flex;
    align-self: center;
    margin-top: 2rem;
`;

export function SamarbeidsDropdown({
    virksomhet,
    iaSak,
}: {
    iaSak: IASak | undefined;
    virksomhet: Virksomhet;
}) {
    const { data: alleSamarbeid, mutate: hentSamarbeidPåNytt } =
        useHentSamarbeid(iaSak?.orgnr, iaSak?.saksnummer);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const [isEndreSamarbeidModalÅpen, setEndreSamarbeidModalÅpen] =
        useState(false);
    const [nyttSamarbeidModalÅpen, setNyttSamarbeidModalÅpen] = useState(false);
    const [valgtSamarbeid, setValgtSamarbeid] = useState<IaSakProsess | null>(
        null,
    );

    return (
        <>
            <DropdownContainer>
                <Dropdown>
                    <Button
                        as={Dropdown.Toggle}
                        icon={<ChevronDownIcon />}
                        onClick={() => hentSamarbeidPåNytt()}
                        iconPosition={"right"}
                        variant={"primary-neutral"}
                        size={"small"}
                    >
                        Samarbeid
                    </Button>

                    <DropdownMenuContainer>
                        {
                            <Dropdown.Menu
                                placement={"top-start"}
                                style={{ width: "32rem" }}
                            >
                                <Heading
                                    as={Link}
                                    level={"4"}
                                    href={`/virksomhet/${virksomhet.orgnr}`}
                                    variant={"neutral"}
                                    title="Gå til virksomhet"
                                    size={"medium"}
                                    style={{ marginBottom: "2rem" }}
                                >
                                    {virksomhet.navn}
                                </Heading>
                                {(alleSamarbeid === undefined ||
                                    alleSamarbeid?.length === 0) && (
                                    <>
                                        <Heading size={"small"} level={"2"}>
                                            Ingen aktive samarbeid
                                        </Heading>
                                        <BodyShort>
                                            Du kan opprette og administrere
                                            samarbeid når saken er i status{" "}
                                            <i>Kartlegges</i> eller{" "}
                                            <i>Vi bistår</i>.
                                        </BodyShort>
                                    </>
                                )}
                                {iaSak && alleSamarbeid && (
                                    <>
                                        <Dropdown.Menu.List>
                                            <VStack gap={"3"}>
                                                {alleSamarbeid.map(
                                                    (samarbeid) => (
                                                        <HStack
                                                            marginInline={"8"}
                                                            align="center"
                                                            justify="space-between"
                                                            key={samarbeid.id}
                                                        >
                                                            <Dropdown.Menu.List.Item
                                                                as={"a"}
                                                                href={`/virksomhet/${iaSak.orgnr}/sak/${iaSak.saksnummer}/samarbeid/${samarbeid.id}`}
                                                                title={
                                                                    "Gå til samarbeid"
                                                                }
                                                            >
                                                                <div>
                                                                    {samarbeid.navn ||
                                                                        "Samarbeid uten navn"}
                                                                </div>
                                                            </Dropdown.Menu.List.Item>
                                                            <Button
                                                                size={"small"}
                                                                onClick={() => {
                                                                    setEndreSamarbeidModalÅpen(
                                                                        true,
                                                                    );
                                                                    setValgtSamarbeid(
                                                                        samarbeid,
                                                                    );
                                                                }}
                                                            >
                                                                Endre
                                                            </Button>
                                                        </HStack>
                                                    ),
                                                )}
                                            </VStack>
                                        </Dropdown.Menu.List>
                                        <br />

                                        <OpprettKnappWrapper>
                                            <Button
                                                variant={"secondary"}
                                                onClick={() =>
                                                    setNyttSamarbeidModalÅpen(
                                                        true,
                                                    )
                                                }
                                            >
                                                Nytt samarbeid
                                            </Button>
                                        </OpprettKnappWrapper>
                                    </>
                                )}
                            </Dropdown.Menu>
                        }
                    </DropdownMenuContainer>
                </Dropdown>
            </DropdownContainer>

            {iaSak && brukerErEierAvSak && (
                <NyttSamarbeidModal
                    iaSak={iaSak}
                    åpen={nyttSamarbeidModalÅpen}
                    setÅpen={setNyttSamarbeidModalÅpen}
                />
            )}

            {valgtSamarbeid && iaSak && (
                <EndreSamarbeidModal
                    samarbeid={valgtSamarbeid}
                    iaSak={iaSak}
                    open={isEndreSamarbeidModalÅpen}
                    setOpen={setEndreSamarbeidModalÅpen}
                />
            )}
        </>
    );
}
