import styled from "styled-components";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { getRootElement } from "../../main";

const Knapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledModal = styled(Modal)`
  padding-top: 0.5rem;
  padding-right: 3rem;
`;

export interface Props {
    onConfirm: () => void
    onCancel: () => void
    åpen: boolean,
    title?: string,
    description?: string
}

export const BekreftValgModal = ({
    onConfirm,
    onCancel,
    åpen,
    title = "Vennligst bekreft valget ditt",
    description
}: Props) => {
    Modal.setAppElement?.(document.body)
    return (
        <StyledModal parentSelector={() => getRootElement()}
                     open={åpen}
                     onClose={onCancel}>
            <Modal.Content>
                <Heading size="medium" spacing>{title}</Heading>
                {description && <BodyLong>{description}</BodyLong>}
                <br />
                <Knapper>
                    <Button onClick={onConfirm}>Bekreft</Button>
                    <Button variant="secondary" onClick={onCancel}>Avbryt</Button>
                </Knapper>
            </Modal.Content>
        </StyledModal>
    );
}
