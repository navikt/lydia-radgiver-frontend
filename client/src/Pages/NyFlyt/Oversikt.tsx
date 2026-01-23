import { useHentSakNyFlyt } from "../../api/lydia-api/nyFlyt";

interface OversiktProps {
    orgnummer: string;
    mutate?: () => void;
}

export default function Oversikt({ orgnummer }: OversiktProps) {
    const sak = useHentSakNyFlyt(orgnummer);

    return (
        <div style={{ backgroundColor: "#fff" }}>
            <h1>Ny flyt - Oversikt for virksomhet {orgnummer}</h1>
            {sak.error && (
                <div>Feil ved henting av sak: {sak.error.message}</div>
            )}
            {!sak.data && !sak.error && <div>Laster sak...</div>}
            {sak.data && (
                <div>
                    <h2>Sakdetaljer</h2>
                    <pre
                        style={{
                            fontFamily: "monospace",
                            fontSize: "14px",
                            maxHeight: "250px",
                            overflowY: "auto",
                        }}
                    >
                        {JSON.stringify(sak.data, null, 2)}
                    </pre>
                </div>
            )}
            <hr />
        </div>
    );
}

export function useOversiktMutate(orgnummer: string) {
    const { mutate } = useHentSakNyFlyt(orgnummer);
    return mutate;
}
