import "@navikt/ds-css";
import { Tag, TagProps } from "@navikt/ds-react";
import styles from "./badge.module.scss";

export interface GenericProps<T> extends Omit<
    TagProps,
    "variant" | "children"
> {
    status: T;
    penskrivStatus: (status: T) => string;
    hentTagProps?: (status: T) => Omit<TagProps, "variant" | "children">;
    as?: React.ElementType;
}

export function GenericStatusBadge<T>({
    status,
    penskrivStatus,
    hentTagProps = () => ({}),
    className,
    as = "div",
    ...remainingProps
}: GenericProps<T>) {
    const Component = as;
    return (
        <Component
            className={`${styles.statusBadge} ${className ? className : ""}`}
        >
            <Tag
                {...remainingProps}
                className={`${styles.statusTag} ${styles.slim} `}
                {...hentTagProps(status)}
                size="small"
            >
                {penskrivStatus(status)}
            </Tag>
        </Component>
    );
}
