import {
    GyldigNesteHendelse,
    IASak,
} from "../../../../domenetyper/domenetyper";
import React from "react";
import { Dropdown, Heading, HStack } from "@navikt/ds-react";
import Historikk from "../../../Virksomhet/Virksomhetsoversikt/IASakStatus/EndreStatusModal/Historikk";
import {
    StatusHendelseSteg,
    Statusknapper,
} from "../../../Virksomhet/Virksomhetsoversikt/IASakStatus/EndreStatusModal/Statusknapper";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import {
    useHentSakshistorikk,
    useHentVirksomhetsinformasjon,
} from "../../../../api/lydia-api/virksomhet";
import { useHentSakForVirksomhet } from "../../../../api/lydia-api/virksomhet";
import { SaksgangDropdownToggle } from "./SaksgangDropdownToggle";

import styles from "./virksomhetsinfoheader.module.scss";

export function SaksgangDropdown({
    virksomhet,
    iaSak,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
}) {
    return <SaksgangDropdownInnhold virksomhet={virksomhet} iaSak={iaSak} />;
}

function SaksgangDropdownInnhold({
    virksomhet,
    iaSak,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
}) {
    const [open, setOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const [nesteSteg, setNesteSteg] = React.useState<{
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }>({ nesteSteg: null, hendelse: null });

    const { mutate: mutateVirksomhet } = useHentVirksomhetsinformasjon(
        virksomhet.orgnr,
    );

    const {
        mutate: mutateSamarbeidshistorikk,
        validating: validatingSamarbeidshistorikk,
        loading: loadingSamarbeidshistorikk,
    } = useHentSakshistorikk(virksomhet.orgnr);

    const {
        mutate: mutateSak,
        validating: validatingSak,
        loading: loadingSak,
    } = useHentSakForVirksomhet(virksomhet.orgnr, iaSak?.saksnummer);

    const lasterEllerRevaliderer =
        validatingSamarbeidshistorikk ||
        loadingSamarbeidshistorikk ||
        validatingSak ||
        loadingSak;

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
                ref={dropdownRef}
            >
                <Heading className={styles.dropdownHeader} size="medium">
                    Endre status
                </Heading>
                <HStack
                    className={`${styles.historikkContainer} ${nesteSteg.nesteSteg !== null ? styles.begrensHøyde : ""}`}
                >
                    {iaSak && <Historikk sak={iaSak} />}
                </HStack>
                <br />
                <Statusknapper
                    virksomhet={virksomhet}
                    onStatusEndret={() => {
                        mutateIASakerOgSamarbeidshistorikk();
                    }}
                    setModalOpen={setOpen}
                    iaSak={iaSak}
                    nesteSteg={nesteSteg}
                    setNesteSteg={(...ns) => {
                        if (ns[0].nesteSteg !== null) {
                            dropdownRef.current?.scrollTo({
                                top: dropdownRef.current.scrollHeight,
                                behavior: "smooth",
                            });
                        }
                        setNesteSteg(...ns);
                    }}
                    redusertPadding
                    loading={lasterEllerRevaliderer}
                />
            </Dropdown.Menu>
        </Dropdown>
    );
}
