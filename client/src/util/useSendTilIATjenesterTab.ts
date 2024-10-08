import { useSearchParams } from "react-router-dom";

export const useSendTilIATjenesterTab = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const erPåIaTjenesterFane = searchParams.get("fane") === "ia-tjenester";
    const sendBrukerTilIATjenesterTab = () => {
        searchParams.set("fane", "ia-tjenester");
        setSearchParams(searchParams, { replace: true });
    };
    return { erPåIaTjenesterFane, sendBrukerTilIATjenesterTab };
};
