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
                    <PubliserDokumentknapp
                        icon={
                            <CircleBrokenIcon
                                fontSize="1.5rem"
                                aria-hidden
                                className={styles.spinner}
                            />
                        }
                    >
                        Publiserer
                    </PubliserDokumentknapp>
                );
            }

            return (
                <Tooltip content="Dette tok lengre tid enn forventet. Prøv igjen senere.">
                    <div>
                        <PubliserDokumentknapp
                            disabled
                            icon={
                                <XMarkOctagonIcon
                                    fontSize="1.5rem"
                                    aria-hidden

                                />
                            }
                        >
                            Publiserer
                        </PubliserDokumentknapp>
                    </div>
                </Tooltip>
            );
        case "PUBLISERT":
            return (
                <Tooltip content={`Publisert på Min Side - Arbeidsgiver${spørreundersøkelse.publisertTidspunkt ? ` ${lokalDato(spørreundersøkelse.publisertTidspunkt)}` : ""}`}>
                    <div>
                        <PubliserDokumentknapp
                            disabled
                            icon={
                                <CheckmarkIcon
                                    fontSize="1.5rem"
                                    aria-hidden
                                />
                            }
                        >
                            Publisert
                        </PubliserDokumentknapp>
                    </div>
                </Tooltip>
            );
        case "IKKE_PUBLISERT":
            if (spørreundersøkelse.status === "AVSLUTTET") {
                if (!spørreundersøkelse.harMinstEttResultat) {
                    return (
                        <Tooltip content="Denne spørreundersøkelsen har ingen resultater å publisere">
                            <div>
                                <PubliserDokumentknapp
                                    disabled
                                    icon={
                                        <XMarkOctagonIcon
                                            fontSize="1.5rem"
                                            aria-hidden
                                        />
                                    }
                                >
                                    Publiser
                                </PubliserDokumentknapp>
                            </div>
                        </Tooltip>
                    );
                } else {
                    return (
                        <>
                            <PubliserDokumentknapp
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
                            </PubliserDokumentknapp>
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

export function PubliserDokumentknapp({
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