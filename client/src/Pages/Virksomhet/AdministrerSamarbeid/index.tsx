import {
    CheckmarkCircleIcon,
    ChevronDownIcon,
    DocPencilIcon,
    TrashIcon,
    XMarkIcon,
} from "@navikt/aksel-icons";
import { ActionMenu, Button } from "@navikt/ds-react";
import React from "react";
import { IASak } from "@/domenetyper/domenetyper";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "@features/bruker/api/bruker";
import { useHentTeam } from "@features/bruker/api/team";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import { useKanUtføreHandlingPåSamarbeid } from "@features/virksomhet/api/virksomhet";
import AvbrytSamarbeidModal from "./AvbrytSamarbeidModal";
import EndreSamarbeidsnavnModal from "./EndreSamarbeidsnavnModal";
import FullførSamarbeidModal from "./FullførSamarbeidModal";
import SlettSamarbeidModal from "./SlettSamarbeidModal";

export default function AdministrerSamarbeid({
    iaSak,
    valgtSamarbeid,
    alleSamarbeid,
}: {
    iaSak?: IASak;
    valgtSamarbeid?: IaSakProsess | null;
    alleSamarbeid?: IaSakProsess[];
}) {
    const { mutate: refetchKanSletteResultat } =
        useKanUtføreHandlingPåSamarbeid(
            iaSak?.orgnr,
            iaSak?.saksnummer,
            valgtSamarbeid?.id,
            "slettes",
        );
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const kanEndreSpørreundersøkelser =
        (erSaksbehandler(brukerInformasjon) &&
            (brukerFølgerSak || brukerErEierAvSak)) ||
        false;
    const samarbeidKanEndres =
        valgtSamarbeid &&
        !["AVBRUTT", "SLETTET", "FULLFØRT"].includes(valgtSamarbeid.status);
    const erIÅpenSak =
        iaSak &&
        ![
            "IKKE_AKTIV",
            "IKKE_AKTUELL",
            "FULLFØRT",
            "SLETTET",
            "AVBRUTT",
        ].includes(iaSak.status);
    const endreSamarbeidsnavnRef = React.useRef<HTMLDialogElement>(null);
    const slettSamarbeidRef = React.useRef<HTMLDialogElement>(null);
    const fullførSamarbeidRef = React.useRef<HTMLDialogElement>(null);
    const avbrytSamarbeidRef = React.useRef<HTMLDialogElement>(null);

    if (!kanEndreSpørreundersøkelser || !samarbeidKanEndres || !erIÅpenSak) {
        // TODO: Skal vi faktisk sperre her?
        return null;
    }

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant="secondary"
                        size="small"
                        icon={<ChevronDownIcon aria-hidden />}
                        iconPosition="right"
                    >
                        Administrer
                    </Button>
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Item
                        onSelect={() =>
                            endreSamarbeidsnavnRef.current?.showModal()
                        }
                        icon={<DocPencilIcon aria-hidden />}
                    >
                        Endre samarbeidsnavn
                    </ActionMenu.Item>
                    <ActionMenu.Item
                        onSelect={() => {
                            refetchKanSletteResultat();
                            slettSamarbeidRef.current?.showModal();
                        }}
                        icon={<TrashIcon aria-hidden />}
                    >
                        Slett samarbeidet
                    </ActionMenu.Item>
                    <ActionMenu.Group label="Avslutt samarbeidet">
                        <ActionMenu.Item
                            onSelect={() =>
                                fullførSamarbeidRef.current?.showModal()
                            }
                            icon={<CheckmarkCircleIcon aria-hidden />}
                        >
                            Fullfør
                        </ActionMenu.Item>
                        <ActionMenu.Item
                            onSelect={() =>
                                avbrytSamarbeidRef.current?.showModal()
                            }
                            icon={<XMarkIcon aria-hidden />}
                        >
                            Avbryt
                        </ActionMenu.Item>
                    </ActionMenu.Group>
                </ActionMenu.Content>
            </ActionMenu>
            <EndreSamarbeidsnavnModal
                ref={endreSamarbeidsnavnRef}
                iaSak={iaSak}
                valgtSamarbeid={valgtSamarbeid}
                alleSamarbeid={alleSamarbeid}
            />
            <SlettSamarbeidModal
                ref={slettSamarbeidRef}
                iaSak={iaSak}
                valgtSamarbeid={valgtSamarbeid}
                alleSamarbeid={alleSamarbeid}
            />
            <FullførSamarbeidModal
                ref={fullførSamarbeidRef}
                iaSak={iaSak}
                valgtSamarbeid={valgtSamarbeid}
                alleSamarbeid={alleSamarbeid}
            />
            <AvbrytSamarbeidModal
                ref={avbrytSamarbeidRef}
                iaSak={iaSak}
                valgtSamarbeid={valgtSamarbeid}
                alleSamarbeid={alleSamarbeid}
            />
        </>
    );
}
