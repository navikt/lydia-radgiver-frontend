import {Link, Popover, Search} from "@navikt/ds-react";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {VirksomhetSøkeresultat} from "../../domenetyper";
import {useDebounce} from "../../util/useDebounce";
import {virksomhetAutocompletePath} from "../../api/lydia-api";

interface Props {
    darkmode?: boolean,
    style?: CSSProperties
}

export const Søkefelt = ({ darkmode, style }: Props) => {
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


    return <div data-theme={`${darkmode ? 'dark' : 'light'}`} style={style}>
        <Search
            placeholder="Søk etter virksomhet"
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
            {!!firmaer.length && <Popover.Content style={{color: `${darkmode ? 'black' : 'white'}`}}>
                {firmaer.map(firma => (
                    <Link style={{display: "block"}}
                          key={firma.orgnr}
                          href={`virksomhet/${firma.orgnr}`}>
                        {firma.navn}
                    </Link>
                ))}
            </Popover.Content>}
        </Popover>
    </div>;
}

