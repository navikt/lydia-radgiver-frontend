import { VisHvisSamarbeidErÅpent } from "../Samarbeid/SamarbeidContext";
import styles from './actionButtonHvisSamarbeidIkkeFullført.module.scss';

export default function ActionButtonsHvisSamarbeidIkkeFullført({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<VisHvisSamarbeidErÅpent>
			<div className={styles.actionButtonContainer}>{children}</div>
		</VisHvisSamarbeidErÅpent>
	);
}