import styles from './components.module.scss';

export default function SideContainer({ className, ...remainingProps }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={`${styles.sidecontainer} ${className}`} {...remainingProps} />
}