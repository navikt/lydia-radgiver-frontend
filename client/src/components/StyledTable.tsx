import { Table } from "@navikt/ds-react";
import styles from './components.module.scss';

export function StyledTable({ className = "", ...props }: React.ComponentProps<typeof Table>) {
    return <Table {...props} className={`${styles.styledTable} ${className}`} zebraStripes size="small" />
}
