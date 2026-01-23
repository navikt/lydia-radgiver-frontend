import React from "react";
import { Button, ButtonProps, Modal } from "@navikt/ds-react";
import { useHentSakshistorikk } from "../../../../api/lydia-api/virksomhet";
import { SykefraværshistorikkInnhold } from ".";
import { ClockIcon } from "@navikt/aksel-icons";

export default function Sakshistorikkmodal({
    orgnr,
    virksomhetsnavn,
    className,
}: {
    orgnr: string;
    virksomhetsnavn?: string;
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
                icon={<ClockIcon aria-hidden fontSize="1.25rem" />}
            >
                Historikk
            </Button>
            <Modal
                width="64rem"
                header={{
                    heading: `Historikk${virksomhetsnavn ? ` for ${virksomhetsnavn}` : ""}`,
                }}
                open={open}
                onClose={() => setOpen(false)}
                closeOnBackdropClick
            >
                {open && <Modalinnhold orgnr={orgnr} />}
            </Modal>
        </>
    );
}

function Modalinnhold({ orgnr }: { orgnr: string }) {
    const { data: sakshistorikk, loading: lasterSakshistorikk } =
        useHentSakshistorikk(orgnr);

    return (
        <Modal.Body>
            <SykefraværshistorikkInnhold
                sakshistorikk={sakshistorikk}
                lasterSakshistorikk={lasterSakshistorikk}
                orgnr={orgnr}
                defaultOpenFørste
            />
        </Modal.Body>
    );
}
