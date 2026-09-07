import { IaSakProsess } from "../../../../../domenetyper/iaSakProsess";
import {
    Accordion,
    BodyShort,
    Heading,
    HStack,
    VStack,
} from "@navikt/ds-react";
import styles from "./samarbeidsperiodehistorikk.module.scss";
import { SamarbeidStatusBadge } from "../../../../../components/Badge/SamarbeidStatusBadge";
import { SamarbeidshistorikkTabell } from "./SamarbeidshistorikkTabell";
import { datointervall } from "../../../../../util/dato";

export function SamarbeidAccordion({
    samarbeid,
    orgnr,
}: {
    samarbeid: IaSakProsess[];
    orgnr: string;
}) {
    return (
        <VStack gap="space-8" marginBlock="space-16 space-0">
            <Heading size="small" level="3">
                Samarbeid
            </Heading>
            <Accordion>
                {samarbeid &&
                    samarbeid.map((samarbeid) => (
                        <Accordion.Item key={samarbeid.id} data-color="neutral">
                            <Accordion.Header
                                className={styles.accordionHeaderContent}
                            >
                                <HStack
                                    gap="space-16"
                                    align="center"
                                    justify="space-between"
                                    width="100%"
                                >
                                    {samarbeid.navn ?? "Samarbeid uten navn"}
                                    <HStack
                                        gap="space-16"
                                        align="center"
                                        width="20rem"
                                        justify="start"
                                    >
                                        <BodyShort
                                            as="span"
                                            className={styles.dato}
                                        >
                                            {datointervall(samarbeid)}
                                        </BodyShort>
                                        <HStack flexGrow="1" justify="end">
                                            <SamarbeidStatusBadge
                                                style={{ whiteSpace: "nowrap" }}
                                                status={samarbeid.status}
                                            />
                                        </HStack>
                                    </HStack>
                                </HStack>
                            </Accordion.Header>
                            <Accordion.Content>
                                <SamarbeidshistorikkTabell
                                    orgnr={orgnr}
                                    saksnummer={samarbeid.saksnummer}
                                    samarbeidId={samarbeid.id}
                                    samarbeidsnavn={samarbeid.navn}
                                />
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
            </Accordion>
        </VStack>
    );
}
