import { IASak } from "../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import {
    useHentBrukerinformasjon,
    useHentIaProsesser,
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
import { AdministrerIaProsesserKnapp } from "../Prosesser/AdministrerIaProsesserKnapp";
import React from "react";

export function SamarbeidsDropdown({
    virksomhet,
    iaSak,
}: {
    iaSak: IASak | undefined;
    virksomhet: Virksomhet;
}) {
    const { data: iaProsesser } = useHentIaProsesser(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;

    return (
        <Dropdown>
            <Button
                as={Dropdown.Toggle}
                icon={<ChevronDownIcon />}
                iconPosition={"right"}
                variant={"primary-neutral"}
                size={"small"}
                disabled={iaSak === undefined}
            >
                Samarbeid
            </Button>

            {iaSak && iaProsesser && (
                <Dropdown.Menu strategy={"fixed"}>
                    <Heading
                        as={Link}
                        level={"4"}
                        href={`/virksomhet/${iaSak.orgnr}`}
                        variant={"neutral"}
                        title="Gå til virksomhet"
                        size={"medium"}
                    >
                        <>
                            {virksomhet.navn}
                            <ArrowRightIcon />
                        </>
                    </Heading>
                    {iaProsesser.length === 0 && (
                        <>
                            <Heading size={"small"} level={"2"}>
                                Ingen aktive samarbeid
                            </Heading>
                            <BodyShort>
                                Du kan opprette og administrere samarbeid når
                                saken er i <i>Kartlegges</i>.
                            </BodyShort>
                        </>
                    )}
                    <>
                        <Dropdown.Menu.List>
                            {iaProsesser.map(({ id, navn }) => (
                                <>
                                    <HStack key={id} marginInline={"8"}>
                                        <Heading
                                            variant={"neutral"}
                                            as={Link}
                                            level={"4"}
                                            href={`/virksomhet/${iaSak.orgnr}/sak/${iaSak.saksnummer}/samarbeid/${id}`}
                                            title="Gå til samarbeid"
                                            size={"small"}
                                        >
                                            <>
                                                {navn !== null
                                                    ? navn
                                                    : "Samarbeid uten navn"}
                                                <ArrowRightIcon />
                                            </>
                                        </Heading>
                                    </HStack>
                                    <br />
                                </>
                            ))}
                        </Dropdown.Menu.List>

                        <AdministrerIaProsesserKnapp
                            iaProsesser={iaProsesser}
                            iaSak={iaSak}
                            brukerErEierAvSak={brukerErEierAvSak}
                        />
                    </>
                </Dropdown.Menu>
            )}
        </Dropdown>
    );
}
