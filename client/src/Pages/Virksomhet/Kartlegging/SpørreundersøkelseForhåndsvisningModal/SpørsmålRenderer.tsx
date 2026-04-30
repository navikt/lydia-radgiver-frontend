import {
    Accordion,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
} from "@navikt/ds-react";
import React from "react";
import {
    SpørsmålDto,
    SvaralternativDto,
    TemaDto,
} from "@features/kartlegging/types/spørreundersøkelseMedInnhold";
import styles from "./spørreundersøkelseForhåndsvisningModal.module.scss";

export function SpørsmålRenderer({
    tema,
    defaultOpen = false,
}: {
    tema: TemaDto;
    defaultOpen?: boolean;
}) {
    const boxRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (boxRef !== null) {
            boxRef?.current?.scrollIntoView({
                block: "end",
                inline: "center",
            });
        }
    }, []);

    return (
        <Accordion>
            {tema.spørsmålOgSvaralternativer.map((spørsmål) => (
                <SpørsmålAccordionItem
                    key={spørsmål.id}
                    spørsmål={spørsmål}
                    defaultOpen={defaultOpen}
                />
            ))}
        </Accordion>
    );
}

function SpørsmålAccordionItem({
    spørsmål,
    defaultOpen = false,
}: {
    spørsmål: SpørsmålDto;
    defaultOpen?: boolean;
}) {
    return (
        <Accordion.Item
            className={styles.accordionItem}
            defaultOpen={defaultOpen}
        >
            <Accordion.Header className={styles.accordionHeader}>
                {spørsmål.spørsmål}
            </Accordion.Header>
            <Accordion.Content>
                <Svaralternativer
                    svaralternativer={spørsmål.svaralternativer}
                    flervalg={spørsmål.flervalg}
                />
            </Accordion.Content>
        </Accordion.Item>
    );
}

function Svaralternativer({
    svaralternativer,
    flervalg,
}: {
    svaralternativer: SvaralternativDto[];
    flervalg: boolean;
}) {
    const OptionGroup = flervalg ? CheckboxGroup : RadioGroup;

    return (
        <OptionGroup hideLegend legend={""}>
            {svaralternativer.map((svaralternativ) => {
                if (flervalg) {
                    return (
                        <Checkbox
                            key={svaralternativ.svarId}
                            value={svaralternativ.svarId}
                            className={styles.disabledCheckbox}
                            disabled
                        >
                            {svaralternativ.svartekst}
                        </Checkbox>
                    );
                }
                return (
                    <Radio
                        key={svaralternativ.svarId}
                        value={svaralternativ.svarId}
                        className={styles.disabledRadio}
                    >
                        {svaralternativ.svartekst}
                    </Radio>
                );
            })}
        </OptionGroup>
    );
}
