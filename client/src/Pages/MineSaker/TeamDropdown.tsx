import { BodyShort, Button, HStack, Dropdown, Heading } from "@navikt/ds-react";
import {
    ChevronDownIcon,
    HeartFillIcon,
    PersonFillIcon,
    PersonGroupIcon,
} from "@navikt/aksel-icons";
import { useHentBrukerinformasjon } from "../../api/lydia-api/bruker";
import { IASak } from "../../domenetyper/domenetyper";
import TeamInnhold, { ReadOnlyTeamInnhold } from "./TeamInnhold";
import { useHentTeam } from "../../api/lydia-api/team";
import { useErPåInaktivSak } from "../Virksomhet/VirksomhetContext";
import React from "react";
import { Sakshistorikk } from "../../domenetyper/sakshistorikk";

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    iaSak: IASak;
}

export default function TeamDropdown({ open, setOpen, iaSak }: TeamModalProps) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();

    const { data: følgere = [] } = useHentTeam(iaSak.saksnummer);

    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const brukerFølgerSak = !!følgere?.some(
        (følger) => følger === brukerInformasjon?.ident,
    );

    return (
        <>
            <Dropdown
                open={open}
                onOpenChange={(newOpen) => {
                    setOpen(newOpen);
                }}
            >
                <Button
                    onClick={() => setOpen(true)}
                    icon={<ChevronDownIcon aria-hidden />}
                    iconPosition={"right"}
                    variant={"tertiary"}
                    size={"small"}
                    as={Dropdown.Toggle}
                >
                    <Knappeinnhold
                        brukerErEierAvSak={brukerErEierAvSak}
                        brukerFølgerSak={brukerFølgerSak}
                    />
                </Button>
                <Dropdown.Menu
                    style={{
                        maxWidth: "auto",
                        width: "24rem",
                        marginTop: "0.3rem",
                    }}
                    placement="bottom-start"
                >
                    <div
                        style={{
                            margin: "1.5rem",
                            marginTop: "0.5rem",
                        }}
                    >
                        <Heading size="small" level="4">
                            Administrer gruppe
                        </Heading>
                        <TeamInnhold
                            iaSak={iaSak}
                            lukkEksternContainer={() => setOpen(false)}
                        />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

function Knappeinnhold({
    brukerErEierAvSak,
    brukerFølgerSak,
}: {
    brukerErEierAvSak: boolean;
    brukerFølgerSak: boolean;
}) {
    const erPåInaktivSak = useErPåInaktivSak();
    if (erPåInaktivSak) {
        return (
            <HStack align={"center"} gap={"space-4"}>
                <PersonGroupIcon aria-hidden />
                <BodyShort>Se eier og følgere</BodyShort>
            </HStack>
        );
    }

    if (brukerErEierAvSak) {
        return (
            <HStack align={"center"} gap={"space-4"}>
                <PersonFillIcon aria-hidden />
                <BodyShort>Du er eier</BodyShort>
            </HStack>
        );
    }

    if (brukerFølgerSak) {
        return (
            <HStack align={"center"} gap={"space-4"}>
                <HeartFillIcon aria-hidden />
                <BodyShort>Du er følger</BodyShort>
            </HStack>
        );
    }

    return (
        <HStack align={"center"} gap={"space-4"}>
            <PersonGroupIcon aria-hidden />
            <BodyShort>Følg eller ta eierskap</BodyShort>
        </HStack>
    );
}

export function HistoriskTeamDropdown({
    sakshistorikk,
}: {
    sakshistorikk: Sakshistorikk;
}) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Dropdown
                open={open}
                onOpenChange={(newOpen) => {
                    setOpen(newOpen);
                }}
            >
                <Button
                    onClick={() => setOpen(true)}
                    icon={<ChevronDownIcon aria-hidden />}
                    iconPosition={"right"}
                    variant={"tertiary"}
                    size={"small"}
                    as={Dropdown.Toggle}
                >
                    <HStack align={"center"} gap={"space-4"}>
                        <PersonGroupIcon aria-hidden />
                        <BodyShort>Se eier og følgere</BodyShort>
                    </HStack>
                </Button>
                <Dropdown.Menu
                    style={{
                        maxWidth: "auto",
                        width: "24rem",
                        marginTop: "0.3rem",
                    }}
                    placement="bottom-start"
                >
                    <div
                        style={{
                            margin: "1.5rem",
                            marginTop: "0.5rem",
                        }}
                    >
                        <Heading size="small" level="4">
                            Se eier og følgere
                        </Heading>
                        <ReadOnlyTeamInnhold sakshistorikk={sakshistorikk} />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
