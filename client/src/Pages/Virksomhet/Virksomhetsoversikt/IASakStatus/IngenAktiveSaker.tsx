import styled from "styled-components";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { IASakOversiktContainer, InfoTittel, Saksinfo } from "./IASakOversikt";
import {
    opprettSak,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentSamarbeidshistorikk
} from "../../../../api/lydia-api";
import { StatusBadge } from "../../../../components/Badge/StatusBadge";
import { IAProsessStatusEnum, IASakshendelseTypeEnum } from "../../../../domenetyper/domenetyper";
import { RolleEnum } from "../../../../domenetyper/brukerinformasjon";

const VurderesKnappContainer = styled.div`
  display: flex;
  justify-content: end;
`;

interface IngenAktiveSakerProps {
    orgnummer: string;
}

export const IngenAktiveSaker = ({orgnummer}: IngenAktiveSakerProps) => {
    const {data: brukerInformasjon} = useHentBrukerinformasjon();
    const {mutate: mutateSamarbeidshistorikk} = useHentSamarbeidshistorikk(orgnummer)
    const {mutate: mutateAktivSak} = useHentAktivSakForVirksomhet(orgnummer)

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateAktivSak?.()
        mutateSamarbeidshistorikk?.()
    }

    return (
        <IASakOversiktContainer>
            <Saksinfo>
                <InfoTittel>Status</InfoTittel>
                <StatusBadge status={IAProsessStatusEnum.enum.IKKE_AKTIV} />
            </Saksinfo>
            {brukerInformasjon?.rolle === RolleEnum.enum.Superbruker ?
                <VurderesKnappContainer>
                    <IASakshendelseKnapp
                        hendelsesType={IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES}
                        onClick={() => opprettSak(orgnummer).then(() => mutateIASakerOgSamarbeidshistorikk())}
                    />
                </VurderesKnappContainer>
                : null
            }
        </IASakOversiktContainer>
    );
}
