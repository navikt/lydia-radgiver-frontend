import { Link, LinkProps } from "@navikt/ds-react";
import { Link as RouterLink } from "react-router-dom";

interface InternLenkeProps extends Omit<LinkProps, "href" | "to"> {
    href: string;
}

export const InternLenke = ({ href, ...rest }: InternLenkeProps) => (
    <Link {...rest} as={RouterLink} to={href} />
);
