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
} from "@navikt/ds-react";
import { ArrowRightIcon, ChevronDownIcon } from "@navikt/aksel-icons";
import { AdministrerIaProsesserKnapp } from "./AdministrerIaProsesserKnapp";
import React, { useState } from "react";
import { EndreSamarbeidModal } from "./EndreSamarbeidModal";
import styled from "styled-components";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const DropdownContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
`;

const DropdownMenuContainer = styled.div`
    padding: 1rem;
`;

const SomethingContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
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
                        disabled={iaSak === undefined}
                    >
                        Samarbeid
                    </Button>

                    <DropdownMenuContainer>
                        {iaSak && alleSamarbeid && (
                            <Dropdown.Menu
                                placement={"top-start"}
                                style={{ width: "32rem" }}
                            >
                                <SomethingContainer>
                                    <Heading
                                        as={Link}
                                        level={"4"}
                                        href={`/virksomhet/${iaSak.orgnr}`}
                                        variant={"neutral"}
                                        title="Gå til virksomhet"
                                        size={"medium"}
                                        style={{ marginBottom: "2rem" }}
                                    >
                                        <>
                                            {virksomhet.navn}
                                            <ArrowRightIcon />
                                        </>
                                    </Heading>
                                    {alleSamarbeid.length === 0 && (
                                        <>
                                            <Heading size={"small"} level={"2"}>
                                                Ingen aktive samarbeid
                                            </Heading>
                                            <BodyShort>
                                                Du kan opprette og administrere
                                                samarbeid når saken er i{" "}
                                                <i>Kartlegges</i>.
                                            </BodyShort>
                                        </>
                                    )}
                                    <>
                                        <Dropdown.Menu.List>
                                            {alleSamarbeid.map((samarbeid) => (
                                                <div key={samarbeid.id}>
                                                    <HStack
                                                        marginInline={"8"}
                                                        width={"90%"}
                                                        align="center"
                                                        justify="space-between"
                                                    >
                                                        <Heading
                                                            variant={"neutral"}
                                                            as={Link}
                                                            level={"4"}
                                                            href={`/virksomhet/${iaSak.orgnr}/sak/${iaSak.saksnummer}/samarbeid/${samarbeid.id}`}
                                                            title="Gå til samarbeid"
                                                            size={"small"}
                                                        >
                                                            <>
                                                                {samarbeid.navn ||
                                                                    "Samarbeid uten navn"}
                                                                <ArrowRightIcon />
                                                            </>
                                                        </Heading>
                                                        <Button
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
                                                    <br />
                                                </div>
                                            ))}
                                        </Dropdown.Menu.List>

                                        <OpprettKnappWrapper>
                                            <AdministrerIaProsesserKnapp
                                                alleSamarbeid={alleSamarbeid}
                                                iaSak={iaSak}
                                                brukerErEierAvSak={
                                                    brukerErEierAvSak
                                                }
                                            />
                                        </OpprettKnappWrapper>
                                    </>
                                </SomethingContainer>
                            </Dropdown.Menu>
                        )}
                    </DropdownMenuContainer>
                </Dropdown>
            </DropdownContainer>
            {valgtSamarbeid && (
                <EndreSamarbeidModal
                    samarbeid={valgtSamarbeid}
                    open={isEndreSamarbeidModalÅpen}
                    setOpen={setEndreSamarbeidModalÅpen}
                />
            )}
        </>
    );
}
