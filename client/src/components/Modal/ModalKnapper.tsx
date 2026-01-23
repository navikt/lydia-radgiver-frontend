import styles from "./modal.module.scss";

export function ModalKnapper({
    className = "",
    ...remainingProps
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`${className} ${styles.modalknapper}`}
            {...remainingProps}
        />
    );
}
