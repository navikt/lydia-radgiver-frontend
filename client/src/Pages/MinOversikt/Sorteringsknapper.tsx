import { Button } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsUpDownIcon,
} from "@navikt/aksel-icons";

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

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

    const renderIcon = (type: "date" | "alphabetical") => {
        if (sortType !== type) {
            return <ArrowsUpDownIcon />;
        } else if (isAscending) {
            return <ArrowUpIcon />;
        } else {
            return <ArrowDownIcon />;
        }
    };

    return (
        <ButtonContainer>
            <Button
                size="medium"
                variant="tertiary"
                iconPosition="right"
                icon={renderIcon("alphabetical")}
                onClick={() => handleSortToggle("alphabetical")}
            >
                Alfabetisk rekkefølge
            </Button>
            <Button
                size="medium"
                variant="tertiary"
                iconPosition="right"
                icon={renderIcon("date")}
                onClick={() => handleSortToggle("date")}
            >
                Sist endret
            </Button>
        </ButtonContainer>
    );
};
