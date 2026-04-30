import { TrendUpIcon } from "@navikt/aksel-icons";
import { Button, ButtonProps, Modal } from "@navikt/ds-react";
import React from "react";
import { Virksomhet } from "@features/virksomhet/types/virksomhet";
import { Historiskstatistikk } from "./Graf/Historiskstatistikk";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";

export default function Sykefraværsstatistikkmodal({
    virksomhet,
    className,
}: {
    virksomhet: Virksomhet;
    className?: ButtonProps["className"];
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button
                className={className}
                variant="tertiary"
                size="small"
                onClick={() => setOpen(true)}
                icon={<TrendUpIcon aria-hidden fontSize="1.25rem" />}
            >
                Sykefraværsstatistikk
            </Button>
            <Modal
                width="64rem"
                header={{
                    heading: `Sykefraværsstatistikk for ${virksomhet.navn}`,
                }}
                open={open}
                onClose={() => setOpen(false)}
                closeOnBackdropClick
            >
                {open && <Modalinnhold virksomhet={virksomhet} />}
            </Modal>
        </>
    );
}

function Modalinnhold({ virksomhet }: { virksomhet: Virksomhet }) {
    return (
        <>
            <Modal.Body>
                <Sykefraværsstatistikk
                    orgnummer={virksomhet.orgnr}
                    bransje={virksomhet.bransje}
                    næring={virksomhet.næring}
                />
                <Historiskstatistikk orgnr={virksomhet.orgnr} />
            </Modal.Body>
        </>
    );
}
