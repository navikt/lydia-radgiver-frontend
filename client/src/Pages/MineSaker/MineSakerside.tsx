import { useHentBrukerinformasjon } from "../../api/lydia-api/bruker";
import { useHentMineSaker } from "../../api/lydia-api/sak";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import FiltreringMineSaker from "./Filter/FiltreringMineSaker";
import React, { useEffect, useMemo, useState } from "react";
import { MineSakerKort } from "./MineSakerKort";
import { ARKIV_STATUSER } from "./Filter/StatusFilter";
import { Sorteringsknapper } from "./Sorteringsknapper";
import {
    loggBrukerFulgteRedirectlenkeMedSøk,
    loggBrukerRedirigertMedSøkAlert,
    loggSideLastet,
} from "../../util/analytics-klient";
import { loggMineSakerFilterEndringMedAnalytics } from "./loggFilterEndringMedAnalytics";
import { Alert, Heading, Link } from "@navikt/ds-react";
import { useLocation, NavLink } from "react-router-dom";
import styles from "./minesaker.module.scss";

export const EIER_FØLGER_FILTER_VALUES = ["eier", "følger"] as const;
export type EierFølgerFilterType = (typeof EIER_FØLGER_FILTER_VALUES)[number][];

export type SøkFilterType = string;

export type SetMinesakerFiltreType = {
    setStatusFilter: (val: IAProsessStatusType[]) => void;
    setSøkFilter: (val: string) => void;
    setEierFølgerFilter: (val: EierFølgerFilterType) => void;
};

export const MineSakerside = () => {
    useEffect(() => {
        loggSideLastet("Minesakerside");
    }, []);

    const { data: mineSaker } = useHentMineSaker();
    const { data: brukerInfo } = useHentBrukerinformasjon();

    const [sortBy, setSortBy] = useState<"date" | "alphabetical">("date");
    const [isAscending, setIsAscending] = useState(false);

    const [statusFilter, setStatusFilter] = useState<IAProsessStatusType[]>([]);
    const [eierFølgerFilter, setEierFølgerFilter] =
        useState<EierFølgerFilterType>([]);
    const [søkFilter, setSøkFilter] = useState<SøkFilterType>("");

    const filtretSaker = useMemo(
        () =>
            mineSaker
                ?.filter((sak) =>
                    statusFilter.length
                        ? statusFilter.includes(sak.iaSak.status)
                        : !ARKIV_STATUSER.includes(sak.iaSak.status),
                )
                .filter((sak) =>
                    eierFølgerFilter.length
                        ? (sak.iaSak.eidAv == brukerInfo?.ident &&
                              eierFølgerFilter.includes("eier")) ||
                          (eierFølgerFilter.includes("følger") &&
                              sak.iaSak.eidAv != brukerInfo?.ident)
                        : true,
                )
                .filter(
                    (sak) =>
                        sak.orgnavn
                            .toLowerCase()
                            .includes(søkFilter.toLowerCase()) ||
                        sak.iaSak.orgnr
                            .toLowerCase()
                            .includes(søkFilter.toLowerCase()),
                ),
        [mineSaker, statusFilter, eierFølgerFilter, brukerInfo, søkFilter],
    );

    useEffect(() => {
        loggMineSakerFilterEndringMedAnalytics(
            statusFilter,
            søkFilter,
            eierFølgerFilter,
        );
    }, [statusFilter, eierFølgerFilter, søkFilter]);

    const sorterteSaker = (() => {
        if (!filtretSaker) return [];

        return [...filtretSaker].sort((a, b) => {
            if (sortBy === "date") {
                const dateA =
                    a.iaSak.endretTidspunkt?.getTime() ??
                    a.iaSak.opprettetTidspunkt.getTime();
                const dateB =
                    b.iaSak.endretTidspunkt?.getTime() ??
                    b.iaSak.opprettetTidspunkt.getTime();
                return isAscending ? dateA - dateB : dateB - dateA;
            } else {
                const navnA = a.orgnavn.toLowerCase();
                const navnB = b.orgnavn.toLowerCase();
                if (navnA < navnB) return isAscending ? -1 : 1;
                if (navnA > navnB) return isAscending ? 1 : -1;
                return 0;
            }
        });
    })();

    const handleSortChange = (
        newSortBy: "date" | "alphabetical",
        newIsAscending: boolean,
    ) => {
        setSortBy(newSortBy);
        setIsAscending(newIsAscending);
    };

    return (
        <div className={styles.mineSakerSide}>
            <BrukerBleRedirectedBanner />
            <div className={styles.mineSakerHeaderContainer}>
                <Heading level="2" size="large">
                    Mine virksomheter
                </Heading>
                <Sorteringsknapper onSortChange={handleSortChange} />
            </div>
            <div className={styles.minesakerFlex}>
                <div className={styles.stickyfilter}>
                    <FiltreringMineSaker
                        setFiltre={{
                            setEierFølgerFilter,
                            setStatusFilter,
                            setSøkFilter,
                        }}
                    />
                </div>
                <div className={styles.mineSakerListe}>
                    {sorterteSaker.length === 0 ? (
                        <div>Fant ingen saker </div>
                    ) : (
                        sorterteSaker.map((minsak) => (
                            <MineSakerKort
                                key={minsak.iaSak.saksnummer}
                                {...minsak}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

function BrukerBleRedirectedBanner() {
    const [show, setShow] = React.useState(true);
    const { state } = useLocation();
    React.useEffect(() => {
        if (state?.redirected?.search?.length > 0) {
            loggBrukerRedirigertMedSøkAlert();
        }
    }, [state]);

    if (show && state?.redirected?.search?.length > 0) {
        return (
            <Alert
                className={styles.styledAlert}
                variant="info"
                size="small"
                closeButton
                onClose={() => setShow(false)}
                contentMaxWidth={false}
            >
                <Heading size="small" level="3" spacing>
                    Ny landingsside for saksbehandler og lesetilgang
                </Heading>
                Nå lander alle med rollen saksbehandler og lesetilgang
                automatisk på Mine virksomheter. Superbrukere vil fortsatt lande
                på prioriteringssiden.
                <br />
                Følg{" "}
                <Link
                    as={NavLink}
                    onClick={() => loggBrukerFulgteRedirectlenkeMedSøk()}
                    to={`/prioritering${state.redirected.search}`}
                >
                    denne lenken
                </Link>{" "}
                for å komme til ditt lagrede søk på prioriterinssiden.
                <br />
            </Alert>
        );
    }

    return null;
}
