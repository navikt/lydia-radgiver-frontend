import {useParams} from "react-router-dom";
import {VirksomhetHeader} from "./VirksomhetHeader";
import {virksomhetMock} from "../Prioritering/mocks/virksomhetMock";

const Virksomhetsside = ({className} : {className? : string}) => {
    const params = useParams();
    const orgnummer = params.orgnummer

    return (
        <div className={className}>
           <VirksomhetHeader virksomhet={virksomhetMock}/>
            <p>Viser foreløpig bare mock data, men skal vise data for virksomhet med orgnummer {orgnummer}</p>
        </div>
    );
};


export default Virksomhetsside;
