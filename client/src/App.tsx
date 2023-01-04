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
                <Footer />
            </AppRamme>
        </>
    ) : null;
}

const AppRamme = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 ${contentSpacing.mobileX};

  ${desktopAndUp} {
    padding: 0 ${contentSpacing.desktopX};
  }

  ${largeDesktopAndUp} {
    padding: 0 ${contentSpacing.largeDesktopX};
  }
`;

export default App;
