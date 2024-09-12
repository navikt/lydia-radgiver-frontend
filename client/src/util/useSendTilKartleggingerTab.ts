import { useSearchParams } from "react-router-dom";

export const useSendTilKartleggingerTab = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const erPåKartleggingFane = searchParams.get("fane") === "behovsvurdering";
    const sendBrukerTilKartleggingerTab = () => {
        searchParams.set("fane", "behovsvurdering");
        setSearchParams(searchParams, { replace: true });
    };
    return { erPåKartleggingFane, sendBrukerTilKartleggingerTab };
};
