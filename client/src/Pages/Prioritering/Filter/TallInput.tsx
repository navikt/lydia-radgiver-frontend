import { TextField } from "@navikt/ds-react";
import styles from './filter.module.scss';

export function TallInput({
    className,
    ...remainingProps
}: React.ComponentProps<typeof TextField> & { className?: string }) {
    return <TextField className={className ? `${styles.tallinput} ${className}` : styles.tallinput} {...remainingProps} />;
}
