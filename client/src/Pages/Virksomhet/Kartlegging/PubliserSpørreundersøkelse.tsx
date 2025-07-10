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
                <Tooltip content="Denne spørreundersøkelsen er sendt til publisering og kan ikke publiseres på nytt.">
                    <div>
                        <Button
                            iconPosition="right"
                            size="small"
                            disabled={true}
                            icon={
                                <HourglassTopFilledIcon
                                    fontSize="1.5rem"
                                    aria-hidden
                                />
                            }
                        >
                            Publiserer
                        </Button>
                    </div>
                </Tooltip>
            );
        case "PUBLISERT":
            return (
                <Tooltip content="Resultatet har blitt publisert på Min Side Arbeidsgiver">
                    <div>
                        <Button
                            iconPosition="right"
                            size="small"
                            disabled={true}
                            icon={
                                <FileCheckmarkIcon
                                    fontSize="1.5rem"
                                    aria-hidden
                                />
                            }
                        >
                            Publisert
                        </Button>
                    </div>
                </Tooltip>
            );
        case "IKKE_PUBLISERT":
            if (spørreundersøkelse.status === "AVSLUTTET") {
                if (!spørreundersøkelse.harMinstEttResultat) {
                    return (
                        <Tooltip content="Denne spørreundersøkelsen har ingen resultater å publisere">
                            <div>
                                <Button
                                    iconPosition="right"
                                    size="small"
                                    disabled={true}
                                    icon={
                                        <FileXMarkIcon
                                            fontSize="1.5rem"
                                            aria-hidden
                                        />
                                    }
                                >
                                    Publiser
                                </Button>
                            </div>
                        </Tooltip>
                    );
                } else {
                    return (
                        <>
                            <Button
                                iconPosition="right"
                                size="small"
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
                            </Button>
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
