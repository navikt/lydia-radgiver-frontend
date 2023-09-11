import { Select } from "@navikt/ds-react";

interface Props {
    valgtSnittfilter?: string
    endreSnittfilter: (snittfilter: string) => void
}

export const BransjeEllerNæringDropdown = ({valgtSnittfilter, endreSnittfilter}: Props) => {
    return (
        <Select label="Bransje/næring" value={valgtSnittfilter} onChange={e => endreSnittfilter(e.target.value)}>
            <option key={"empty-status"} value={""}>Alle</option>
            <option key={"OVER"} value={"BRANSJE_NÆRING_OVER"}>Sykefravær over gjennomsnitt</option>
            <option key={"UNDER_ELLER_LIK"} value={"BRANSJE_NÆRING_UNDER_ELLER_LIK"}>Sykefravær under eller lik gjennomsnitt</option>
        </Select>
    )
}
