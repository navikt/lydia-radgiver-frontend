import { Tabs } from "@navikt/ds-react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

const SAMARBEIDSFANER = ["plan", "kartlegging", "ia-tjenester"];
function erSamarbeidsfane(fane: string) {
    return SAMARBEIDSFANER.includes(fane);
}

const StyledTabList = styled(Tabs.List)`
    justify-content: flex-end;
`;

export default function Navigasjonsknapper() {
    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "statistikk";
    const bruktFane = erSamarbeidsfane(fane) ? "samarbeid" : fane;

    const oppdaterTabISearchParam = (tab: string) => {
        if (tab === "samarbeid") {
            if (!erSamarbeidsfane(bruktFane)) {
                searchParams.set("fane", "kartlegging");
                setSearchParams(searchParams, { replace: true });
            }
        } else {
            searchParams.set("fane", tab);
            setSearchParams(searchParams, { replace: true });
        }
    };

    return (
        <Tabs
            value={bruktFane}
            onChange={oppdaterTabISearchParam}
            defaultValue="statistikk"
        >
            <StyledTabList>
                <Tabs.Tab value="statistikk" label="Statistikk" />
                <Tabs.Tab value="historikk" label="Historikk" />
            </StyledTabList>
        </Tabs>
    );
}
