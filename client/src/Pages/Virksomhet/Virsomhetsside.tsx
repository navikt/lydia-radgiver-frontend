import {useParams} from "react-router-dom";
import {VirksomhetHeader} from "./VirksomhetHeader";
import {useHentVirksomhetsinformasjon} from "../../api/lydia-api";

const Virksomhetsside = ({className}: { className?: string }) => {
    const params = useParams();
    const orgnummer = params.orgnummer
    const {
        data: virksomhetsinformasjon,
        loading: lasterVirksomhet
    } = useHentVirksomhetsinformasjon(orgnummer);
    if (lasterVirksomhet)
        return <div>Laster...</div>
    return (
        <div className={className}>
            {virksomhetsinformasjon ?
                (<VirksomhetHeader virksomhet={virksomhetsinformasjon}/>) :
                <p>Kunne ikke laste ned informasjon om virksomhet</p>
            }
        </div>
    );
};


export default Virksomhetsside;
