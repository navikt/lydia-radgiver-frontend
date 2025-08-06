import { Button, Tooltip } from "@navikt/ds-react";
import React, { useState } from "react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import {
    FileCheckmarkIcon,
    FileXMarkIcon,
    HourglassTopFilledIcon,
    PaperplaneIcon,
} from "@navikt/aksel-icons";
import { PubliseringModal } from "./PubliseringModal";
import { MutatorCallback, MutatorOptions } from "swr";
import styles from "./publiserSpørreundersøkelse.module.scss";

interface Props {
    spørreundersøkelse: Spørreundersøkelse;
    hentBehovsvurderingPåNytt: <MutationData = Spørreundersøkelse[]>(
        data?:
            | Promise<Spørreundersøkelse[] | undefined>
            | MutatorCallback<Spørreundersøkelse[]>
            | Spørreundersøkelse[],
        opts?: boolean | MutatorOptions<Spørreundersøkelse[], MutationData>,
    ) => Promise<Spørreundersøkelse[] | MutationData | undefined>;
}

export const PubliserSpørreundersøkelse = ({
    spørreundersøkelse,
    hentBehovsvurderingPåNytt,
}: Props) => {
    const [publiserModalÅpen, setPubliserModalÅpen] = useState(false);

    switch (spørreundersøkelse.publiseringStatus) {
        case "OPPRETTET":
            return (
                <Tooltip content="Denne spørreundersøkelsen er sendt til publisering og kan ikke publiseres på nytt." maxChar={100}>
                    <div>
                        <Publiserknapp
                            disabled
                            icon={
                                <HourglassTopFilledIcon
                                    fontSize="1.5rem"
                                    aria-hidden
                                />
                            }
                        >
                            Publiserer
                        </Publiserknapp>
                    </div>
                </Tooltip>
            );
        case "PUBLISERT":
            return (
                <Tooltip content="Resultatet har blitt publisert på Min Side Arbeidsgiver">
                    <div>
                        <Publiserknapp
                            disabled
                            icon={
                                <FileCheckmarkIcon
                                    fontSize="1.5rem"
                                    aria-hidden
                                />
                            }
                        >
                            Publisert
                        </Publiserknapp>
                    </div>
                </Tooltip>
            );
        case "IKKE_PUBLISERT":
            if (spørreundersøkelse.status === "AVSLUTTET") {
                if (!spørreundersøkelse.harMinstEttResultat) {
                    return (
                        <Tooltip content="Denne spørreundersøkelsen har ingen resultater å publisere">
                            <div>
                                <Publiserknapp
                                    disabled
                                    icon={
                                        <FileXMarkIcon
                                            fontSize="1.5rem"
                                            aria-hidden
                                        />
                                    }
                                >
                                    Publiser
                                </Publiserknapp>
                            </div>
                        </Tooltip>
                    );
                } else {
                    return (
                        <>
                            <Publiserknapp
                                icon={
                                    <PaperplaneIcon
                                        fontSize="1.5rem"
                                        aria-hidden
                                    />
                                }
                                onClick={() => {
                                    setPubliserModalÅpen(true);
                                }}
                            >
                                Publiser
                            </Publiserknapp>
                            <PubliseringModal
                                open={publiserModalÅpen}
                                setOpen={setPubliserModalÅpen}
                                spørreundersøkelse={spørreundersøkelse}
                                hentBehovsvurderingPåNytt={
                                    hentBehovsvurderingPåNytt
                                }
                            />
                        </>
                    );
                }
            } else {
                return null;
            }
        default:
            return null;
    }
};

function Publiserknapp({
    icon,
    children,
    disabled,
    onClick,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}) {
    return (
        <Button
            iconPosition="right"
            size="small"
            disabled={disabled}
            icon={icon}
            onClick={onClick}
            className={styles.publiserknapp}
        >
            {children}
        </Button>
    );
}