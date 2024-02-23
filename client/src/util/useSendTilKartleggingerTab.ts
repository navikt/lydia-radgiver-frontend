import { useSearchParams } from "react-router-dom";

export const useSendTilKartleggingerTab = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const erPåKartleggingFane = searchParams.get("fane") === "kartlegging";
    const sendBrukerTilKartleggingerTab = () => {
        searchParams.set("fane", "kartlegging");
        setSearchParams(searchParams, { replace: true });
    };
    return { erPåKartleggingFane, sendBrukerTilKartleggingerTab };
};
