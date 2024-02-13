import {Accordion, Button} from "@navikt/ds-react";
import {BekreftValgModal} from "../../../components/Modal/BekreftValgModal";
import {useState} from "react";
import {IASak} from "../../../domenetyper/domenetyper";
import {avsluttKartlegging, useHentKartlegginger} from "../../../api/lydia-api";
import {lokalDatoMedKlokkeslett} from "../../../util/dato";
import {IASakKartlegging} from "../../../domenetyper/iaSakKartlegging";

interface PågåendeKartleggingProps {
    iaSak: IASak;
    kartlegging: IASakKartlegging;
    vertId: string;
}

export const PågåendeKartleggingRad = ({
    iaSak,
    kartlegging,
    vertId,
}: PågåendeKartleggingProps) => {
    const [bekreftValgModalÅpen, setBekreftValgModalÅpen] = useState(false);
    const [
        bekreftStartKartleggingModalÅpen,
        setBekreftStartKartleggingModalÅpen,
    ] = useState(false);

    const {
        mutate: muterKartlegginger,
    } = useHentKartlegginger(iaSak.orgnr, iaSak.saksnummer);

    const avslutt = () => {
        avsluttKartlegging(iaSak.orgnr, iaSak.saksnummer, kartlegging.kartleggingId).then(
            () => {
                muterKartlegginger();
            },
        );
    };

    return (
        <Accordion.Content>
            <Button
                variant={"secondary"}
                onClick={() => setBekreftStartKartleggingModalÅpen(true)}
            >
                Start kartlegging
            </Button>
            <BekreftValgModal
                onConfirm={() =>
                    {
                        window.open(
                        `https://fia-arbeidsgiver.ekstern.dev.nav.no/${kartlegging.kartleggingId}/vert/${vertId}`,
                        )
                        setBekreftStartKartleggingModalÅpen(false);
                    }
                }
                onCancel={() => {
                    setBekreftStartKartleggingModalÅpen(false);
                }}
                åpen={bekreftStartKartleggingModalÅpen}
                title={"Før du går videre..."}
                description={
                    "Du er i ferd med å starte kartlegging med virksomhet.\n" +
                    "\n" +
                    "Når du klikker start åpnes det et nytt vindu du kan vise til deltakerne i møtet.\n" +
                    "\n" +
                    "Sørg for at alle partene er representert før du starter. " +
                    "Det er de som logger inn på neste side. Når alle har logget inn klikker du neste."
                }
            ></BekreftValgModal>
            &nbsp;
            <Button onClick={() => setBekreftValgModalÅpen(true)}>
                Fullfør
            </Button>
            <BekreftValgModal
                onConfirm={() => avslutt()}
                onCancel={() => {
                    setBekreftValgModalÅpen(false);
                }}
                åpen={bekreftValgModalÅpen}
                title="Er du sikker på at du vil fullføre denne kartleggingen?"
                description={`Kartleggingen som fullføres er "Kartlegging opprettet ${lokalDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}".`}
            />
        </Accordion.Content>
    );
};
