import { IASak } from "../../../domenetyper/domenetyper";
import { Samarbeidsmål } from "./målskjema";
import { Samarbeidsmålseksjon } from "./Samarbeidsmålseksjon";

export function Samarbeidsmåldialog({
    open,
    onOpenChange,
    lagret,
    onLagre,
    iaSak,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lagret: Samarbeidsmål[];
    onLagre: (liste: Samarbeidsmål[]) => Promise<Samarbeidsmål[]>;
    iaSak: IASak;
}) {
    return (
        <Samarbeidsmålseksjon
            open={open}
            onOpenChange={onOpenChange}
            lagret={lagret}
            onLagre={onLagre}
            iaSak={iaSak}
        />
    );
}
