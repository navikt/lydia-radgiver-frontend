import {
    Button,
    Checkbox,
    CheckboxGroup,
    Modal,
    Select,
} from "@navikt/ds-react";
import { useState } from "react";
import { GyldigNesteHendelse, Årsak } from "../../domenetyper";

interface Props {
    hendelse: GyldigNesteHendelse;
}

const hentÅrsakFraÅrsakType = (
    type: string,
    { gyldigeÅrsaker }: GyldigNesteHendelse
) => gyldigeÅrsaker.find((årsak) => årsak.type === type);

export const ModalInnhold = ({ hendelse }: Props & { lagre: () => void }) => {
    const [valgtÅrsak, setValgtÅrsak] = useState<Årsak | undefined>(() => {
        return hendelse.gyldigeÅrsaker.length
            ? hendelse.gyldigeÅrsaker[0]
            : undefined;
    });
    const [valgteBegrunnelser, setValgteBegrunnelser] = useState<string[]>([]);

    return (
        <>
            <Select
                label="Begrunnelse for at samarbeidet ikke blir igangsatt"
                onChange={(e) => {
                    setValgtÅrsak(hentÅrsakFraÅrsakType(e.target.value, hendelse));
                    setValgteBegrunnelser([]);
                }}
                value={valgtÅrsak?.navn}
            >
                {hendelse.gyldigeÅrsaker.map((årsak) => (
                    <option key={årsak.type} value={årsak.type}>
                        {årsak.navn}
                    </option>
                ))}
            </Select>
            <br />
            <CheckboxGroup
                size="medium"
                legend="Begrunnelse for at samarbeidet ikke blir igangsatt"
                value={valgteBegrunnelser}
                onChange={(v) => setValgteBegrunnelser(v)}
                hideLegend
            >
                {valgtÅrsak?.begrunnelser.map((begrunnelse) => (
                    <Checkbox value={begrunnelse.type} key={begrunnelse.type}>
                        {begrunnelse.navn}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Button
                onClick={() => {
                    console.table(valgteBegrunnelser);
                }}
            >
                Lagre
            </Button>
        </>
    );
};

export const BegrunnelseModal = ({
    hendelse,
    åpen,
    lukk,
}: Props & { åpen: boolean; lukk: () => void }) => {
    return (
        <Modal open={åpen} onClose={lukk}>
            <Modal.Content>
                <ModalInnhold
                    hendelse={hendelse}
                    lagre={() => {
                        lukk();
                    }}
                />
            </Modal.Content>
        </Modal>
    );
};
