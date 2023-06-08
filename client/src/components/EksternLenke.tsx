import {Link, LinkProps} from "@navikt/ds-react";
import {ExternalLinkIcon} from "@navikt/aksel-icons";

export const EksternLenke = ({children, target, ...rest}: LinkProps) =>
    <Link
        target={target ?? "_blank"}
        {...rest}>
        <span>
            {children}
            <ExternalLinkIcon style={{paddingLeft: "0.3rem", paddingTop: "0.3rem"}} title="(åpner i en ny fane)"/>
        </span>
    </Link>
