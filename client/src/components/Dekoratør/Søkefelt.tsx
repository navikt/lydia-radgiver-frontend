import { CSSProperties, useEffect, useRef, useState } from "react";
import { Popover, Search } from "@navikt/ds-react";
import { useDebounce } from "../../util/useDebounce";
import { virksomhetAutocompletePath } from "../../api/lydia-api";
import { VirksomhetSøkeresultat } from "../../domenetyper/domenetyper";
import { EksternLenke } from "../EksternLenke";

interface Props {
    style?: CSSProperties
}

export const Søkefelt = ({ style }: Props) => {
    const searchRef = useRef<HTMLDivElement | null>(null)
    const [firmaer, setFirmaer] = useState<VirksomhetSøkeresultat[]>([])
    const [søkestreng, setSøkestreng] = useState("")
    const faktiskSøkestreng = useDebounce(søkestreng, 300)

    useEffect(() => {
        if (faktiskSøkestreng.length >= 3) {
            fetch(`${virksomhetAutocompletePath}?q=${faktiskSøkestreng}`)
                .then(res => res.json())
                .then((data: VirksomhetSøkeresultat[]) => setFirmaer(data))
        }
    }, [faktiskSøkestreng])

    return (
        <div style={style}>
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
                            style={{display: "block"}}
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
