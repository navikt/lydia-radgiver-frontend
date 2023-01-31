import { ComponentMeta } from "@storybook/react";

import { BegrunnelseModal, ModalInnhold } from "./BegrunnelseModal";
import { Modal } from "@navikt/ds-react";
import { ikkeAktuellHendelseMock } from "../../mocks/iaSakMock";
import { useState } from "react";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Modal: begrunnelse for 'Ikke aktuell'",
    component: BegrunnelseModal,
} as ComponentMeta<typeof BegrunnelseModal>;

Modal.setAppElement?.(document.body);

export const Hovedstory = () => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setOpen(true)}>{"Åpne"}</button>
            <BegrunnelseModal
                hendelse={ikkeAktuellHendelseMock}
                åpen={open}
                lagre={(valgtÅrsak) => {
                    alert(
                        `Lagrer årsak ${valgtÅrsak.type} med begrunnelser
                        ${valgtÅrsak.begrunnelser.join(", ")}`
                    )
                    setOpen(false)
                }}
                onClose={() => setOpen(false)}
            />
        </div>
    );
};

export const BareInnhold = () => (
    <ModalInnhold
        hendelse={ikkeAktuellHendelseMock}
        lagre={() => {return}}
        onClose={() => {return}}
    />
);
