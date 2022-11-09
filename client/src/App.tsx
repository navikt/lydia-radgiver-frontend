import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import styled from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useHentBrukerinformasjon } from "./api/lydia-api";
import Prioriteringsside from "./Pages/Prioritering/Prioriteringsside";
import { Breakpoint, forLargerThan } from "./styling/breakpoint";
import Virksomhetsside from "./Pages/Virksomhet/Virksomhetsside";
import { FeilmeldingBanner } from "./Pages/FeilmeldingBanner";
import { Dekoratør } from "./components/Dekoratør/Dekoratør";
import { TittelContext, TittelProvider } from "./Pages/Prioritering/TittelContext";
import { useContext } from "react";
import { contentSpacing } from "./styling/contentSpacing";

const App = () =>
    <BrowserRouter>
        <TittelProvider>
            <AppContent />
        </TittelProvider>
    </BrowserRouter>

const AppContent = () => {
    const {tittel} = useContext(TittelContext)
    document.title = tittel

    const {data: brukerInformasjon} = useHentBrukerinformasjon();
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
        </>
    ) : null;
}

const AppRamme = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${contentSpacing.mobileX};

  ${forLargerThan(Breakpoint.Tablet)} {
    padding: 0 ${contentSpacing.desktopX};
  }

  ${forLargerThan(Breakpoint.Desktop)} {
    padding: 0 ${contentSpacing.largeDesktopX};
  }
`;


export default App;
