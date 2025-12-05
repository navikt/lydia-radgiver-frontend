import { VisHvisSamarbeidErÅpent } from "../Samarbeid/SamarbeidContext";
import styles from './actionButtonHvisSamarbeidIkkeFullført.module.scss';

export default function ActionButtonsHvisSamarbeidIkkeFullført({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
	return (
		<VisHvisSamarbeidErÅpent>
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
			<div className={styles.actionButtonContainer} onClick={onClick}>{children}</div>
		</VisHvisSamarbeidErÅpent>
	);
}