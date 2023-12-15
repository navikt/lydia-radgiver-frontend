import { CSSProperties, useEffect, useRef, useState } from "react";
import { Popover, Search } from "@navikt/ds-react";
import { useDebounce } from "../../util/useDebounce";
import { virksomhetAutocompletePath } from "../../api/lydia-api";
import { VirksomhetSøkeresultat } from "../../domenetyper/domenetyper";
import { EksternLenke } from "../EksternLenke";
import { loggSøkPåVirksomhet } from "../../util/amplitude-klient";

interface Props {
    className?: string;
    style?: CSSProperties;
}

export const Søkefelt = ({ style, className }: Props) => {
    const searchRef = useRef<HTMLDivElement | null>(null)
    const [firmaer, setFirmaer] = useState<VirksomhetSøkeresultat[]>([])
    const [søkestreng, setSøkestreng] = useState("")
    const faktiskSøkestreng = useDebounce(søkestreng, 500)

    useEffect(() => {
        if (faktiskSøkestreng.length >= 3) {
            fetch(`${virksomhetAutocompletePath}?q=${faktiskSøkestreng}`)
                .then(res => res.json())
                .then((data: VirksomhetSøkeresultat[]) => setFirmaer(data))

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
            </Popover>
        </div>
    );
}
