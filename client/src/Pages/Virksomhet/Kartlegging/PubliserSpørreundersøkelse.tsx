import { Button, Tooltip } from "@navikt/ds-react";
import React, { useState } from "react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import {
    CheckmarkIcon,
    CircleBrokenIcon,
    PaperplaneIcon,
    XMarkOctagonIcon
} from "@navikt/aksel-icons";
import { PubliseringModal } from "./PubliseringModal";
import styles from "./publiserSpørreundersøkelse.module.scss";
import { lokalDato } from "../../../util/dato";

interface Props {
    spørreundersøkelse: Spørreundersøkelse;
    hentBehovsvurderingPåNytt: () => void;
    pollerPåStatus?: boolean;
}

export const PubliserSpørreundersøkelse = ({
    spørreundersøkelse,
    hentBehovsvurderingPåNytt,
    pollerPåStatus = false,
}: Props) => {
    const [publiserModalÅpen, setPubliserModalÅpen] = useState(false);

    switch (spørreundersøkelse.publiseringStatus) {
        case "OPPRETTET":
            if (pollerPåStatus) {
                return (
                    <Publiserknapp
                        icon={
                            <CircleBrokenIcon
                                fontSize="1.5rem"
                                aria-hidden
                                className={styles.spinner}
                            />
                        }
                    >
                        Publiserer
                    </Publiserknapp>
                );
            }

            return (
                <Tooltip content="Dette tok lengre tid enn forventet. Prøv igjen senere.">
                    <div>
                        <Publiserknapp
                            disabled
                            icon={
                                <XMarkOctagonIcon
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
                <Tooltip content={`Publisert på Min Side - Arbeidsgiver${spørreundersøkelse.publisertTidspunkt ? ` ${lokalDato(spørreundersøkelse.publisertTidspunkt)}` : ""}`}>
                    <div>
                        <Publiserknapp
                            disabled
                            icon={
                                <CheckmarkIcon
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
                                        <XMarkOctagonIcon
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

export function Publiserknapp({
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