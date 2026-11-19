import { Sykefraværsmål } from "./målskjema";
import { Sykefraværsmålseksjon } from "./Sykefraværsmålseksjon";

export function Sykefraværsmåldialog({
    open,
    onOpenChange,
    lagret,
    onLagre,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lagret: Sykefraværsmål[];
    onLagre: (liste: Sykefraværsmål[]) => Promise<Sykefraværsmål[]>;
}) {
    return (
        <Sykefraværsmålseksjon
            open={open}
            onOpenChange={onOpenChange}
            lagret={lagret}
            onLagre={onLagre}
        />
    );
}
