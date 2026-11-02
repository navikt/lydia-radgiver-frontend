import { useHentSalesforceAktiviteter } from "../../../api/lydia-api/nyFlyt";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

type SalesforceAktiviteterProps = {
    iaSak: IASak;
    samarbeid: IaSakProsess;
};

export default function SalesforceAktiviteter({
    iaSak,
    samarbeid,
}: SalesforceAktiviteterProps) {
    const { data: salesforceAktiviteter } = useHentSalesforceAktiviteter(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
    );
    return <pre>{JSON.stringify(salesforceAktiviteter)}</pre>;
}
