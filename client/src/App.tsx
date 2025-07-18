import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import "@navikt/ds-css";
import { useHentBrukerinformasjon } from "./api/lydia-api/bruker";
import { Prioriteringsside } from "./Pages/Prioritering/Prioriteringsside";
import { desktopAndUp, largeDesktopAndUp } from "./styling/breakpoints";
import { Virksomhetsside } from "./Pages/Virksomhet/Virksomhetsside";
import { FeilmeldingBanner } from "./components/Banner/FeilmeldingBanner";
import { Dekoratør, erIDev } from "./components/Dekoratør/Dekoratør";
import { contentSpacing } from "./styling/contentSpacing";
import { Footer } from "./components/Footer/Footer";
import { Statusoversiktside } from "./Pages/Statusoversikt/Statusoversiktside";
import { BodyShort, Link, Loader } from "@navikt/ds-react";
import { redirectUrl } from "./components/Banner/SesjonBanner";
import { setTilgangsnivå } from "./util/amplitude-klient";
import { MineSakerside } from "./Pages/MineSaker/MineSakerside";
import { Samarbeidsside } from "./Pages/Virksomhet/Samarbeid/Samarbeidsside";
import SmartStartsideRedirect from "./components/SmartStartsideRedirect";

const App = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

const PrøvÅLoggInnPåNytt = () => (
    <BodyShort>
        Du kan prøve å logge inn på nytt ved å trykke på{" "}
        <Link href={redirectUrl}>denne lenken</Link>.
    </BodyShort>
);

const AppContent = () => {
    const {
        data: brukerInformasjon,
        loading,
        error,
    } = useHentBrukerinformasjon();

    useEffect(() => {
        if (brukerInformasjon) {
            setTilgangsnivå(brukerInformasjon.rolle);
        }
    }, [brukerInformasjon]);

    useEffect(() => {
        // Gjør favicon rød i dev og demo
        const erIPride = new Date().getMonth() === 5; // Juni er pride-måned
        if (erIDev || erIPride) {
            let link_prod = document.querySelector(
                "link[rel~='icon']",
            ) as HTMLLinkElement | null;
            if (!link_prod) {
                link_prod = document.createElement("link");
                link_prod.rel = "icon";
                document.getElementsByTagName("head")[0].appendChild(link_prod);
            }

            if (erIDev) { // Rød i dev og demo    
                const link_dev = document.querySelector(
                    "link[rel~='icon_red']",
                ) as HTMLLinkElement | null;
                if (link_dev !== null) {
                    link_prod.href = link_dev.href;
                }
            } else if (erIPride) { // Regnbue i juni i prod
                const link_rainbow = document.querySelector(
                    "link[rel~='icon_rainbow']",
                ) as HTMLLinkElement | null;
                if (link_rainbow !== null) {
                    link_prod.href = link_rainbow.href;
                }
            }
        }
    }, [erIDev]);

    if (loading) {
        return <Loader size="xlarge" />;
    } else if (error) {
        return (
            <>
                <BodyShort>Noe gikk feil ved innlasting av siden.</BodyShort>
                <PrøvÅLoggInnPåNytt />
            </>
        );
    } else if (!brukerInformasjon) {
        return (
            <>
                <BodyShort>
                    Det ser ikke ut til at du har en gyldig innlogging til Fia.
                </BodyShort>
                <PrøvÅLoggInnPåNytt />
            </>
        );
    }

    return (
        <>
            <Dekoratør brukerInformasjon={brukerInformasjon} />
            <FeilmeldingBanner />
            <AppRamme id="maincontent">
                <Routes>
                    <Route path={"/"} element={<SmartStartsideRedirect />} />
                    <Route path={"/prioritering"} element={<Prioriteringsside />} />
                    <Route
                        path={"/statusoversikt"}
                        element={<Statusoversiktside />}
                    />
                    <Route
                        path={"/virksomhet/:orgnummer"}
                        element={<Virksomhetsside />}
                    />
                    <Route
                        path={
                            "/virksomhet/:orgnummer/sak/:saksnummer/samarbeid/:prosessId"
                        }
                        element={<Samarbeidsside />}
                    />
                    <Route path={"/minesaker"} element={<MineSakerside />} />
                </Routes>
            </AppRamme>
            <Footer />
        </>
    );
};

const AppRamme = styled.main`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    padding: 0 ${contentSpacing.mobileX} 1.5rem;

    ${desktopAndUp} {
        padding-left: ${contentSpacing.desktopX};
        padding-right: ${contentSpacing.desktopX};
    }

    ${largeDesktopAndUp} {
        padding-left: ${contentSpacing.largeDesktopX};
        padding-right: ${contentSpacing.largeDesktopX};
    }
`;

export default App;
