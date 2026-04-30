import { SetMinesakerFiltreType } from "../MineSakerside";
import { EierFølgerFilter } from "./EierFølgerFilter";
import styles from "./mineSakerFilter.module.scss";
import { MineSakerSøkefelt } from "./MineSakerSokeFelt";
import {
    StatusFilter,
    ArkivStatusFilter,
    useStatusFilter,
} from "./StatusFilter";

type Props = {
    setFiltre: SetMinesakerFiltreType;
};

const FiltreringMineSaker = ({
    setFiltre: { setStatusFilter, setSøkFilter, setEierFølgerFilter },
}: Props) => {
    const { handleStatusFilterEndring, aktiveStatusFiltre, arkivStatusFiltre } =
        useStatusFilter(setStatusFilter);

    return (
        <div className={styles.mineSakerFilterParentContainer}>
            <MineSakerSøkefelt setSøkFilter={setSøkFilter} />
            <div>
                <div className={styles.filterTittel}>Filter</div>
                <div className={styles.filterContainer}>
                    <StatusFilter
                        aktiveStatusFiltre={aktiveStatusFiltre}
                        arkivStatusFiltre={arkivStatusFiltre}
                        handleStatusFilterEndring={handleStatusFilterEndring}
                    />
                    <EierFølgerFilter
                        setEierFølgerFilter={setEierFølgerFilter}
                    />
                    <ArkivStatusFilter
                        arkivStatusFiltre={arkivStatusFiltre}
                        handleStatusFilterEndring={handleStatusFilterEndring}
                    />
                </div>
            </div>
        </div>
    );
};

export default FiltreringMineSaker;
