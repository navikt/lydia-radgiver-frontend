import { Tooltip } from "@navikt/ds-react";
import React, { useState } from "react";
import {
    CheckmarkIcon,
    CircleBrokenIcon,
    PaperplaneIcon,
    XMarkOctagonIcon
} from "@navikt/aksel-icons";
import styles from "../Kartlegging/publiserSpørreundersøkelse.module.scss";
import { lokalDato } from "../../../util/dato";
import {Publiserknapp} from "../Kartlegging/PubliserSpørreundersøkelse";
import { Plan } from "../../../domenetyper/plan";
import {PubliseringModal} from "./PubliseringModal";

interface Props {
    plan: Plan;
    hentSamarbeidsplanPåNytt: () => void;
    pollerPåStatus?: boolean;
}

export const PubliserSamarbeidsplan = ({
    plan,
    hentSamarbeidsplanPåNytt,
    pollerPåStatus = false,
}: Props) => {
    const [publiserModalÅpen, setPubliserModalÅpen] = useState(false);

    switch (plan?.publiseringStatus) {
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
            if (plan?.harEndringerSidenSistPublisert) {
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
                            plan={plan}
                            hentSamarbeidsplanPåNytt={
                                hentSamarbeidsplanPåNytt
                            }
                        />
                    </>
                )
            } else {
                return (
                    <Tooltip content={`Publisert på Min Side - Arbeidsgiver${plan.sistPublisert ? ` ${lokalDato(plan.sistPublisert)}` : ""}`}>
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
            }

        case "IKKE_PUBLISERT":
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
                        plan={plan}
                        hentSamarbeidsplanPåNytt={
                            hentSamarbeidsplanPåNytt
                        }
                    />
                </>
            );
        default:
            return null;
    }
};