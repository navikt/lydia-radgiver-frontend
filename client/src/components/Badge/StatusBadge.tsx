import "@navikt/ds-css";
import { Tag, TagProps } from "@navikt/ds-react";
import styles from './badge.module.scss';

export interface GenericProps<T> extends Omit<TagProps, "variant" | "children"> {
    status: T;
    penskrivStatus: (status: T) => string;
    hentVariant: (status: T) => TagProps["variant"];
    slim?: boolean;
}

export function GenericStatusBadge<T>({
    status,
    penskrivStatus,
    hentVariant,
    slim = false,
    ...remainingProps
}: GenericProps<T>) {
    return (
        <div className={styles.statusBadge}>
            <Tag {...remainingProps} className={`${styles.statusTag} ${slim ? styles.slim : ""}`} variant={hentVariant(status)} size="small">
                {penskrivStatus(status)}
            </Tag>
        </div>
    );
}