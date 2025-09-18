import { Alert } from "@navikt/ds-react";
import styles from './banner.module.scss';

export function Banner({ className = "", ...remainingProps }: React.ComponentProps<typeof Alert>) {
    return <Alert className={`${styles.banner} ${className}`} {...remainingProps} />;
}