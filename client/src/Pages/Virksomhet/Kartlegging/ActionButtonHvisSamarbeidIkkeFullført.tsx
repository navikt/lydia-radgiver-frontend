import { VisHvisSamarbeidErÅpent } from "../Samarbeid/SamarbeidContext";
import styles from "./actionButtonHvisSamarbeidIkkeFullført.module.scss";

export default function ActionButtonsHvisSamarbeidIkkeFullført({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <VisHvisSamarbeidErÅpent>
            <div
                className={`${styles.actionButtonContainer} action-buttons-container`}
                onClick={onClick}
            >
                {children}
            </div>
        </VisHvisSamarbeidErÅpent>
    );
}
