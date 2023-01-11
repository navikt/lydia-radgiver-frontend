import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import { useHentBrukerinformasjon } from "./api/lydia-api";
import Prioriteringsside from "./Pages/Prioritering/Prioriteringsside";
import { desktopAndUp, largeDesktopAndUp } from "./styling/breakpoint";
import Virksomhetsside from "./Pages/Virksomhet/Virksomhetsside";
import { FeilmeldingBanner } from "./Pages/FeilmeldingBanner";
import { Dekoratør } from "./components/Dekoratør/Dekoratør";
import { TittelContext, TittelProvider } from "./Pages/Prioritering/TittelContext";
import { contentSpacing } from "./styling/contentSpacing";
import { Footer } from "./components/Footer/Footer";

const App = () =>
    <BrowserRouter>
        <TittelProvider>
            <AppContent />
        </TittelProvider>
    </BrowserRouter>

const AppContent = () => {
    const { tittel } = useContext(TittelContext)
    document.title = tittel

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    return brukerInformasjon ? (
        <>
            <Dekoratør brukerInformasjon={brukerInformasjon} />
            <FeilmeldingBanner />
            <AppRamme>
                <Routes>
                    <Route
                        path={"/"}
                        element={<Prioriteringsside />}
                    />
                    <Route
                        path={"/virksomhet/:orgnummer"}
                        element={<Virksomhetsside />}
                    />
                </Routes>
            </AppRamme>
            <Footer />
        </>
    ) : null;
}

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
