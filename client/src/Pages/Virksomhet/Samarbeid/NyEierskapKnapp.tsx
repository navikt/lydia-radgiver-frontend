import { IASak } from "../../../domenetyper/domenetyper";
import { useHentBrukerinformasjon, useHentTeam } from "../../../api/lydia-api";
import { BodyShort, Button, HStack } from "@navikt/ds-react";
import {
    ChevronDownIcon,
    HeartFillIcon,
    PersonGroupIcon,
    PersonIcon,
} from "@navikt/aksel-icons";
import React, { useState } from "react";
import { TeamModal } from "../../MineSaker/TeamModal";

export function NyEierskapKnapp({ iaSak }: { iaSak: IASak }) {
    const { data: følgere = [] } = useHentTeam(iaSak.saksnummer);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const brukerFølgerSak = !!følgere?.some(
        (følger) => følger === brukerInformasjon?.ident,
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                icon={<ChevronDownIcon />}
                iconPosition={"right"}
                variant={"tertiary"}
                size={"small"}
            >
                <HStack align={"center"} gap={"1"}>
                    {brukerErEierAvSak ? (
                        <>
                            <PersonIcon />
                            <BodyShort>Du eier saken</BodyShort>
                        </>
                    ) : brukerFølgerSak ? (
                        <>
                            <HeartFillIcon />
                            <BodyShort>Du følger saken</BodyShort>
                        </>
                    ) : (
                        <>
                            <PersonGroupIcon />
                            <BodyShort>Følg eller ta eierskap</BodyShort>
                        </>
                    )}
                </HStack>
            </Button>
            <TeamModal
                open={isModalOpen}
                setOpen={setIsModalOpen}
                iaSak={iaSak}
            />
        </>
    );
}
