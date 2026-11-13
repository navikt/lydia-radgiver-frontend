import React from "react";
import {
    DatePicker,
    HGrid,
    Select,
    TextField,
    useDatepicker,
    VStack,
} from "@navikt/ds-react";
import {
    enhet,
    fristgrenser,
    SYKEFRAVÆRSMÅLTYPE_NAVN,
    SYKEFRAVÆRSMÅLTYPER,
    Sykefraværsmåltype,
    skjemaId,
    Sykefraværsmålutkast,
    Valideringsfeil,
} from "./målskjema";

export function SykefraværsmålFelter({
    utkast,
    oppdater,
    feil,
    idPrefiks,
    opptatte,
    kompakt = false,
    visType = true,
}: {
    utkast: Sykefraværsmålutkast;
    oppdater: (endring: Partial<Sykefraværsmålutkast>) => void;
    feil: Valideringsfeil;
    idPrefiks: string;
    opptatte: Sykefraværsmåltype[];
    kompakt?: boolean;
    visType?: boolean;
}) {
    const størrelse = kompakt ? "small" : "medium";
    const måleenhet = enhet(utkast.type);

    const [{ fra, til }] = React.useState(() => fristgrenser());
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: utkast.frist,
        fromDate: fra,
        toDate: til,
        onDateChange: (dato) => oppdater({ frist: dato }),
    });

    const verdifelter = (
        <>
            <TextField
                id={skjemaId(idPrefiks, "nåværende")}
                label={`Nåværende (${måleenhet})`}
                size={størrelse}
                inputMode="decimal"
                autoComplete="off"
                value={utkast.nåværende}
                onChange={(e) => oppdater({ nåværende: e.target.value })}
                error={feil.nåværende}
            />
            <TextField
                id={skjemaId(idPrefiks, "mål")}
                label={`Mål (${måleenhet})`}
                size={størrelse}
                inputMode="decimal"
                autoComplete="off"
                value={utkast.mål}
                onChange={(e) => oppdater({ mål: e.target.value })}
                error={feil.mål}
            />
        </>
    );

    const datofelt = (
        <DatePicker {...datepickerProps} dropdownCaption>
            <DatePicker.Input
                {...inputProps}
                id={skjemaId(idPrefiks, "frist")}
                label="Når skal målet nås?"
                size={størrelse}
                error={feil.frist}
            />
        </DatePicker>
    );

    return (
        <VStack gap={kompakt ? "space-12" : "space-16"}>
            {visType && (
                <Select
                    id={skjemaId(idPrefiks, "type")}
                    label="Type sykefravær"
                    size={størrelse}
                    value={utkast.type}
                    onChange={(e) =>
                        oppdater({
                            type: e.target.value as Sykefraværsmåltype | "",
                        })
                    }
                    error={feil.type}
                >
                    <option value="">Velg type sykefravær</option>
                    {SYKEFRAVÆRSMÅLTYPER.map((type) => {
                        const brukt =
                            opptatte.includes(type) && type !== utkast.type;
                        return (
                            <option key={type} value={type} disabled={brukt}>
                                {SYKEFRAVÆRSMÅLTYPE_NAVN[type]}
                                {brukt ? " (allerede lagt til)" : ""}
                            </option>
                        );
                    })}
                </Select>
            )}
            {kompakt ? (
                <>
                    <HGrid columns={2} gap="space-12">
                        {verdifelter}
                    </HGrid>
                    {datofelt}
                </>
            ) : (
                <HGrid columns={{ xs: 1, md: 3 }} gap="space-16" align="start">
                    {verdifelter}
                    {datofelt}
                </HGrid>
            )}
        </VStack>
    );
}
