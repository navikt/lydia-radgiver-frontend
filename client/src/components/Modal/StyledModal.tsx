import { Modal } from "@navikt/ds-react";
import styles from "./modal.module.scss";

export function StyledModal({
    className = "",
    ...remainingProps
}: React.ComponentProps<typeof Modal>) {
    return (
        <Modal
            className={`${styles.styledModal} ${className}`}
            {...remainingProps}
        />
    );
}
