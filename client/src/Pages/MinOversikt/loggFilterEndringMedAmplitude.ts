import { IAProsessStatusType } from "../../domenetyper/domenetyper"
import { loggMineSakerFilter, MineSakerFilterKategorier } from "../../util/amplitude-klient"
import { ARKIV_STATUSER } from "./Filter/StatusFilter"
import { EierFølgerFilterType } from "./MinOversiktside"

export const loggMineSakerFilterEndringMedAmplitude = (statusFilter: IAProsessStatusType[], søkfilter: string, eierfølgerfilter: EierFølgerFilterType ) => {
  const typer: MineSakerFilterKategorier[] = []

  if (statusFilter.length > 0)
    if (statusFilter.some(it => ARKIV_STATUSER.includes(it)))
      typer.push(MineSakerFilterKategorier.ARKIVERTE_SAKER)
    else
      typer.push(MineSakerFilterKategorier.STATUS)

  if (søkfilter != "")
    typer.push(MineSakerFilterKategorier.ORGSØK)

  if (eierfølgerfilter.length > 0)
    typer.push(MineSakerFilterKategorier.KNYTNING)


  loggMineSakerFilter(typer)
}