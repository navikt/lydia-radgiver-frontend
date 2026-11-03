import React from "react";
import { ErrorSummary } from "@navikt/ds-react";
import { Feillenke } from "./målskjema";

export function Feiloppsummering({
    feil,
    fokusteller,
    headingTag = "h2",
}: {
    feil: Feillenke[];
    fokusteller: number;
    headingTag?: "h2" | "h3";
}) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (fokusteller > 0) ref.current?.focus();
    }, [fokusteller]);

    if (feil.length === 0) return null;

    return (
        <ErrorSummary
            ref={ref}
            heading="Rett opp dette før du går videre"
            headingTag={headingTag}
        >
            {feil.map(({ href, melding }) => (
                <ErrorSummary.Item key={href} href={href}>
                    {melding}
                </ErrorSummary.Item>
            ))}
        </ErrorSummary>
    );
}
