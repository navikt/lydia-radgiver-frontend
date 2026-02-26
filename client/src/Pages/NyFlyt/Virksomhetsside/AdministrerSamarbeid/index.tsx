import React from "react";
import { ActionMenu, Button } from "@navikt/ds-react";
import { useHentTeam } from "../../../../api/lydia-api/team";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../../api/lydia-api/bruker";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import {
    CheckmarkCircleIcon,
    ChevronDownIcon,
    DocPencilIcon,
    TrashIcon,
    XMarkIcon,
} from "@navikt/aksel-icons";
import EndreSamarbeidsnavnModal from "./EndreSamarbeidsnavnModal";
import SlettSamarbeidModal from "./SlettSamarbeidModal";
import FullførSamarbeidModal from "./FullførSamarbeidModal";
import AvbrytSamarbeidModal from "./AvbrytSamarbeidModal";

export default function AdministrerSamarbeid({
    iaSak,
    valgtSamarbeid,
    alleSamarbeid,
}: {
    iaSak?: IASak;
    valgtSamarbeid?: IaSakProsess | null;
    alleSamarbeid?: IaSakProsess[];
}) {
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
    if (!kanEndreSpørreundersøkelser || !samarbeidKanEndres || !erIÅpenSak) {
        return null;
    }
    const endreSamarbeidsnavnRef = React.useRef<HTMLDialogElement>(null);
    const slettSamarbeidRef = React.useRef<HTMLDialogElement>(null);
    const fullførSamarbeidRef = React.useRef<HTMLDialogElement>(null);
    const avbrytSamarbeidRef = React.useRef<HTMLDialogElement>(null);

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
                        onSelect={() => slettSamarbeidRef.current?.showModal()}
                        icon={<TrashIcon aria-hidden />}
                    >
                        Slett
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
                samarbeid={valgtSamarbeid}
                alleSamarbeid={alleSamarbeid}
            />
            <SlettSamarbeidModal ref={slettSamarbeidRef} />
            <FullførSamarbeidModal ref={fullførSamarbeidRef} />
            <AvbrytSamarbeidModal ref={avbrytSamarbeidRef} />
        </>
    );
}
