import { useSearchParams } from "react-router-dom";

export const useSendTilBehovsvurderingFane = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const erPåBehovsvurderingFane =
        searchParams.get("fane") === "behovsvurdering";
    const sendBrukerTilBehovsvurderingFane = () => {
        searchParams.set("fane", "behovsvurdering");
        setSearchParams(searchParams, { replace: true });
    };
    return { erPåBehovsvurderingFane, sendBrukerTilBehovsvurderingFane };
};
