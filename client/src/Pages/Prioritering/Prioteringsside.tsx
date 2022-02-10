import Filtervisning from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import {useFilterverdier} from "../../api/lydia-api";

const Prioriteringsside = () => {
    const { filterverdier, loading, error } = useFilterverdier();
    if (loading) {
        return <div>Loading</div>
    }
    if (error) {
        return <p>Error</p>
    }

    return <>
        {filterverdier && <Filtervisning {...filterverdier} />}
        <PrioriteringsTabell/>
    </>
}




export default Prioriteringsside;
