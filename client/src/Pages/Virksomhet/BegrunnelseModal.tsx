import {
    Button,
    Checkbox,
    CheckboxGroup,
    Modal,
    Select,
} from "@navikt/ds-react";
import { useState } from "react";
import {GyldigNesteHendelse, ValgtÅrsakDto, Årsak} from "../../domenetyper";

interface Props {
    hendelse: GyldigNesteHendelse;
}

const hentÅrsakFraÅrsakType = (
    type: string,
    { gyldigeÅrsaker }: GyldigNesteHendelse
) => gyldigeÅrsaker.find((årsak) => årsak.type === type);

export const ModalInnhold = ({ hendelse, lagre }: Props & { lagre: (valgtÅrsak : ValgtÅrsakDto) => void }) => {
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
                value={valgtÅrsak?.type}
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
                    if (!valgtÅrsak || valgteBegrunnelser.length == 0) {
                        console.error("Må velge en årsak")
                        return
                    }
                    const valgtÅrsakDto : ValgtÅrsakDto = {
                        type: valgtÅrsak.type,
                        begrunnelser: valgteBegrunnelser
                    }
                    lagre(valgtÅrsakDto)
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
    onClose,
    lagre,
}: Props & { åpen: boolean; onClose : () => void, lagre: (valgtÅrsak : ValgtÅrsakDto) => void }) => {
    return (
        <Modal parentSelector={() => document.getElementById("root")!} open={åpen} onClose={onClose}>
            <Modal.Content style={{ margin : "3rem"}}>
                <ModalInnhold
                    hendelse={hendelse}
                    lagre={lagre}
                />
            </Modal.Content>
        </Modal>
    );
};
