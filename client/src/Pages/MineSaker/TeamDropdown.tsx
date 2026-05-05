import {
    ChevronDownIcon,
    HeartFillIcon,
    PersonFillIcon,
    PersonGroupIcon,
} from "@navikt/aksel-icons";
import { BodyShort, Button, HStack, Dropdown, Heading } from "@navikt/ds-react";
import React from "react";
import { useHentBrukerinformasjon } from "@/api/lydia-api/bruker";
import { useHentTeam } from "@/api/lydia-api/team";
import { IASak } from "@/domenetyper/domenetyper";
import { useErPåInaktivSak } from "../Virksomhet/VirksomhetContext";
import { TaEierskapModal } from "./TaEierSkapModal";
import TeamInnhold from "./TeamInnhold";

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    iaSak: IASak;
}

export default function TeamDropdown({ open, setOpen, iaSak }: TeamModalProps) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const [taEierskapModalÅpen, setTaEierskapModalÅpen] = React.useState(false);

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
                            åpneTaEierskapModal={() =>
                                setTaEierskapModalÅpen(true)
                            }
                        />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
            <TaEierskapModal
                erModalÅpen={taEierskapModalÅpen}
                lukkModal={() => {
                    setTaEierskapModalÅpen(false);
                    setOpen(false);
                }}
                iaSak={iaSak}
            />
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
            <HStack align={"center"} gap={"1"}>
                <PersonGroupIcon aria-hidden />
                <BodyShort>Se eier og følgere</BodyShort>
            </HStack>
        );
    }

    if (brukerErEierAvSak) {
        return (
            <HStack align={"center"} gap={"1"}>
                <PersonFillIcon aria-hidden />
                <BodyShort>Du er eier</BodyShort>
            </HStack>
        );
    }

    if (brukerFølgerSak) {
        return (
            <HStack align={"center"} gap={"1"}>
                <HeartFillIcon aria-hidden />
                <BodyShort>Du er følger</BodyShort>
            </HStack>
        );
    }

    return (
        <HStack align={"center"} gap={"1"}>
            <PersonGroupIcon aria-hidden />
            <BodyShort>Følg eller ta eierskap</BodyShort>
        </HStack>
    );
}
