import {
    ActionMenu,
    Button,
    ButtonProps,
    Chips,
    HStack,
    Spacer,
} from "@navikt/ds-react";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { SplittedeSamarbeid } from "./SamarbeidsKort";
import { ArchiveIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";
import { IASak } from "../../../domenetyper/domenetyper";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";
import { ARKIV_STATUSER } from "../Filter/StatusFilter";
import styles from "./minesakerkort.module.scss";

export function Samarbeidsvelger({
    sorterteSamarbeid,
    valgtSamarbeid,
    setValgtSamarbeid,
    iaSak,
}: {
    sorterteSamarbeid: SplittedeSamarbeid;
    valgtSamarbeid: IaSakProsess;
    setValgtSamarbeid: React.Dispatch<React.SetStateAction<IaSakProsess>>;
    iaSak: IASak;
}) {
    if (sorterteSamarbeid.aktive.length === 0) {
        return (
            <KunAvsluttedeSamarbeid
                sorterteSamarbeid={sorterteSamarbeid}
                iaSak={iaSak}
            />
        );
    }

    return (
        <HStack>
            <Chips>
                {sorterteSamarbeid.aktive.map((samarbeid) => (
                    <Chips.Toggle
                        key={samarbeid.id}
                        selected={samarbeid.id === valgtSamarbeid?.id}
                        onClick={() => setValgtSamarbeid(samarbeid)}
                    >
                        {samarbeid.navn ?? ""}
                    </Chips.Toggle>
                ))}
            </Chips>
            <Spacer />
            <InaktiveSamarbeidExpand
                avsluttedeSamarbeid={sorterteSamarbeid.avsluttede}
                iaSak={iaSak}
            />
        </HStack>
    );
}

function InaktiveSamarbeidExpand({
    avsluttedeSamarbeid,
    iaSak,
    variant = "secondary",
    knappeTekst,
}: {
    avsluttedeSamarbeid: IaSakProsess[];
    iaSak: IASak;
    variant?: ButtonProps["variant"];
    knappeTekst?: string;
}) {
    if (avsluttedeSamarbeid.length === 0) {
        return null;
    }

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button
                    className={styles.arkiverteSamarbeidKnapp}
                    size="small"
                    variant={variant}
                    icon={<ArchiveIcon title="Se arkiverte samarbeid" />}
                    iconPosition="right"
                >
                    {knappeTekst}
                </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <ActionMenu.Group label="Avsluttede samarbeid">
                    {avsluttedeSamarbeid.map((samarbeid) => (
                        <ActionMenu.Item
                            key={samarbeid.id}
                            className={styles.avsluttetSamarbeidLenke}
                            as={Link}
                            to={`/virksomhet/${iaSak.orgnr}/sak/${samarbeid.saksnummer}/samarbeid/${samarbeid.id}`}
                        >
                            {samarbeid.navn}
                            <SamarbeidStatusBadge status={samarbeid.status} />
                        </ActionMenu.Item>
                    ))}
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    );
}

function KunAvsluttedeSamarbeid({
    sorterteSamarbeid,
    iaSak,
}: {
    sorterteSamarbeid: SplittedeSamarbeid;
    iaSak: IASak;
}) {
    if (sorterteSamarbeid.avsluttede.length === 0) {
        return null;
    }

    return (
        <HStack>
            {ARKIV_STATUSER.includes(iaSak.status) &&
                `Virksomheten har ${sorterteSamarbeid.avsluttede.length} fullførte samarbeid`}
            <Spacer />
            <InaktiveSamarbeidExpand
                avsluttedeSamarbeid={sorterteSamarbeid.avsluttede}
                iaSak={iaSak}
                knappeTekst="Se avsluttede samarbeid"
                variant="primary"
            />
        </HStack>
    );
}
