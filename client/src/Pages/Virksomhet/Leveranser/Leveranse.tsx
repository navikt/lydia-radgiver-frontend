import styled from "styled-components";
import { Button, Table } from "@navikt/ds-react";
import { DeleteFilled as Delete } from "@navikt/ds-icons";
import { Leveranse as LeveranseType, LeveranseStatusEnum } from "../../../domenetyper/leveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";
import { fullførLeveranse, slettLeveranse, useHentBrukerinformasjon, useHentLeveranser } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { useState } from "react";
import { RolleEnum } from "../../../domenetyper/brukerinformasjon";

const ModulNavn = styled(Table.HeaderCell)`
  font-weight: initial;
`;

const DataCellNoWrap = styled(Table.DataCell)`
  white-space: nowrap;
`;

const FullførKnapp = styled(Button)`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  min-width: 5.8em;
`;

const FjernLeveranseKnapp = styled(Button)`
  color: ${NavFarger.text};
  padding: 0.25rem;

  &:hover {
    background: none;
  }

  &:disabled:hover {
    color: ${NavFarger.text};
  }
`;

interface Props {
    leveranse: LeveranseType;
    iaSak: IASak;
}

export const Leveranse = ({ leveranse, iaSak }: Props) => {
    const [bekreftValgModalÅpen, setBekreftValgModalÅpen] = useState(false)
    const leveranseErFullført = leveranse.status === LeveranseStatusEnum.enum.LEVERT;
    const fullførKnappTekst = leveranseErFullført ? "Fullført" : "Fullfør";
    const { mutate: hentLeveranserPåNytt } = useHentLeveranser(iaSak.orgnr, leveranse.saksnummer);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerMedLesetilgang = brukerInformasjon?.rolle === RolleEnum.enum.Lesetilgang;
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;

    const vedFullførLeveranse = () => {
        fullførLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => hentLeveranserPåNytt());
    }

    const vedSlettLeveranse = () => {
        slettLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => {
                setBekreftValgModalÅpen(false)
                hentLeveranserPåNytt()
            });
    }

    return (
        <Table.Row shadeOnHover={false}>
            <ModulNavn>{`${leveranse.modul.navn}`}</ModulNavn>
            <DataCellNoWrap>{`Tentativ frist: ${lokalDato(leveranse.frist)}`}</DataCellNoWrap>
            {brukerMedLesetilgang ? null :
                <Table.DataCell>
                    <FullførKnapp onClick={vedFullførLeveranse} disabled={leveranseErFullført || !brukerErEierAvSak} size="small">
                        {fullførKnappTekst}
                    </FullførKnapp>
                </Table.DataCell>
            }
            <DataCellNoWrap>
                {!leveranse.fullført
                    ? ""
                    : `Fullført: ${lokalDato(leveranse.fullført)}`
                }
            </DataCellNoWrap>
            {brukerMedLesetilgang ? null :
                <Table.DataCell align="right">
                    <FjernLeveranseKnapp onClick={() => setBekreftValgModalÅpen(true)}
                                         disabled={!brukerErEierAvSak}
                                         variant="tertiary"
                                         icon={<Delete title="Fjern leveranse" />} />
                    <BekreftValgModal onConfirm={vedSlettLeveranse}
                                      onCancel={() => {setBekreftValgModalÅpen(false)}}
                                      åpen={bekreftValgModalÅpen}
                                      title="Er du sikker på at du vil fjerne leveransen?"
                                      description={`Leveransen som fjernes er "${leveranse.modul.navn}" med frist ${lokalDato(leveranse.frist)}`} />
                </Table.DataCell>
            }
        </Table.Row>
    )
}
