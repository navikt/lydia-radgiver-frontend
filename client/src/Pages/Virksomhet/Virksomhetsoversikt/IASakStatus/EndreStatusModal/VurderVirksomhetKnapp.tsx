import { Button } from "@navikt/ds-react";
import { IASakshendelseTypeEnum } from "../../../../../domenetyper/domenetyper";
import { penskrivIASakshendelsestype } from "./penskrivIASakshendelsestype";
import { knappeTypeFraSakshendelsesType } from "./knappeTypeFraSakshendelsesType";

interface Props {
    onClick: () => void;
}

export const VurderVirksomhetKnapp = ({ onClick }: Props) => {
    return (
        <Button
            onClick={onClick}
            variant={knappeTypeFraSakshendelsesType(
                IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            )}
            size={"small"}
        >
            {penskrivIASakshendelsestype(
                IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            )}
        </Button>
    );
};
