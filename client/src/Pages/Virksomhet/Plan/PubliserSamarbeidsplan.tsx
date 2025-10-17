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
import { PubliserDokumentknapp } from "../Kartlegging/PubliserSpørreundersøkelse";
import { Plan } from "../../../domenetyper/plan";
import { PubliseringModal } from "./PubliseringModal";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";

interface Props {
    plan: Plan;
    hentSamarbeidsplanPåNytt: () => void;
    pollerPåStatus?: boolean;
    iaSak: IASak;
}

export const PubliserSamarbeidsplan = ({
    plan,
    hentSamarbeidsplanPåNytt,
    pollerPåStatus = false,
    iaSak,
}: Props) => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();

    const [publiserModalÅpen, setPubliserModalÅpen] = useState(false);

    const brukerErEier = iaSak?.eidAv === brukerInformasjon?.ident;
    const erLesebruker = brukerInformasjon?.rolle === "Lesetilgang";

    if (erLesebruker) {
        return null;
    }

    switch (plan?.publiseringStatus) {
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
            if (plan?.harEndringerSidenSistPublisert) {
                if (!brukerErEier) {
                    return <BrukerMåVæreEierKnapp />;
                }

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
            }

        case "IKKE_PUBLISERT":
            if (!brukerErEier) {
                return <BrukerMåVæreEierKnapp />;
            }

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

function BrukerMåVæreEierKnapp() {
    return (
        <Tooltip content="Kun eiere og følgere av saken kan publisere planen.">
            <div>
                <PubliserDokumentknapp
                    icon={
                        <PaperplaneIcon
                            fontSize="1.5rem"
                            aria-hidden
                        />
                    }
                    disabled
                >
                    Publiser
                </PubliserDokumentknapp>
            </div>
        </Tooltip>
    );
}