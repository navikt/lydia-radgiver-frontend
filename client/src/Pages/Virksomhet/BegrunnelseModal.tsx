import {Button, Checkbox, CheckboxGroup, Modal, Select} from "@navikt/ds-react";
import {useState} from "react";
import {Begrunnelse, GyldigNesteHendelse, Årsak} from "../../domenetyper";

interface Props {
    hendelse: GyldigNesteHendelse
}

const førsteÅrsakOrNull = (hendelse: GyldigNesteHendelse): Årsak | null =>
    hendelse.gyldigeÅrsaker.length > 0 ? hendelse.gyldigeÅrsaker[0] : null

const årsakFraÅrsakNavn = (årsakNavn : string, hendelse: GyldigNesteHendelse): Årsak | undefined =>
    hendelse.gyldigeÅrsaker.find(årsak => årsak.navn == årsakNavn)

const ModalInnhold = ({hendelse}: Props) => {
    const [valgtÅrsak, setValgtÅrsak] = useState<Årsak | null>(førsteÅrsakOrNull(hendelse))
    const [valgteBegrunnelser, setValgteBegrunnelser] = useState<Begrunnelse[]>([])

    return (
        <>
            <Select
                label="Begrunnelse for at samarbeidet ikke blir igangsatt"
                onChange={(e) => console.log(e)}
                value={valgtÅrsak?.navn}
            >
                {
                    hendelse.gyldigeÅrsaker.map(årsak => (
                            <option key={årsak.navn} value={årsak.navn}>{årsak.navn}</option>
                        )
                    )
                }
            </Select>
            <br/>
            <CheckboxGroup size="medium"
                           legend="Velg en eller flere begrunnelser"
                           hideLegend={true}
                           value={valgteBegrunnelser}
                           onChange={valg => console.log(valg)}>
                {valgtÅrsak?.begrunnelser.map(begrunnelse => (
                    <Checkbox key={begrunnelse.navn} value={begrunnelse.navn}>{begrunnelse.navn}</Checkbox>
                ))
                }
            </CheckboxGroup>
            <Button>Lagre</Button>
        </>
    )
}

export const BegrunnelseModal = ({hendelse}: Props) => {
    return (
        // <Modal open={true} onClose={() => null}>
        //     <Modal.Content>
        <ModalInnhold hendelse={hendelse}/>
        // </Modal.Content>
        // </Modal>
    );
};
