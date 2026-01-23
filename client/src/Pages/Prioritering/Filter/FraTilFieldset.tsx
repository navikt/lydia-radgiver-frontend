import { Fieldset } from "@navikt/ds-react";
import styles from "./filter.module.scss";

export function FraTilFieldset({
    className,
    ...remainingProps
}: React.ComponentProps<typeof Fieldset>) {
    return (
        <Fieldset
            className={
                className
                    ? `${styles.fraTilFieldset} ${className}`
                    : styles.fraTilFieldset
            }
            {...remainingProps}
        />
    );
}
