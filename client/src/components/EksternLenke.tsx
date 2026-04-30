import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link, LinkProps } from "@navikt/ds-react";

export const EksternLenke = ({ children, target, ...rest }: LinkProps) => (
    <Link target={target ?? "_blank"} {...rest}>
        <span>{children}</span>
        <ExternalLinkIcon fontSize="0.9em" title="(åpner i en ny fane)" />
    </Link>
);
