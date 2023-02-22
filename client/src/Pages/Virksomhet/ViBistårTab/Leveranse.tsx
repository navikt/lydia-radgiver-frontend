import styled from "styled-components";
import { Button, Table } from "@navikt/ds-react";
import { DeleteFilled as Delete } from "@navikt/ds-icons";
import { Leveranse as LeveranseType, LeveranseStatusEnum } from "../../../domenetyper/leveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";
import { fullførLeveranse, slettLeveranse, useHentLeveranser } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { useState } from "react";

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
`;

interface Props {
    leveranse: LeveranseType;
    iaSak: IASak;
}

export const Leveranse = ({ leveranse, iaSak }: Props) => {
    const [open, setOpen] = useState(false)
    const leveranseErFullført = leveranse.status === LeveranseStatusEnum.enum.LEVERT;
    const fullførKnappTekst = leveranseErFullført ? "Fullført" : "Fullfør";
    const { mutate: hentLeveranserPåNytt } = useHentLeveranser(iaSak.orgnr, leveranse.saksnummer);

    const vedFullførLeveranse = () => {
        fullførLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => hentLeveranserPåNytt());
    }

    const vedSlettLeveranse = () => {
        slettLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => {
                setOpen(false)
                hentLeveranserPåNytt()
            });
    }

    return (
        <Table.Row shadeOnHover={false}>
            <ModulNavn>{`${leveranse.modul.navn}`}</ModulNavn>
            <DataCellNoWrap>{`Tentativ frist: ${lokalDato(leveranse.frist)}`}</DataCellNoWrap>
            <Table.DataCell>
                <FullførKnapp onClick={vedFullførLeveranse} disabled={leveranseErFullført} size="small">
                    {fullførKnappTekst}
                </FullførKnapp>
            </Table.DataCell>
            <DataCellNoWrap>
                {!leveranse.fullført
                    ? ""
                    : `Fullført: ${lokalDato(leveranse.fullført)}`
                }
            </DataCellNoWrap>
            <Table.DataCell align="right">
                <FjernLeveranseKnapp onClick={() => setOpen(true)}
                                     variant="tertiary"
                                     icon={<Delete title="Fjern leveranse" />} />
                <BekreftValgModal onConfirm={vedSlettLeveranse}
                                  onCancel={() => {setOpen(false)}}
                                  åpen={open}
                                  title="Er du sikker på at du vil fjerne leveransen?"
                                  description={`Leveransen som fjernes er "${leveranse.modul.navn}" med frist ${lokalDato(leveranse.frist)}`} />
            </Table.DataCell>
        </Table.Row>
    )
}
