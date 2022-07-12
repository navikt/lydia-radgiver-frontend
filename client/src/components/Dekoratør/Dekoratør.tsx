import {Brukerinformasjon, SykefraversstatistikkVirksomhet, VirksomhetSøkeresultat} from "../../domenetyper";
import {Alert, BodyShort, Link, Popover, Search} from "@navikt/ds-react";
import {Header} from "@navikt/ds-react-internal";
import {useContext, useEffect, useRef, useState} from "react";
import {TittelContext} from "../../Pages/Prioritering/TittelContext";
import {sykefraværsstatistikkMock} from "../../Pages/Prioritering/mocks/sykefraværsstatistikkMock";
import {useDebounce} from "../../util/useDebounce";
import {virksomhetAutocompletePath, virksomhetsPath} from "../../api/lydia-api";

interface Props {
    brukerInformasjon: Brukerinformasjon
}

const FEM_MINUTTER_SOM_MS = 1000 * 60 * 5

const testfirmaer = sykefraværsstatistikkMock

const hentRedirectUrl = () =>
    `${document.location.origin}/oauth2/login?redirect=${document.location.href}`

const hentGjenværendeTidForBrukerMs = (brukerInformasjon: Brukerinformasjon) =>
    brukerInformasjon.tokenUtløper - Date.now()

const tokenHolderPåÅLøpeUt = (brukerInformasjon: Brukerinformasjon) =>
    hentGjenværendeTidForBrukerMs(brukerInformasjon) < FEM_MINUTTER_SOM_MS

export const Dekoratør = ({brukerInformasjon}: Props) => {
    const {tittel} = useContext(TittelContext)
    const [søkestreng, setSøkestreng] = useState("")
    const [firmaer, setFirmaer] = useState<VirksomhetSøkeresultat[]>([])
    const searchRef = useRef<HTMLDivElement | null>(null)
    const [gjenværendeTidForBrukerMs, setGjenværendeTidForBrukerMs] = useState(
        hentGjenværendeTidForBrukerMs(brukerInformasjon)
    )
    const faktiskSøkestreng = useDebounce(søkestreng, 300)

    useEffect(() => {
        if (faktiskSøkestreng.length) {
            fetch(`${virksomhetAutocompletePath}?q=${faktiskSøkestreng}`)
                .then(res => res.json())
                .then((data: VirksomhetSøkeresultat[]) => setFirmaer(data))
        }
    }, [faktiskSøkestreng])

    useEffect(() => {
        const interval = setInterval(() => {
            setGjenværendeTidForBrukerMs(hentGjenværendeTidForBrukerMs(brukerInformasjon))
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Header className="w-full">
                <Header.Title as="h1">{tittel}</Header.Title>
                <div data-theme="dark">
                    <Search
                        ref={searchRef}
                        label="Søk etter virksomhet"
                        variant="primary"
                        onChange={(innhold) => setSøkestreng(innhold)}
                        onClear={() => setSøkestreng("")}
                    />
                    <Popover
                        anchorEl={searchRef.current}
                        open={søkestreng !== ""}
                        onClose={() => null}
                        placement="bottom-start"
                        arrow={false}
                    >
                        {!!firmaer.length && <Popover.Content style={{ color: 'black'}}>
                            {firmaer.map(firma => (
                                <p key={firma.orgnr}>{firma.navn}</p>
                            ))}
                        </Popover.Content>}
                    </Popover>
                </div>
                {brukerInformasjon && (
                    <Header.User
                        name={brukerInformasjon.navn}
                        description={brukerInformasjon.ident}
                        style={{marginLeft: "auto"}}
                    />
                )}
            </Header>
            {tokenHolderPåÅLøpeUt(brukerInformasjon) &&
                <RedirectKomponent gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs}/>}
        </>
    )
}

const RedirectKomponent = ({gjenværendeTidForBrukerMs}: { gjenværendeTidForBrukerMs: number }) => {
    return gjenværendeTidForBrukerMs > 0
        ? <SesjonenHolderPåÅLøpeUt gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs}/>
        : <SesjonenErUtløpt/>
}

const SesjonenHolderPåÅLøpeUt = ({gjenværendeTidForBrukerMs}: { gjenværendeTidForBrukerMs: number }) => {
    const gjenværendeSekunder = Math.round(gjenværendeTidForBrukerMs / 1000)
    return (
        <Alert variant="warning" style={{margin: "1rem"}}>
            <BodyShort>
                Sesjonen din løper ut om {gjenværendeSekunder} sekunder. Vennligst trykk på <Link
                href={hentRedirectUrl()}>denne lenken</Link> for å logge inn på nytt
            </BodyShort>
        </Alert>
    )
}

const SesjonenErUtløpt = () =>
    <Alert variant="error" style={{margin: "1rem"}}>
        <BodyShort>
            Sesjonen din er utløpt. Vennligst trykk på <Link href={hentRedirectUrl()}>denne lenken</Link> for å logge
            inn på nytt
        </BodyShort>
    </Alert>
