import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import {
    KanIkkeGjennomføreBegrunnelse,
    MuligSamarbeidsgandling,
} from "../../../../domenetyper/samarbeidsEndring";
import React from "react";
import { EksternLenke } from "../../../../components/EksternLenke";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { useVirksomhetContext } from "../../VirksomhetContext";
import BegrunnelserForIkkeKunne, {
    usePrettyType,
} from "./BegrunnelserForIkkeKunne";
import styles from "./endresamarbeidmodal.module.scss";

export default function BekreftHandlingModal({
    open,
    onCancel,
    onConfirm,
    samarbeid,
    advarsler,
    blokkerende,
    type,
    erTillatt,
}: {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    samarbeid: IaSakProsess;
    advarsler?: KanIkkeGjennomføreBegrunnelse[];
    blokkerende?: KanIkkeGjennomføreBegrunnelse[];
    type: MuligSamarbeidsgandling | null;
    erTillatt?: boolean;
}) {
    if (!type) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={onCancel}
            aria-labelledby="bekreft-handling-modal-heading"
            closeOnBackdropClick
        >
            <BekreftHandlingHeader samarbeid={samarbeid} type={type} />
            <Modal.Body>
                <BekreftHandlingBrødtekst type={type} />
                <BegrunnelserForIkkeKunne
                    begrunnelser={blokkerende}
                    type={type}
                    blokkerende
                />
                <BegrunnelserForIkkeKunne
                    begrunnelser={advarsler}
                    type={type}
                />
                <SalesforcelenkeHvisNødvendig type={type} />
            </Modal.Body>
            <Handlingsknapper
                onCancel={onCancel}
                onConfirm={onConfirm}
                type={type}
                erTillatt={erTillatt}
            />
        </Modal>
    );
}

function BekreftHandlingHeader({
    samarbeid,
    type,
}: {
    samarbeid: IaSakProsess;
    type: MuligSamarbeidsgandling;
}) {
    const prettyType = usePrettyType(type);

    return (
        <Modal.Header>
            <Heading size="medium" id="bekreft-handling-modal-heading">
                {prettyType.capitalized} <i>{samarbeid.navn}</i>
            </Heading>
        </Modal.Header>
    );
}

function BekreftHandlingBrødtekst({ type }: { type: MuligSamarbeidsgandling }) {
    const tekst = React.useMemo(() => {
        switch (type) {
            case "fullfores":
                return "Når du fullfører vil alle dokumenter bli arkivert og det vil ikke være mulig å gjøre endringer på samarbeidet.";
            case "slettes":
                return "Samarbeid med fullførte behovsvurderinger, evalueringer og aktive planer kan ikke slettes. Aktiviteter i Salesforce må slettes eller flyttes til at annet samarbeid.";
            case "avbrytes":
                return "Når du avbryter vil alle dokumenter bli arkivert og det vil ikke være mulig å gjøre endringer på samarbeidet.";
        }
    }, [type]);

    return <BodyLong spacing>{tekst}</BodyLong>;
}

function SalesforcelenkeHvisNødvendig({
    type,
}: {
    type: MuligSamarbeidsgandling;
}) {
    const { virksomhet } = useVirksomhetContext();
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    if (type === "slettes" && salesforceInfo?.url) {
        return (
            <EksternLenke
                className={styles.salesforceLenke}
                href={salesforceInfo?.url}
            >
                Se virksomhet i Salesforce
            </EksternLenke>
        );
    }

    return null;
}

function Handlingsknapper({
    onCancel,
    onConfirm,
    type,
    erTillatt,
}: {
    onCancel: () => void;
    onConfirm: () => void;
    type: MuligSamarbeidsgandling;
    erTillatt?: boolean;
}) {
    const prettyType = usePrettyType(type);

    return (
        <Modal.Footer>
            <Button variant="primary" onClick={onConfirm} disabled={!erTillatt}>
                {prettyType.capitalized} samarbeid
            </Button>
            <Button variant="secondary" onClick={onCancel}>
                Avbryt
            </Button>
        </Modal.Footer>
    );
}
