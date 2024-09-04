import { Heading, Modal } from "@navikt/ds-react";
import React from "react";
import {
    GyldigNesteHendelse,
    IASak,
} from "../../../../../domenetyper/domenetyper";
import Historikk from "./Historikk";
import { StatusHendelseSteg, Statusknapper } from "./Statusknapper";

export default function EndreStatusModal({
    sak,
    hendelser,
    setVisKonfetti,
    open,
    setOpen,
}: {
    sak: IASak;
    hendelser: GyldigNesteHendelse[];
    setVisKonfetti?: (visKonfetti: boolean) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const [nesteSteg, setNesteSteg] = React.useState<{
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }>({ nesteSteg: null, hendelse: null });

    return (
        <>
            <Modal
                open={open}
                style={{ minWidth: "36rem" }}
                onClose={() => {
                    setOpen(false);
                    setNesteSteg({ nesteSteg: null, hendelse: null });
                }}
                aria-label="Endre status"
            >
                <Modal.Header>
                    <Heading size="medium">Endre status</Heading>
                </Modal.Header>
                <Modal.Body
                    style={
                        nesteSteg.nesteSteg === null
                            ? {}
                            : { maxHeight: "20rem" }
                    }
                >
                    <Historikk sak={sak} />
                </Modal.Body>
                <Statusknapper
                    onStatusEndret={() => {
                        setOpen(false);
                    }}
                    hendelser={hendelser}
                    sak={sak}
                    setModalOpen={setOpen}
                    setVisKonfetti={setVisKonfetti}
                    nesteSteg={nesteSteg}
                    setNesteSteg={setNesteSteg}
                />
            </Modal>
        </>
    );
}
