import {
    KanGjennomføreStatusendring,
    KanIkkeGjennomføreBegrunnelse,
} from "../../../domenetyper/samarbeidsEndring";
import React from "react";
import { BodyShort, Heading, List, LocalAlert } from "@navikt/ds-react";
import { useHentSalesforceSamarbeidLenke } from "../../../api/lydia-api/virksomhet";
import { EksternLenke } from "../../../components/EksternLenke";
import { useSamarbeidContext } from "../Samarbeid/SamarbeidContext";

export default function SlettSamarbeidModalBegrunnelser({
    kanGjennomføreResultat,
}: {
    kanGjennomføreResultat?: KanGjennomføreStatusendring;
}) {
    if (kanGjennomføreResultat && !kanGjennomføreResultat.kanGjennomføres) {
        return (
            <LocalAlert
                status={
                    kanGjennomføreResultat.blokkerende.length > 0
                        ? "error"
                        : "warning"
                }
            >
                <LocalAlert.Header>
                    <LocalAlert.Title>
                        Samarbeidet kan ikke slettes fordi:
                    </LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    <List>
                        {kanGjennomføreResultat.blokkerende.map(
                            (begrunnelse) => (
                                <BegrunnelsesRad
                                    key={begrunnelse}
                                    begrunnelse={begrunnelse}
                                />
                            ),
                        )}
                        {kanGjennomføreResultat.advarsler.map((begrunnelse) => (
                            <BegrunnelsesRad
                                key={begrunnelse}
                                begrunnelse={begrunnelse}
                            />
                        ))}
                    </List>
                </LocalAlert.Content>
            </LocalAlert>
        );
    }
    return null;
}

function BegrunnelsesRad({
    begrunnelse,
}: {
    begrunnelse: KanIkkeGjennomføreBegrunnelse;
}) {
    return (
        <List.Item>
            <BegrunnelsesInnhold begrunnelse={begrunnelse} />
        </List.Item>
    );
}

function BegrunnelsesInnhold({
    begrunnelse,
}: {
    begrunnelse: KanIkkeGjennomføreBegrunnelse;
}) {
    const samarbeid = useSamarbeidContext();

    switch (begrunnelse) {
        case "FINNES_SALESFORCE_AKTIVITET":
            return (
                <>
                    <Heading size={"xsmall"}>
                        Det finnes aktiviteter i Salesforce
                    </Heading>
                    <BodyShort>
                        Aktiviteter må slettes eller flyttes til et annet
                        samarbeid
                    </BodyShort>
                    <Salesforcelenke samarbeidId={samarbeid.id} />
                </>
            );
        case "FINNES_BEHOVSVURDERING":
            return (
                <Heading size={"xsmall"}>Det finnes en behovsvurdering</Heading>
            );
        case "FINNES_SAMARBEIDSPLAN":
            return (
                <>
                    <Heading size={"xsmall"}>
                        Det finnes en aktiv samarbeidsplan
                    </Heading>
                    <BodyShort>Planen må tømmes og slettes</BodyShort>
                </>
            );
        case "FINNES_EVALUERING":
            return <Heading size={"xsmall"}>Det finnes en evaluering</Heading>;
        default:
            return null;
    }
}

function Salesforcelenke({ samarbeidId }: { samarbeidId?: number }) {
    const { data: salesforceSamarbeidsLenke } =
        useHentSalesforceSamarbeidLenke(samarbeidId);

    if (!salesforceSamarbeidsLenke) {
        return null;
    }

    return (
        <EksternLenke href={salesforceSamarbeidsLenke.salesforceLenke}>
            Gå til samarbeid i Salesforce
        </EksternLenke>
    );
}
