import {Button, Heading, Modal} from "@navikt/ds-react";
import "./BekreftelseDialog.css"


interface Props {
    onConfirm: () => void
    onCancel: () => void
    åpen: boolean
    description: string
}


export const BekreftelseDialog = ({onConfirm, onCancel, åpen, description}: Props) => {
    return (
        <Modal className="bekreftelse-dialog-innhold" parentSelector={() => document.getElementById('root')!} open={åpen} onClose={onCancel}>
            <Modal.Content>
                <Heading size="medium" spacing className="bekreftelse-dialog-overskrift">{description}</Heading>
                <div className="bekreftelse-dialog-knapper">
                    <Button onClick={onConfirm}>Bekreft</Button>
                    <Button variant="secondary" onClick={onCancel}>Angre</Button>
                </div>

            </Modal.Content>
        </Modal>
    );
}