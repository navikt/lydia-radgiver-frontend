import { PadlockLockedIcon } from "@navikt/aksel-icons";
import { Checkbox, Tooltip } from "@navikt/ds-react";
import styles from "./components.module.scss";

export default function LåsbarCheckbox({
    låst,
    value,
    children,
    tooltipText,
    className = "",
    ...remainingProps
}: {
    låst: boolean;
    tooltipText?: string;
} & React.ComponentProps<typeof Checkbox>) {
    if (låst && tooltipText) {
        return (
            <Tooltip content={tooltipText} defaultOpen={false}>
                <Checkbox
                    className={`${styles.styledLåsbarCheckbox} ${className}`}
                    value={value}
                    readOnly
                    {...remainingProps}
                >
                    <PadlockLockedIcon title="rad er låst" fontSize="1.5rem" />
                    {children}
                </Checkbox>
            </Tooltip>
        );
    }

    if (låst) {
        return (
            <Checkbox
                className={`${styles.styledLåsbarCheckbox} ${className}`}
                value={value}
                readOnly
                {...remainingProps}
            >
                <PadlockLockedIcon title="rad er låst" fontSize="1.5rem" />
                {children}
            </Checkbox>
        );
    }

    return (
        <Checkbox
            className={`${styles.styledLåsbarCheckbox} ${className}`}
            value={value}
            {...remainingProps}
        >
            {children}
        </Checkbox>
    );
}
