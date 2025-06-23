import { Button } from "@navikt/ds-react";
import React from "react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { NotePencilIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { useErPåAktivSak } from "../../VirksomhetContext";
import { InternLenke } from "../../../../components/InternLenke";

const SamarbeidsRadWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

interface SamarbeidsRadProps {
    orgnr: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
    setValgtSamarbeid: React.Dispatch<
        React.SetStateAction<IaSakProsess | null>
    >;
    kanEndreSamarbeid: boolean;
    setModalErÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SamarbeidsRad = ({
    orgnr,
    saksnummer,
    samarbeid,
    setÅpen,
    setValgtSamarbeid,
    kanEndreSamarbeid,
    setModalErÅpen,
}: SamarbeidsRadProps) => {
    const erPåAktivSak = useErPåAktivSak();

    return (
        <SamarbeidsRadWrapper>
            <InternLenke
                style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "inline-block",
                }}
                href={`/virksomhet/${orgnr}/sak/${saksnummer}/samarbeid/${samarbeid.id}`}
                title={`Gå til samarbeid '${samarbeid.navn}'`}
                onClick={() => {
                    setModalErÅpen(false);
                }}
            >
                {samarbeid.navn}
            </InternLenke>

            {kanEndreSamarbeid && erPåAktivSak && (
                <Button
                    icon={
                        <NotePencilIcon
                            focusable={"true"}
                            fontSize={"1.5rem"}
                        />
                    }
                    variant={"tertiary"}
                    size={"small"}
                    title={"Endre samarbeid"}
                    onClick={() => {
                        setÅpen(true);
                        setValgtSamarbeid(samarbeid);
                    }}
                />
            )}
        </SamarbeidsRadWrapper>
    );
};
