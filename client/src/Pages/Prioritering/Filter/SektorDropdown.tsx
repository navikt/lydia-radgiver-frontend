import {Select} from "@navikt/ds-react";
import {Sektor} from "../../../domenetyper/domenetyper";

interface Props {
    valgtSektor?: string
    endreSektor: (sektor: string) => void
    sektorer: Sektor[]
}

export const SektorDropdown = ({valgtSektor, endreSektor, sektorer}: Props) => {
   return    (
       <Select label="Sektor" value={valgtSektor} onChange={e => endreSektor(e.target.value)}>
           <option key="empty-status" value={""}>Alle</option>
           {sektorer.map((sektor) => (
               <option key={sektor.kode} value={sektor.kode}>{sektor.beskrivelse}</option>
           ))}
       </Select>
   )
}
