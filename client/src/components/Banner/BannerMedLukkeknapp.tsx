import { useState } from "react";
import { AlertProps } from "@navikt/ds-react";
import { Banner } from "./Banner";

export const BannerMedLukkeknapp = ({ children, ...props }: AlertProps) => {
    const [visBanner, setVisBanner] = useState(true);

    return (
        visBanner && (
            <Banner {...props} closeButton onClose={() => setVisBanner(false)}>
                {children}
            </Banner>
        )
    );
};
