import styled from "styled-components";
import { BodyShort, Dropdown, InternalHeader, Link } from "@navikt/ds-react";
import { Søkefelt } from "./Søkefelt";
import { NavFarger } from "../../styling/farger";
import { Brukerinformasjon as BrukerinformasjonType } from "../../domenetyper/brukerinformasjon";
import { SesjonBanner } from "../Banner/SesjonBanner";
import { NyStatistikkPubliseresBanner } from "../Banner/NyStatistikkPubliseresBanner";
import { mobileAndUp, tabletAndUp } from "../../styling/breakpoints";
import { LeaveIcon } from "@navikt/aksel-icons";

// Stylinga her er tatt fra navikt/nav-dekoratøren (15.12.2023)
const TilHovedinnhold = styled.a`
    clip: rect(0 0 0 0);
    border: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    z-index: 1001;

    &:focus {
        clip: auto;
        height: 2.625rem;
        margin: 0;
        overflow: visible;
        padding: 0.8rem;
        position: absolute;
        width: auto;

        background-color: var(--a-border-focus);
        box-shadow: 0 0 0 2px var(--a-border-focus);
        color: #fff;
        outline: none;
        text-decoration: none;
    }
`;

const StyledInternalHeader = styled(InternalHeader)`
    min-height: unset; // Motvirkar "min-height: 3rem" frå designsystemet som gjer at boksen ikkje får bakgrunn på alt når den wrapper

    flex-wrap: wrap;
    flex-direction: column;

    ${mobileAndUp} {
        // Alt utanom pittesmå skjermar
        flex-direction: row;
    }
`;

const Navigasjon = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: start;

    /* Overskriv border-right når navigasjonslenkene vert vist i kolonne */
    & .navds-internalheader__title {
        border-right: none;
    }

    ${tabletAndUp} {
        flex-direction: row;
        align-items: center;

        & .navds-internalheader__title {
            /* Stylinga vi overskriv frå designsystemet (2023-12-21) */
            border-right: 1px solid
                var(--ac-internalheader-divider, var(--a-gray-600));
        }
    }
`;

const Navigasjonslenke = styled(Link)`
    color: ${NavFarger.textInverted};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const DemoversjonTekst = styled(BodyShort)<{ hidden: boolean }>`
    display: ${(props) => (props.hidden ? "none" : "flex")};
    justify-content: center;
    align-items: center;

    padding: 0 1.5rem;

    color: ${NavFarger.white};
    background: ${NavFarger.red500};
`;

const SøkOgBrukerinfoContainer = styled.div`
    flex: 1;

    display: flex;
    flex-direction: column;

    ${mobileAndUp} {
        flex-direction: row;
    }
`;

const Virksomhetssøk = styled(Søkefelt)`
    min-width: 16rem;
    width: 25%;

    align-self: center;

    /* Sentrerer søkeboks i det ledig området */
    margin-left: auto;
    margin-right: auto;
`;

export const erIDev = [
    "localhost",
    "fia.intern.dev.nav.no",
    "fia.ekstern.dev.nav.no",
    "fia.ansatt.dev.nav.no",
].includes(window.location.hostname);
export const erIDemo = ["demo-fia.ansatt.dev.nav.no"].includes(
    window.location.hostname,
);

const loggUt = () => {
    window.location.assign("/oauth2/logout");
};

interface Props {
    brukerInformasjon: BrukerinformasjonType;
}

const visDemoBanner = erIDemo || erIDev;

export const Dekoratør = ({ brukerInformasjon }: Props) => {
    return (
        <>
            <StyledInternalHeader className="w-full" data-theme="light">
                <Navigasjon>
                    <TilHovedinnhold href="#maincontent">
                        Hopp til hovedinnhold
                    </TilHovedinnhold>
                    <Navigasjonslenke href="/" title="Gå til søkesiden">
                        <InternalHeader.Title as="h1">Fia</InternalHeader.Title>
                    </Navigasjonslenke>
                    <Navigasjonslenke
                        href="/statusoversikt"
                        title="Gå til statusoversiktsiden"
                    >
                        <InternalHeader.Title as="span">
                            Statusoversikt
                        </InternalHeader.Title>
                    </Navigasjonslenke>
                    <Navigasjonslenke
                        href="/iatjenesteoversikt"
                        title="Gå til mine IA-tjenester"
                    >
                        <InternalHeader.Title as="span">
                            Mine IA-tjenester
                        </InternalHeader.Title>
                    </Navigasjonslenke>
                    <Navigasjonslenke
                        href="/minesaker"
                        title="Gå til mine saker"
                    >
                        <InternalHeader.Title as="span">
                            Mine saker
                        </InternalHeader.Title>
                    </Navigasjonslenke>
                </Navigasjon>
                <DemoversjonTekst hidden={!visDemoBanner}>
                    Demoutgave
                </DemoversjonTekst>
                <SøkOgBrukerinfoContainer>
                    <Virksomhetssøk />
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
                                <Dropdown.Menu.List.Item onClick={() => loggUt()}>
                                    Logg ut <LeaveIcon aria-hidden fontSize="1.5rem" />
                                </Dropdown.Menu.List.Item>
                            </Dropdown.Menu.List>
                        </Dropdown.Menu>
                    </Dropdown>
                </SøkOgBrukerinfoContainer>
            </StyledInternalHeader>
            <SesjonBanner tokenUtløper={brukerInformasjon.tokenUtløper} />
            <NyStatistikkPubliseresBanner />
        </>
    );
};
