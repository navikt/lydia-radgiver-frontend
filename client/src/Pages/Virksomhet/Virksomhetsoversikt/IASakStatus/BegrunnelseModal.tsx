import { useState } from "react";
import { Button, Checkbox, CheckboxGroup, ErrorSummary, Modal, Select } from "@navikt/ds-react";
import { GyldigNesteHendelse, ValgtÅrsakDto, Årsak } from "../../../../domenetyper";
import { getRootElement } from "../../../../main";
import styled from "styled-components";
import { StyledModal } from "../../../../components/Modal/StyledModal";

const hentÅrsakFraÅrsakType = (
    type: string,
    {gyldigeÅrsaker}: GyldigNesteHendelse
) => gyldigeÅrsaker.find((årsak) => årsak.type === type);

const Lagreknapp = styled(Button)`
  margin-top: 1.5rem;
`;

interface ModalInnholdProps {
    hendelse: GyldigNesteHendelse;
    lagre: (valgtÅrsak: ValgtÅrsakDto) => void;
}

export const ModalInnhold = ({hendelse, lagre}: ModalInnholdProps) => {
    const [valgtÅrsak, setValgtÅrsak] = useState<Årsak | undefined>(() => {
        return hendelse.gyldigeÅrsaker.length
            ? hendelse.gyldigeÅrsaker[0]
            : undefined;
    });
    const [valgteBegrunnelser, setValgteBegrunnelser] = useState<string[]>([]);
    const [valideringsfeil, setValideringsfeil] = useState<string[]>([]);

    const begrunnelserCheckboxId = "begrunnelser-checkbox"

    return (
        <>
            <Select
                label="Begrunnelse for at samarbeid ikke er aktuelt:"
                onChange={(e) => {
                    setValgtÅrsak(hentÅrsakFraÅrsakType(e.target.value, hendelse));
                    setValgteBegrunnelser([]);
                }}
                value={valgtÅrsak?.type}
            >
                {hendelse.gyldigeÅrsaker.map((årsak) => (
                    <option key={årsak.type} value={årsak.type}>
                        {årsak.navn}
                    </option>
                ))}
            </Select>
            <br />
            <CheckboxGroup
                size="medium"
                id={begrunnelserCheckboxId}
                legend="Velg en eller flere begrunnelser"
                hideLegend
                value={valgteBegrunnelser}
                onChange={(v) => {
                    setValgteBegrunnelser(v)
                    setValideringsfeil([])
                }}
            >
                {valgtÅrsak?.begrunnelser.map((begrunnelse) => (
                    <Checkbox value={begrunnelse.type} key={begrunnelse.type}>
                        {begrunnelse.navn}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Lagreknapp
                onClick={() => {
                    if (!valgtÅrsak || valgteBegrunnelser.length == 0) {
                        setValideringsfeil([...valideringsfeil, "Du må velge minst én begrunnelse"])
                        return
                    }
                    const valgtÅrsakDto: ValgtÅrsakDto = {
                        type: valgtÅrsak.type,
                        begrunnelser: valgteBegrunnelser
                    }
                    lagre(valgtÅrsakDto)
                    setValideringsfeil([])
                }}
            >
                Lagre
            </Lagreknapp>
            {valideringsfeil.length > 0 && <ErrorSummary style={{marginTop: "1rem"}}>
                {valideringsfeil.map(feil =>
                    (<ErrorSummary.Item key={feil} href={`#${begrunnelserCheckboxId}`}>
                        {feil}
                    </ErrorSummary.Item>)
                )}

            </ErrorSummary>
            }
        </>
    );
};

interface BegrunnelseModalProps extends ModalInnholdProps {
    åpen: boolean;
    onClose: () => void
}

export const BegrunnelseModal = ({hendelse, åpen, onClose, lagre}: BegrunnelseModalProps) => {
    return (
        <StyledModal parentSelector={() => getRootElement()} open={åpen} onClose={onClose}>
            <Modal.Content>
                <ModalInnhold
                    hendelse={hendelse}
                    lagre={lagre}
                />
            </Modal.Content>
        </StyledModal>
    );
};
