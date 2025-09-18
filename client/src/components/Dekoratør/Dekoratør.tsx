import { BodyShort, Dropdown, InternalHeader } from "@navikt/ds-react";
import { Søkefelt } from "./Søkefelt";
import { Brukerinformasjon as BrukerinformasjonType } from "../../domenetyper/brukerinformasjon";
import { SesjonBanner } from "../Banner/SesjonBanner";
import { NyStatistikkPubliseresBanner } from "../Banner/NyStatistikkPubliseresBanner";
import { LeaveIcon } from "@navikt/aksel-icons";
import { InternLenke } from "../InternLenke";
import styles from './dekoratør.module.scss';

export const erIDev = [
    "localhost",
    "fia.intern.dev.nav.no",
    "fia.ekstern.dev.nav.no",
    "fia.ansatt.dev.nav.no",
    "demo-fia.ansatt.dev.nav.no",
].includes(window.location.hostname);

const loggUt = () => {
    window.location.assign("/oauth2/logout");
};

interface Props {
    brukerInformasjon: BrukerinformasjonType;
}

const visDemoBanner = erIDev;

export const Dekoratør = ({ brukerInformasjon }: Props) => {
    return (
        <>
            <InternalHeader className={`w-full ${styles.internalHeader}`} data-theme="light">
                <nav className={styles.navigasjon}>
                    <a className={styles['tilHovedinnhold']} href="#maincontent">
                        Hopp til hovedinnhold
                    </a>
                    <InternLenke
                        className={styles.navigasjonslenke}
                        href="/prioritering"
                        title="Gå til prioriteringsiden"
                    >
                        <InternalHeader.Title as="h1">Fia</InternalHeader.Title>
                    </InternLenke>
                    <InternLenke
                        className={styles.navigasjonslenke}
                        href="/statusoversikt"
                        title="Gå til statusoversiktsiden"
                    >
                        <InternalHeader.Title as="span">
                            Statusoversikt
                        </InternalHeader.Title>
                    </InternLenke>
                    <InternLenke
                        className={styles.navigasjonslenke}
                        href="/minesaker"
                        title="Gå til mine saker"
                    >
                        <InternalHeader.Title as="span">
                            Mine saker
                        </InternalHeader.Title>
                    </InternLenke>
                </nav>
                <BodyShort className={`${styles.demoversjonTekst} ${visDemoBanner ? '' : styles.hidden}`}>
                    Demoutgave
                </BodyShort>
                <div className={styles.søkOgBrukerinfo}>
                    <Søkefelt className={styles.virksomhetssøk} />
                    <Dropdown>
                        <InternalHeader.UserButton
                            as={Dropdown.Toggle}
                            name={brukerInformasjon.navn}
                            description={brukerInformasjon.rolle}
                        />
                        <Dropdown.Menu>
                            <dl>
                                <BodyShort as="dt" size="medium">
                                    Du er logget inn som:
                                </BodyShort>
                                <BodyShort as="dd" size="medium">
                                    {brukerInformasjon.ident}
                                </BodyShort>
                            </dl>
                            <Dropdown.Menu.List>
                                <Dropdown.Menu.List.Item
                                    onClick={() => loggUt()}
                                >
                                    Logg ut{" "}
                                    <LeaveIcon aria-hidden fontSize="1.5rem" />
                                </Dropdown.Menu.List.Item>
                            </Dropdown.Menu.List>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </InternalHeader>
            <SesjonBanner tokenUtløper={brukerInformasjon.tokenUtloper} />
            <NyStatistikkPubliseresBanner />
        </>
    );
};
