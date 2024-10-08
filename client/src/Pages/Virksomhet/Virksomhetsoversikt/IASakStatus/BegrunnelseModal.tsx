import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Modal,
    Select,
} from "@navikt/ds-react";
import {
    GyldigNesteHendelse,
    ValgtÅrsakDto,
    Årsak,
} from "../../../../domenetyper/domenetyper";
import { StyledModal } from "../../../../components/Modal/StyledModal";
import { ModalKnapper } from "../../../../components/Modal/ModalKnapper";

const hentÅrsakFraÅrsakType = (
    type: string,
    { gyldigeÅrsaker }: GyldigNesteHendelse,
) => {
    return gyldigeÅrsaker.find((årsak) => årsak.type === type);
};

interface BegrunnelseModalProps {
    hendelse: GyldigNesteHendelse;
    lagre: (valgtÅrsak: ValgtÅrsakDto) => void;
    åpen: boolean;
    onClose: () => void;
}

export const BegrunnelseModal = ({
    hendelse,
    åpen,
    onClose,
    lagre,
}: BegrunnelseModalProps) => {
    const [valgtÅrsak, setValgtÅrsak] = useState<Årsak | undefined>(() => {
        return hendelse.gyldigeÅrsaker.length
            ? hendelse.gyldigeÅrsaker[0]
            : undefined;
    });
    const [valgteBegrunnelser, setValgteBegrunnelser] = useState<string[]>([]);
    const [valideringsfeil, setValideringsfeil] = useState<string[]>([]);

    const begrunnelserCheckboxId = "begrunnelser-checkbox";

    return (
        <StyledModal
            header={{
                heading:
                    'Er du sikker på at du vil sette saken til "Ikke aktuell"?',
            }}
            open={åpen}
            onClose={onClose}
        >
            <Modal.Body>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Select
                        label="Begrunnelse for at samarbeid ikke er aktuelt:"
                        onChange={(e) => {
                            setValgtÅrsak(
                                hentÅrsakFraÅrsakType(e.target.value, hendelse),
                            );
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
                            setValgteBegrunnelser(v);
                            setValideringsfeil([]);
                        }}
                    >
                        {valgtÅrsak?.begrunnelser.map((begrunnelse) => (
                            <Checkbox
                                value={begrunnelse.type}
                                key={begrunnelse.type}
                            >
                                {begrunnelse.navn}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                    {valideringsfeil.length > 0 && (
                        <Box
                            background={"bg-default"}
                            borderColor="border-danger"
                            padding="4"
                            borderWidth="2"
                            borderRadius="xlarge"
                        >
                            {valideringsfeil.map((feil) => (
                                <Alert key={feil} inline variant="error">
                                    {feil}
                                </Alert>
                            ))}
                        </Box>
                    )}
                </form>
                <ModalKnapper>
                    <Button variant="secondary" onClick={onClose}>
                        Avbryt
                    </Button>
                    <Button
                        onClick={() => {
                            if (!valgtÅrsak || valgteBegrunnelser.length == 0) {
                                if (
                                    !valideringsfeil.includes(
                                        "Du må velge minst én begrunnelse",
                                    )
                                ) {
                                    setValideringsfeil([
                                        ...valideringsfeil,
                                        "Du må velge minst én begrunnelse",
                                    ]);
                                }
                                return;
                            }
                            const valgtÅrsakDto: ValgtÅrsakDto = {
                                type: valgtÅrsak.type,
                                begrunnelser: valgteBegrunnelser,
                            };
                            lagre(valgtÅrsakDto);
                            setValideringsfeil([]);
                        }}
                    >
                        Lagre
                    </Button>
                </ModalKnapper>
            </Modal.Body>
        </StyledModal>
    );
};
