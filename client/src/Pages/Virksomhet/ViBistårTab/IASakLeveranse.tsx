import styled from "styled-components";
import { Button, Table } from "@navikt/ds-react";
import { DeleteFilled as Delete } from "@navikt/ds-icons";
import { IASakLeveranse as IASakLeveranseType, IASakLeveranseStatusEnum } from "../../../domenetyper/iaLeveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";
import { fullførIASakLeveranse, slettIASakLeveranse, useHentIASakLeveranser } from "../../../api/lydia-api";
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
    leveranse: IASakLeveranseType;
    iaSak: IASak;
}

export const IASakLeveranse = ({ leveranse, iaSak }: Props) => {
    const [open, setOpen] = useState(false)
    const leveranseErFullført = leveranse.status === IASakLeveranseStatusEnum.enum.LEVERT;
    const fullførKnappTekst = leveranseErFullført ? "Fullført" : "Fullfør";
    const { mutate: hentLeveranserPåNytt } = useHentIASakLeveranser(iaSak.orgnr, leveranse.saksnummer);

    const fullførLeveranse = () => {
        fullførIASakLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => hentLeveranserPåNytt());
    }

    const slettLeveranse = () => {
        slettIASakLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => {
                setOpen(false)
                hentLeveranserPåNytt()
            });
    }

    return (
        <Table.Row shadeOnHover={false}>
            <ModulNavn>{`${leveranse.modul.navn}`}</ModulNavn>
            <DataCellNoWrap>{`Frist: ${lokalDato(leveranse.frist)}`}</DataCellNoWrap>
            <Table.DataCell>
                <FullførKnapp onClick={fullførLeveranse} disabled={leveranseErFullført} size="small">
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
                <BekreftValgModal onConfirm={slettLeveranse}
                                  onCancel={() => {setOpen(false)}}
                                  åpen={open}
                                  title="Er du sikker på at du vil fjerne leveransen?"
                                  description={`Leveransen som fjernes er "${leveranse.modul.navn}" med frist ${lokalDato(leveranse.frist)}`} />
            </Table.DataCell>
        </Table.Row>
    )
}
