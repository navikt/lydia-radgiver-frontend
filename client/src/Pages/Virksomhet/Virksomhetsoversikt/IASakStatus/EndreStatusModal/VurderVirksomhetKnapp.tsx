import { Button, ButtonProps } from "@navikt/ds-react";
import { IASakshendelseTypeEnum } from "../../../../../domenetyper/domenetyper";
import { penskrivIASakshendelsestype } from "./penskrivIASakshendelsestype";
import { knappeTypeFraSakshendelsesType } from "./knappeTypeFraSakshendelsesType";

interface Props {
    onClick: () => void;
    loading: ButtonProps["loading"];
}

export const VurderVirksomhetKnapp = ({ onClick, loading }: Props) => {
    return (
        <Button
            onClick={onClick}
            variant={knappeTypeFraSakshendelsesType(
                IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            )}
            size={"small"}
            loading={loading}
        >
            {penskrivIASakshendelsestype(
                IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            )}
        </Button>
    );
};
