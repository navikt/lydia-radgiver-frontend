import React from "react";
import { Button, Dialog } from "@navikt/ds-react";

// Felles ramme for dialogene per måltype.
export function MålDialog({
    tittel,
    beskrivelse,
    open,
    onOpenChange,
    onLukk,
    children,
}: {
    tittel: string;
    beskrivelse: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLukk: () => void;
    children: React.ReactNode;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Popup width="large">
                <Dialog.Header>
                    <Dialog.Title>{tittel}</Dialog.Title>
                    <Dialog.Description>{beskrivelse}</Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>{children}</Dialog.Body>
                <Dialog.Footer>
                    <Button type="button" onClick={onLukk}>
                        Lukk
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
