import { Checkbox, CheckboxGroup, HStack, MonthPicker } from "@navikt/ds-react";
import styled from "styled-components";
import { PlanTema, PlanUndertema } from "../../../domenetyper/plan";

const UndertemaRad = styled(HStack)`
    margin-bottom: 0.5rem;
`;

function StartOgSluttVelger({
    undertema,
    setNyStartDato,
    setNySluttDato,
}: {
    undertema: PlanUndertema;
    setNyStartDato: (val: Date | undefined) => void;
    setNySluttDato: (val: Date | undefined) => void;
}) {
    const lagreStartDato = () => {
        console.log("Endret plan");
    };
    const lagreSluttDato = () => {
        console.log("Endret plan");
    };

    return (
        undertema.startDato &&
        undertema.sluttDato && (
            <HStack align="center" gap="3">
                <MonthPicker
                    selected={undertema.startDato}
                    defaultSelected={undertema.startDato}
                    onMonthSelect={setNyStartDato}
                >
                    <MonthPicker.Input
                        hideLabel
                        size="small"
                        label={`Startdato for ${undertema.navn}`}
                        value={`${undertema?.startDato?.toLocaleString("default", { month: "short" })} ${undertema?.startDato?.getFullYear()}`}
                        onChange={lagreStartDato}
                    />
                </MonthPicker>
                {" - "}
                <MonthPicker
                    selected={undertema.sluttDato}
                    defaultSelected={undertema.sluttDato}
                    onMonthSelect={setNySluttDato}
                >
                    <MonthPicker.Input
                        hideLabel
                        size="small"
                        label={`Sluttdato for ${undertema.navn}`}
                        value={`${undertema?.sluttDato?.toLocaleString("default", { month: "short" })} ${undertema?.sluttDato?.getFullYear()}`}
                        onChange={lagreSluttDato}
                    />
                </MonthPicker>
            </HStack>
        )
    );
}

export default function UndertemaSetup({ tema }: { tema: PlanTema }) {
    const handleChange = (val: string[]) => console.log(val);
    const setNyStartDato = (val: Date | undefined) => console.log(val);
    const setNySluttDato = (val: Date | undefined) => console.log(val);
    return (
        <CheckboxGroup
            legend={"Undertemaer"}
            description="Velg hvilke undertemaer dere skal jobbe med og når"
            value={tema.undertemaer
                .filter(({ planlagt }) => planlagt)
                .map(({ navn }) => navn)}
            onChange={handleChange}
        >
            {tema.undertemaer.map((undertema) => {
                return (
                    <UndertemaRad
                        key={undertema.id}
                        justify="space-between"
                        gap="4"
                        align="center"
                    >
                        <Checkbox value={undertema.navn}>
                            {undertema.navn}
                        </Checkbox>
                        {undertema.planlagt ? (
                            <StartOgSluttVelger
                                undertema={undertema}
                                setNyStartDato={setNyStartDato}
                                setNySluttDato={setNySluttDato}
                            />
                        ) : undefined}
                    </UndertemaRad>
                );
            })}
        </CheckboxGroup>
    );
}
