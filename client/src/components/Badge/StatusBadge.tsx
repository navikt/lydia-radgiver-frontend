import "@navikt/ds-css";
import { Tag, TagProps, Tooltip } from "@navikt/ds-react";
import styles from "./badge.module.scss";
import { useMemo } from "react";

export interface GenericProps<T> extends Omit<
    TagProps,
    "variant" | "children"
> {
    status: T;
    penskrivStatus: (status: T) => string;
    hentTagProps?: (status: T) => Omit<TagProps, "variant" | "children">;
    hentHjelpetekst?: (status: T) => string | undefined;
    as?: React.ElementType;
}

export function GenericStatusBadge<T>({
    status,
    penskrivStatus,
    hentTagProps = () => ({}),
    className,
    hentHjelpetekst = () => undefined,
    as = "div",
    ...remainingProps
}: GenericProps<T>) {
    const Component = as;
    const hjelpetekst = useMemo(() => hentHjelpetekst(status), [status]);

    const tag = (
        <Tag
            {...remainingProps}
            className={`${styles.statusTag} ${styles.slim} `}
            {...hentTagProps(status)}
            size="small"
        >
            {penskrivStatus(status)}
        </Tag>
    );

    return (
        <Component
            className={`${styles.statusBadge} ${className ? className : ""}`}
        >
            {hjelpetekst
                ? <Tooltip content={hjelpetekst} describesChild>{tag}</Tooltip>
                : tag}
        </Component>
    );
}
