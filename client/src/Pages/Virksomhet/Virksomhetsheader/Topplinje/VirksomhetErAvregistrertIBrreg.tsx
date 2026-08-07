import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { Salesforcelenke } from "..";

export default function VirksomhetErAvregistrertIBrreg({
    virksomhet,
}: {
    virksomhet: Virksomhet;
}) {
    return <Salesforcelenke orgnr={virksomhet.orgnr} />;
}
