import { Button, LocalAlert, Modal, Radio, RadioGroup } from "@navikt/ds-react";
import React from "react";
import {
    NyFlytBegrunnelse,
    nyFlytBegrunnelseEnum,
    nyFlytÅrsakTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { vurderSakNyFlyt } from "../../../../../api/lydia-api/nyFlyt";
import { useOversiktMutate } from "../../../Debugside/Oversikt";

export default function VurderVirksomhetModal({
    erÅpen,
    onClose,
    orgnr,
}: {
    erÅpen: boolean;
    onClose: () => void;
    orgnr: string;
}) {
    const mutate = useOversiktMutate(orgnr);
    const [begrunnelse, setBegrunnelse] =
        React.useState<NyFlytBegrunnelse | null>(null);
    const [forsøktLagret, setForsøktLagret] = React.useState(false);
    const [lasterHandling, setLasterHandling] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async () => {
        setForsøktLagret(true);
        setError(null);
        if (!begrunnelse) {
            return;
        }
        setLasterHandling(true);
        try {
            await vurderSakNyFlyt(orgnr, {
                type: nyFlytÅrsakTypeEnum.enum
                    .BAKGRUNN_FOR_VURDERING_AV_VIRKSOMHET,
                begrunnelser: [begrunnelse],
            });
            setLasterHandling(false);
            mutate();
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setLasterHandling(false);
        }
    };

    return (
        <Modal
            open={erÅpen}
            header={{ heading: "Vurder virksomheten" }}
            width="medium"
            onClose={onClose}
        >
            <Modal.Body>
                <RadioGroup
                    legend="Vurder virksomheten"
                    hideLegend
                    value={begrunnelse}
                    onChange={(value: NyFlytBegrunnelse) =>
                        setBegrunnelse(value)
                    }
                    error={
                        forsøktLagret && !begrunnelse
                            ? "Du må velge et alternativ"
                            : undefined
                    }
                >
                    <Radio
                        value={
                            nyFlytBegrunnelseEnum.enum.NAV_VURDERER_VIRKSOMHETEN
                        }
                    >
                        Nav vurderer virksomheten
                    </Radio>
                    <Radio
                        value={
                            nyFlytBegrunnelseEnum.enum
                                .VIRKSOMHETEN_HAR_TATT_KONTAKT
                        }
                    >
                        Virksomheten har tatt kontakt
                    </Radio>
                </RadioGroup>
                {error && (
                    <LocalAlert status="error">
                        <LocalAlert.Header>{error}</LocalAlert.Header>
                        <LocalAlert.CloseButton
                            onClick={() => setError(null)}
                        />
                    </LocalAlert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    loading={lasterHandling}
                    disabled={lasterHandling}
                >
                    Lagre
                </Button>
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={lasterHandling}
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
