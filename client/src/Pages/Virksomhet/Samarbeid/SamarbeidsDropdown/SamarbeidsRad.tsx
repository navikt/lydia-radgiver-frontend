import { Button } from "@navikt/ds-react";
import React from "react";
import {
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../../../domenetyper/iaSakProsess";
import { NotePencilIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
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
    brukerErEierAvSak: boolean;
    setModalErÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SamarbeidsRad = ({
    orgnr,
    saksnummer,
    samarbeid,
    setÅpen,
    setValgtSamarbeid,
    brukerErEierAvSak,
    setModalErÅpen,
}: SamarbeidsRadProps) => {
    return (
        <SamarbeidsRadWrapper>
            <InternLenke
                style={{ width: "100%" }}
                href={`/virksomhet/${orgnr}/sak/${saksnummer}/samarbeid/${samarbeid.id}`}
                title={`Gå til samarbeid '${defaultNavnHvisTomt(samarbeid.navn)}'`}
                onClick={() => {
                    setModalErÅpen(false);
                }}
            >
                {defaultNavnHvisTomt(samarbeid.navn)}
            </InternLenke>

            {brukerErEierAvSak && (
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
