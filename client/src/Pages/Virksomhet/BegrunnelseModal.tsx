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

const hentÅrsakFraNavn = (
    navn: string,
    { gyldigeÅrsaker }: GyldigNesteHendelse
) => gyldigeÅrsaker.find((årsak) => årsak.navn === navn);

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
                    setValgtÅrsak(hentÅrsakFraNavn(e.target.value, hendelse));
                    setValgteBegrunnelser([]);
                }}
                value={valgtÅrsak?.navn}
            >
                {hendelse.gyldigeÅrsaker.map((årsak) => (
                    <option key={årsak.navn} value={årsak.navn}>
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
                    <Checkbox value={begrunnelse.navn} key={begrunnelse.navn}>
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
