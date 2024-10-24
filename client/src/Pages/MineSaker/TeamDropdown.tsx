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
                    icon={<ChevronDownIcon />}
                    iconPosition={"right"}
                    variant={"tertiary"}
                    size={"small"}
                    as={Dropdown.Toggle}
                >
                    <HStack align={"center"} gap={"1"}>
                        {brukerErEierAvSak ? (
                            <>
                                <PersonFillIcon />
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
                        <TeamInnhold iaSak={iaSak} />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
