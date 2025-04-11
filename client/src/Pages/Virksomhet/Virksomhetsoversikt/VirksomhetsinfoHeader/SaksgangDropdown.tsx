import {
    GyldigNesteHendelse,
    IASak,
} from "../../../../domenetyper/domenetyper";
import React from "react";
import { Dropdown, Heading, HStack } from "@navikt/ds-react";
import styled from "styled-components";
import Historikk from "../IASakStatus/EndreStatusModal/Historikk";
import {
    StatusHendelseSteg,
    Statusknapper,
} from "../IASakStatus/EndreStatusModal/Statusknapper";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { useHentSakshistorikk, useHentVirksomhetsinformasjon } from "../../../../api/lydia-api/virksomhet";
import { useHentSakForVirksomhet } from "../../../../api/lydia-api/virksomhet";
import { SaksgangDropdownToggle } from "./SaksgangDropdownToggle";

const HistorikkContainer = styled(HStack) <{ $begrensHøyde: boolean }>`
    max-height: ${(props) => (props.$begrensHøyde ? "20rem" : "auto")};
    overflow-y: auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
`;

const DropdownHeader = styled(Heading)`
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 1rem;
`;

export function SaksgangDropdown({
    virksomhet,
    iaSak,
    setNyttSamarbeidModalÅpen,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    setNyttSamarbeidModalÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <SaksgangDropdownInnhold
            virksomhet={virksomhet}
            iaSak={iaSak}
            setNyttSamarbeidModalÅpen={setNyttSamarbeidModalÅpen}
        />
    );
}

function SaksgangDropdownInnhold({
    virksomhet,
    iaSak,
    setNyttSamarbeidModalÅpen,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    setNyttSamarbeidModalÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [open, setOpen] = React.useState(false);

    const [nesteSteg, setNesteSteg] = React.useState<{
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }>({ nesteSteg: null, hendelse: null });

    const { mutate: mutateVirksomhet } = useHentVirksomhetsinformasjon(virksomhet.orgnr);

    const { mutate: mutateSamarbeidshistorikk, validating: validatingSamarbeidshistorikk, loading: loadingSamarbeidshistorikk } = useHentSakshistorikk(
        virksomhet.orgnr,
    );

    const { mutate: mutateSak, validating: validatingSak, loading: loadingSak } = useHentSakForVirksomhet(
        virksomhet.orgnr,
        iaSak?.saksnummer,
    );

    const lasterEllerRevaliderer = validatingSamarbeidshistorikk || loadingSamarbeidshistorikk || validatingSak || loadingSak;

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateSak?.();
        mutateSamarbeidshistorikk?.();
        mutateVirksomhet?.();
    };

    return (
        <Dropdown
            open={open}
            onOpenChange={(newOpen) => {
                setOpen(newOpen);
                if (!newOpen) {
                    setNesteSteg({ nesteSteg: null, hendelse: null });
                }
            }}
        >
            <SaksgangDropdownToggle iaSak={iaSak} />
            <Dropdown.Menu
                style={{
                    maxWidth: "auto",
                    width: "36rem",
                    marginTop: "0.3rem",
                }}
                placement="bottom-start"
            >
                <DropdownHeader size="medium">Endre status</DropdownHeader>
                <HistorikkContainer
                    $begrensHøyde={nesteSteg.nesteSteg !== null}
                >
                    {iaSak && <Historikk sak={iaSak} />}
                </HistorikkContainer>
                <br />
                <Statusknapper
                    virksomhet={virksomhet}
                    onStatusEndret={() => {
                        mutateIASakerOgSamarbeidshistorikk();
                    }}
                    setModalOpen={setOpen}
                    iaSak={iaSak}
                    nesteSteg={nesteSteg}
                    setNesteSteg={setNesteSteg}
                    redusertPadding
                    loading={lasterEllerRevaliderer}
                    setNyttSamarbeidModalÅpen={setNyttSamarbeidModalÅpen}
                />
            </Dropdown.Menu>
        </Dropdown>
    );
}
