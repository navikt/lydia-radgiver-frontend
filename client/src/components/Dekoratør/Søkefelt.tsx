import { CSSProperties, useEffect, useRef, useState } from "react";
import { Loader, Popover, Search } from "@navikt/ds-react";
import { useDebounce } from "../../util/useDebounce";
import { virksomhetAutocompletePath } from "../../api/lydia-api";
import { VirksomhetSøkeresultat } from "../../domenetyper/domenetyper";
import { EksternLenke } from "../EksternLenke";
import { loggSøkPåVirksomhet } from "../../util/amplitude-klient";
import styled from "styled-components";

interface Props {
    className?: string;
    style?: CSSProperties;
}

export const Søkefelt = ({ style, className }: Props) => {
    const searchRef = useRef<HTMLDivElement | null>(null)
    const [firmaer, setFirmaer] = useState<VirksomhetSøkeresultat[]>([])
    const [søkLaster, setSøkLaster] = useState(false);
    const [søkestreng, setSøkestreng] = useState("")
    const faktiskSøkestreng = useDebounce(søkestreng, 500)

    useEffect(() => {
        if (faktiskSøkestreng.length >= 3) {
            setSøkLaster(true);
            fetch(`${virksomhetAutocompletePath}?q=${faktiskSøkestreng}`)
                .then(res => res.json())
                .then((data: VirksomhetSøkeresultat[]) => setFirmaer(data))
                .then(() => setSøkLaster(false));

            loggSøkPåVirksomhet(faktiskSøkestreng.includes("*")
                ? "med *"
                : "vanlig"
            )
        }
    }, [faktiskSøkestreng])

    return (
        <div style={style} className={className}>
            <Search
                placeholder="Søk etter virksomhet"
                ref={searchRef}
                label="Søk etter virksomhet"
                variant="simple"
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
                {
                    søkLaster && <Popover.Content>
                        <Lastespinner />
                    </Popover.Content>
                }
                {!!firmaer.length && <Popover.Content>
                    {firmaer.map(firma => (
                        <EksternLenke
                            key={firma.orgnr}
                            style={{ display: "block" }}
                            href={`/virksomhet/${firma.orgnr}`}
                            target={`/virksomhet/${firma.orgnr}`}
                            onClick={() => {
                                setSøkestreng("")
                                setFirmaer([])
                            }}
                        >
                            {`${firma.navn} (${firma.orgnr})`}
                        </EksternLenke>
                    ))}
                </Popover.Content>}
                {(firmaer.length === 0 && !søkLaster) && <Popover.Content>
                    Ingen resultater.
                </Popover.Content>}
            </Popover>
        </div>
    );
}

const Lastespinner = styled(Loader)`
    display: block;
    margin-left: auto;
    margin-right: auto;
`;