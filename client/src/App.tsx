import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import { Header } from "@navikt/ds-react-internal";
import { useHentBrukerinformasjon } from "./api/lydia-api";
import { NavAnsatt } from "./domenetyper";
import Prioriteringsside from "./Pages/Prioritering/Prioriteringsside";

function App() {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    return (
        <div className="App">
            <Dekoratør navAnsatt={brukerInformasjon} />
            <Prioriteringsside />
        </div>
    );
}

const Dekoratør = ({ navAnsatt }: { navAnsatt?: NavAnsatt }) => (
    <Header className="w-full">
        <Header.Title as="h1">Lydia</Header.Title>
        {navAnsatt && (
            <Header.User
                name={navAnsatt.navn}
                description={navAnsatt.ident}
                style={{ marginLeft: "auto" }}
            />
        )}
    </Header>
);

export default App;
