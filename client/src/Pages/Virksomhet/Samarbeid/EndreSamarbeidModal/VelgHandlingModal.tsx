import {
    BodyLong,
    Button,
    Heading,
    Modal,
    Radio,
    RadioGroup,
} from "@navikt/ds-react";
import React from "react";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import {
    KanGjennomføreStatusendring,
    muligeHandlinger,
    MuligSamarbeidsgandling,
} from "../../../../domenetyper/samarbeidsEndring";
import { useBøyningerAvSamarbeidshandling } from "../../../../util/formatering/useBøyninger";
import BegrunnelserForIkkeKunne from "./BegrunnelserForIkkeKunne";
import styles from "./endresamarbeidmodal.module.scss";

export default function VelgHandlingModal({
    samarbeid,
    åpen,
    setÅpen,
    hentKanGjennomføreStatusendring,
    kanGjennomføreResultat,
    lasterKanGjennomføreHandling,
    setBekreftType,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
    åpen: boolean;
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    hentKanGjennomføreStatusendring: (
        handling: MuligSamarbeidsgandling,
    ) => void;
    kanGjennomføreResultat?: KanGjennomføreStatusendring;
    lasterKanGjennomføreHandling: string | null;
    setBekreftType: React.Dispatch<
        React.SetStateAction<MuligSamarbeidsgandling | null>
    >;
}) {
    const [valgtHandling, setValgtHandling] =
        React.useState<MuligSamarbeidsgandling | null>(null);

    return (
        <Modal
            className={styles.velgHandlingModal}
            aria-label="Avslutt samarbeid"
            open={åpen}
            onClose={() => setÅpen(false)}
        >
            <Modal.Header closeButton={true}>
                <Heading size="medium">
                    Avslutt <i>{samarbeid.navn}</i>
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <BodyLong>
                    Når du avslutter samarbeidet vil alle dokumenter bli
                    journalført og det vil ikke være mulig å gjøre endringer.
                </BodyLong>
                <RadioGroup
                    className={styles.radioknapp}
                    onChange={(handling: MuligSamarbeidsgandling) => {
                        hentKanGjennomføreStatusendring(handling);
                        setValgtHandling(handling);
                    }}
                    value={valgtHandling}
                    legend="Hva har skjedd med samarbeidet?"
                    hideLegend
                    disabled={lasterKanGjennomføreHandling !== null}
                >
                    <HandlingRadio handling={muligeHandlinger.enum.fullfores} />
                    <HandlingRadio handling={muligeHandlinger.enum.avbrytes} />
                </RadioGroup>
                {!lasterKanGjennomføreHandling &&
                kanGjennomføreResultat &&
                valgtHandling ? (
                    <BegrunnelserForIkkeKunne
                        begrunnelser={kanGjennomføreResultat?.blokkerende}
                        type={valgtHandling}
                        blokkerende
                    />
                ) : null}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className={styles.jaKnapp}
                    variant="primary"
                    disabled={
                        !valgtHandling ||
                        lasterKanGjennomføreHandling !== null ||
                        !kanGjennomføreResultat?.kanGjennomføres
                    }
                    onClick={() => {
                        setBekreftType(valgtHandling);
                        setÅpen(false);
                    }}
                >
                    Avslutt samarbeidet
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setBekreftType(null);
                        setÅpen(false);
                    }}
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function HandlingRadio({ handling }: { handling: MuligSamarbeidsgandling }) {
    const bøydHandling = useBøyningerAvSamarbeidshandling(handling);
    return (
        <Radio value={handling}>
            Samarbeidet er {bøydHandling.presensPerfektum}
        </Radio>
    );
}
