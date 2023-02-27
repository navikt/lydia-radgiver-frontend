import { ReactNode, useState } from "react";
import styled from "styled-components";
import { AlertProps, Button } from "@navikt/ds-react";
import { Banner } from "./Banner";
import { NavFarger } from "../../styling/farger";

export const StyledBanner = styled(Banner)`
  position: relative; // For å halde lukk-knappen (position: absolute) inne i banneret
  padding-right: 5rem; // Hindrar overlapp mellom lukk-knapp og tekst
`;

const Lukkeknapp = styled(Button).attrs({ size: "small", variant: "secondary" })`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  background: ${NavFarger.white}; // "secondary"-knapp frå DS har per 2023-02-27 ingen bakgrunn. Dette gjer at vi får for låg kontrast på "Error"-alert.
`;

interface Props extends AlertProps {
    children: ReactNode;
}

export const BannerMedLukkeknapp = ({ children, ...props }: Props) => {
    const [visBanner, setVisBanner] = useState(true);

    if (!visBanner) return null;

    const lukkMeg = () => {
        setVisBanner(false)
    }

    return (
        <StyledBanner {...props}>
            {children}
            <Lukkeknapp onClick={lukkMeg} size="small" variant="secondary">Lukk</Lukkeknapp>
        </StyledBanner>
    )
}
