import { BodyShort, Button, HStack, Dropdown, Heading } from "@navikt/ds-react";
import {
    ChevronDownIcon,
    HeartFillIcon,
    PersonFillIcon,
    PersonGroupIcon,
} from "@navikt/aksel-icons";
import { useHentBrukerinformasjon } from "../../api/lydia-api/bruker";
import { IASak } from "../../domenetyper/domenetyper";
import TeamInnhold from "./TeamInnhold";
import { useHentTeam } from "../../api/lydia-api/team";
import { useErPåInaktivSak } from "../Virksomhet/VirksomhetContext";
import React from "react";
import { TaEierskapModal } from "./TaEierSkapModal";

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
                        <TeamInnhold iaSak={iaSak} lukkEksternContainer={() => setOpen(false)} åpneTaEierskapModal={() => setTaEierskapModalÅpen(true)} />
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

function Knappeinnhold({ brukerErEierAvSak, brukerFølgerSak }: { brukerErEierAvSak: boolean, brukerFølgerSak: boolean }) {
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
                <BodyShort>Du eier saken</BodyShort>
            </HStack>
        );
    }

    if (brukerFølgerSak) {
        return (
            <HStack align={"center"} gap={"1"}>
                <HeartFillIcon aria-hidden />
                <BodyShort>Du følger saken</BodyShort>
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