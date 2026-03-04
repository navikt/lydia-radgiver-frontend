import React from "react";
import {
    BodyLong,
    BodyShort,
    Button,
    Heading,
    Link,
    List,
    LocalAlert,
    Modal,
} from "@navikt/ds-react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { IASak } from "../../../../domenetyper/domenetyper";
import { useHentPlan } from "../../../../api/lydia-api/plan";
import styles from "./administrerSamarbeid.module.scss";
import { slettSamarbeidNyFlyt } from "../../../../api/lydia-api/nyFlyt";

export default function SlettSamarbeidModal({
    ref,
    valgtSamarbeid,
    iaSak,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    valgtSamarbeid?: IaSakProsess | null;
    iaSak?: IASak;
}) {
    const plan = useHentPlan(
        iaSak?.orgnr,
        iaSak?.saksnummer,
        valgtSamarbeid?.id,
    );
    const [error, setError] = React.useState<string | null>(null);

    const onSlett = async () => {
        setError(null);
        if (iaSak && valgtSamarbeid) {
            try {
                await slettSamarbeidNyFlyt(
                    iaSak?.orgnr,
                    valgtSamarbeid?.id.toString(),
                );
                ref.current?.close();
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            }
        } else {
            setError("Kunne ikke finne sak for samarbeid");
        }
    };
    return (
        <>
            <Modal
                ref={ref}
                header={{ heading: `Slett ${valgtSamarbeid?.navn}` }}
            >
                <Modal.Body>
                    {plan.data ? (
                        <LocalAlert
                            status="error"
                            className={styles.errorAlert}
                        >
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Samarbeidet kan ikke slettes fordi:
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                <List>
                                    <List.Item>
                                        <Heading size={"xsmall"}>
                                            Det finnes en aktiv samarbeidsplan
                                        </Heading>
                                        <BodyShort>
                                            Planen må tømmes og slettes
                                        </BodyShort>
                                        <Link>Gå til samarbeidsplan</Link>
                                        {/*TODO: Legg til lenke til samarbeidsplanen det gjelder*/}
                                    </List.Item>
                                </List>
                                <List>
                                    <List.Item>
                                        <Heading size={"xsmall"}>
                                            Det finnes aktiviteter i Salesforce
                                        </Heading>
                                        <BodyShort>
                                            Aktiviteter må slettes eller flyttes
                                            til et annet samarbeid
                                        </BodyShort>
                                        <Link>
                                            Gå til samarbeid i Salesforce
                                        </Link>
                                        {/*TODO: Legg til lenke til samarbeidet i Salesforce*/}
                                    </List.Item>
                                </List>
                            </LocalAlert.Content>
                        </LocalAlert>
                    ) : (
                        <BodyLong>
                            Ønsker du å slette {valgtSamarbeid?.navn}?
                        </BodyLong>
                    )}

                    {error && (
                        <LocalAlert
                            status="error"
                            className={styles.errorAlert}
                        >
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Noe gikk galt
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{error}</LocalAlert.Content>
                        </LocalAlert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"primary"} onClick={onSlett}>
                        Slett
                    </Button>
                    <Button
                        variant={"secondary"}
                        onClick={() => ref.current?.close()}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
