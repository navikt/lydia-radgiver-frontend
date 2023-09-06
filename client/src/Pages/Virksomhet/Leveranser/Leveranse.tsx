import styled from "styled-components";
import { Button, Table } from "@navikt/ds-react";
import { TrashFillIcon as Delete } from "@navikt/aksel-icons";
import { Leveranse as LeveranseType, LeveranseStatusEnum } from "../../../domenetyper/leveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";
import {
    merkLeveranseSomLevert,
    slettLeveranse,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentLeveranser
} from "../../../api/lydia-api";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { useState } from "react";
import { RolleEnum } from "../../../domenetyper/brukerinformasjon";

const ModulNavn = styled(Table.HeaderCell)`
  font-weight: initial;
`;

const DataCellNoWrap = styled(Table.DataCell)`
  white-space: nowrap;
`;

const LevertKnapp = styled(Button)`
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

const BekreftValgModalIHøyrejustertCelle = styled(BekreftValgModal)`
  text-align: left;
`;

interface Props {
    leveranse: LeveranseType;
    iaSak: IASak;
}

export const Leveranse = ({ leveranse, iaSak }: Props) => {
    const [bekreftValgModalÅpen, setBekreftValgModalÅpen] = useState(false)
    const erLevert = leveranse.status === LeveranseStatusEnum.enum.LEVERT;
    const { mutate: hentLeveranserPåNytt } = useHentLeveranser(iaSak.orgnr, leveranse.saksnummer);
    const { mutate: hentSakPåNytt } = useHentAktivSakForVirksomhet(iaSak.orgnr)

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerMedLesetilgang = brukerInformasjon?.rolle === RolleEnum.enum.Lesetilgang;
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const sakenErIViBistår = iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR;

    const vedMerkLeveranseSomLevert = () => {
        merkLeveranseSomLevert(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => {
                hentLeveranserPåNytt()
                hentSakPåNytt()
            });
    }

    const vedSlettLeveranse = () => {
        slettLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => {
                setBekreftValgModalÅpen(false)
                hentLeveranserPåNytt()
                hentSakPåNytt()
            });
    }

    return (
        <Table.Row shadeOnHover={false}>
            <ModulNavn>{`${leveranse.modul.navn}`}</ModulNavn>
            <DataCellNoWrap>{`Tentativ frist: ${lokalDato(leveranse.frist)}`}</DataCellNoWrap>
            {(brukerMedLesetilgang || !sakenErIViBistår) ? null :
                <Table.DataCell>
                    <LevertKnapp onClick={vedMerkLeveranseSomLevert} disabled={erLevert || !brukerErEierAvSak} size="small">
                        Levert
                    </LevertKnapp>
                </Table.DataCell>
            }
            <DataCellNoWrap>
                {!leveranse.fullført
                    ? ""
                    : `Levert: ${lokalDato(leveranse.fullført)}`
                }
            </DataCellNoWrap>
            {(brukerMedLesetilgang || !sakenErIViBistår) ? null :
                <Table.DataCell align="right">
                    <FjernLeveranseKnapp onClick={() => setBekreftValgModalÅpen(true)}
                                         disabled={!brukerErEierAvSak}
                                         variant="tertiary"
                                         icon={<Delete title="Fjern leveranse" />} />
                    <BekreftValgModalIHøyrejustertCelle onConfirm={vedSlettLeveranse}
                                      onCancel={() => {setBekreftValgModalÅpen(false)}}
                                      åpen={bekreftValgModalÅpen}
                                      title="Er du sikker på at du vil fjerne leveransen?"
                                      description={`Leveransen som fjernes er "${leveranse.modul.navn}" med frist ${lokalDato(leveranse.frist)}`}
                    />
                </Table.DataCell>
            }
        </Table.Row>
    )
}
