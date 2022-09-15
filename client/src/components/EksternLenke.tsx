import {Link, LinkProps} from "@navikt/ds-react";
import {ExternalLink} from "@navikt/ds-icons";

export const EksternLenke = ({children, target, ...rest}: LinkProps) =>
    <Link
        target={target ?? "_blank"}
        {...rest}>
        <span>
            {children}
            <ExternalLink style={{paddingLeft: "0.3rem", paddingTop: "0.3rem"}} title="(åpner i en ny fane)"/>
        </span>
    </Link>
