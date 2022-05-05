import {Button, Checkbox, CheckboxGroup, Modal, Select} from "@navikt/ds-react";
import {useState} from "react";

const ModalInnhold = () => {
    const [valg, setValg] = useState<string[]>(["Bakerst"])

    return (
        <>
            <Select
                label="Begrunnelse for at samarbeidet ikke blir igangsatt"
                onChange={(e) => console.log(e)}
            >
                <option value="">Velg land</option>
                <option value="norge">Norge</option>
                <option value="sverige">Sverige</option>
                <option value="danmark">Danmark</option>
            </Select>
            <br/>
            <CheckboxGroup size="medium"
                           legend="Velg en eller flere begrunnelser"
                           hideLegend={true}
                           value={valg}
                           onChange={valg => setValg(valg)}>
                <Checkbox value="Bakerst">Bakerst</Checkbox>
                <Checkbox value="Midterst">Midterst</Checkbox>
                <Checkbox value="Fremst">Fremst</Checkbox>
            </CheckboxGroup>
            <Button>Lagre</Button>
        </>
    )
}

export const BegrunnelseModal = () => {
    return (
        // <Modal open={true} onClose={() => null}>
        //     <Modal.Content>
        <ModalInnhold/>
        // </Modal.Content>
        // </Modal>
    );
};
