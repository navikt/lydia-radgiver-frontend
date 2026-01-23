import { Button } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsUpDownIcon,
} from "@navikt/aksel-icons";

import styles from "./minesaker.module.scss";
interface SorteringsknapperProps {
    onSortChange: (
        sortBy: "date" | "alphabetical",
        isAscending: boolean,
    ) => void;
}

export const Sorteringsknapper = ({ onSortChange }: SorteringsknapperProps) => {
    const [sortType, setSortType] = useState<"date" | "alphabetical">("date");
    const [isAscending, setIsAscending] = useState(false);

    useEffect(() => {
        onSortChange("date", false);
    }, []);

    const handleSortToggle = (newSortType: "date" | "alphabetical") => {
        if (sortType === newSortType) {
            setIsAscending(!isAscending);
        } else {
            setSortType(newSortType);
            setIsAscending(false);
        }
        onSortChange(
            newSortType,
            newSortType === sortType ? !isAscending : false,
        );
    };

    return (
        <div className={styles.buttonContainer}>
            <Button
                size="medium"
                variant="tertiary"
                iconPosition="right"
                icon={
                    <RenderIcon
                        erSortertPåType={"alphabetical" === sortType}
                        isAscending={isAscending}
                    />
                }
                onClick={() => handleSortToggle("alphabetical")}
                aria-label="Sorter etter alfabetisk rekkefølge"
            >
                Alfabetisk rekkefølge
            </Button>
            <Button
                size="medium"
                variant="tertiary"
                iconPosition="right"
                icon={
                    <RenderIcon
                        erSortertPåType={"date" === sortType}
                        isAscending={isAscending}
                    />
                }
                onClick={() => handleSortToggle("date")}
                aria-label="Sorter etter sist endret"
            >
                Sist endret
            </Button>
        </div>
    );
};

const RenderIcon = ({
    erSortertPåType,
    isAscending,
}: {
    erSortertPåType: boolean;
    isAscending: boolean;
}) => {
    if (!erSortertPåType) {
        return <ArrowsUpDownIcon aria-hidden />;
    } else if (isAscending) {
        return <ArrowUpIcon aria-label="Sortert stigende" />;
    } else {
        return <ArrowDownIcon aria-label="Sortert synkende" />;
    }
};
