import React from "react";
import { Button, Dialog, VStack } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    Mål,
    Samarbeidsmål,
    Seksjonshandlinger,
    Sykefraværsmål,
} from "./målskjema";
import { Sykefraværsmålseksjon } from "./Sykefraværsmålseksjon";
import { Samarbeidsmålseksjon } from "./Samarbeidsmålseksjon";

export function MålDialog({
    open,
    onOpenChange,
    lagret,
    onLagreSykefraværsmål,
    onLagreSamarbeidsmål,
    iaSak,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lagret: Mål;
    onLagreSykefraværsmål: (
        liste: Sykefraværsmål[],
    ) => Promise<Sykefraværsmål[]>;
    onLagreSamarbeidsmål: (
        liste: Samarbeidsmål[],
    ) => Promise<Samarbeidsmål[]>;
    iaSak: IASak;
}) {
    const sykefraværsseksjon = React.useRef<Seksjonshandlinger>(null);
    const samarbeidsseksjon = React.useRef<Seksjonshandlinger>(null);
    // Tittelen skal ikke bytte fra «Mål» til «Rediger mål» mens dialogen er åpen.
    const [harLagredeMål] = React.useState(
        () =>
            lagret.sykefraværsmål.length > 0 || lagret.samarbeidsmål.length > 0,
    );

    // Bare den første seksjonen med ulagrede endringer får fokus.
    const lukk = () => {
        const sykefraværUlagret =
            sykefraværsseksjon.current?.visUlagrede(true) ?? false;
        const samarbeidUlagret =
            samarbeidsseksjon.current?.visUlagrede(!sykefraværUlagret) ?? false;
        if (sykefraværUlagret || samarbeidUlagret) return;
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Popup width="large">
                <Dialog.Header>
                    <Dialog.Title>
                        {harLagredeMål ? "Rediger mål" : "Mål"}
                    </Dialog.Title>
                    <Dialog.Description>
                        Legg til mål for sykefraværet og samarbeidet.
                    </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="space-32">
                        <Sykefraværsmålseksjon
                            ref={sykefraværsseksjon}
                            lagret={lagret.sykefraværsmål}
                            onLagre={onLagreSykefraværsmål}
                        />
                        <Samarbeidsmålseksjon
                            ref={samarbeidsseksjon}
                            lagret={lagret.samarbeidsmål}
                            onLagre={onLagreSamarbeidsmål}
                            iaSak={iaSak}
                        />
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button type="button" onClick={lukk}>
                        Lukk
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
