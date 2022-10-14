import {BodyLong, Button, Heading, Modal} from "@navikt/ds-react";
import "./BekreftelseDialog.css"


export interface Props {
    onConfirm: () => void
    onCancel: () => void
    åpen: boolean,
    title?: string,
    description?: string
}


export const BekreftelseDialog = ({onConfirm, onCancel, åpen, title = "Vennligst bekreft valget ditt", description }: Props) => {
    Modal.setAppElement?.(document.body)
    return (
        <Modal className="bekreftelse-dialog-innhold" parentSelector={() => document.getElementById('root')!} open={åpen} onClose={onCancel}>
            <Modal.Content>
                <Heading size="medium" spacing className="bekreftelse-dialog-overskrift">{title}</Heading>
                {description && <BodyLong>{description}</BodyLong>}
                <br/>
                <div className="bekreftelse-dialog-knapper">
                    <Button onClick={onConfirm}>Bekreft</Button>
                    <Button variant="secondary" onClick={onCancel}>Avbryt</Button>
                </div>

            </Modal.Content>
        </Modal>
    );
}
