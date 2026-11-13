import React from "react";
import { Box, Button, HStack, VStack } from "@navikt/ds-react";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import styles from "./mål.module.scss";

export function Målkortramme({ children }: { children: React.ReactNode }) {
    return (
        <Box
            background="default"
            borderColor="neutral-subtle"
            borderWidth="1"
            borderRadius="12"
            padding="space-16"
        >
            <VStack gap="space-12" className={styles.maalkortinnhold}>
                {children}
            </VStack>
        </Box>
    );
}

export function Målkortknapper({
    redigerId,
    beskrevetAv,
    onRediger,
    onSlett,
    varsel,
}: {
    redigerId: string;
    beskrevetAv: string;
    onRediger: () => void;
    onSlett: () => void;
    varsel?: React.ReactNode;
}) {
    return (
        <HStack
            gap="space-8"
            justify={varsel ? "space-between" : "end"}
            align="center"
            wrap
            className={styles.maalkortknapper}
        >
            {varsel}
            <HStack gap="space-8">
                <Button
                    id={redigerId}
                    type="button"
                    variant="tertiary"
                    data-color="neutral"
                    size="small"
                    icon={<PencilIcon aria-hidden />}
                    aria-describedby={beskrevetAv}
                    onClick={onRediger}
                >
                    Rediger
                </Button>
                <Button
                    type="button"
                    variant="tertiary"
                    data-color="danger"
                    size="small"
                    icon={<TrashIcon aria-hidden />}
                    aria-describedby={beskrevetAv}
                    onClick={onSlett}
                >
                    Slett
                </Button>
            </HStack>
        </HStack>
    );
}
