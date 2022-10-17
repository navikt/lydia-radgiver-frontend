import Item from "@navikt/ds-react/esm/pagination/PaginationItem";
import cl from "clsx";
import {Back, Next} from "@navikt/ds-icons";
import {BodyShort} from "@navikt/ds-react/src";
import {ANTALL_RESULTATER_PER_SIDE} from "./Prioriteringsside";
import {Detail} from "@navikt/ds-react";
import React from "react";

interface Props {
    side: number;
    endreSide: (side: number) => void;
    antallTreffPåSide: number;
}

export const Paginering = ({side, antallTreffPåSide, endreSide}: Props) => {
    return (<div style={{display: "flex", alignItems: "center", flexDirection: "row", gap: "10rem"}}>
        <Item
            className={cl("navds-pagination__prev-next", {
                "navds-pagination--invisible": side === 1,
                "navds-pagination--prev-next--with-text": true,
            })}
            disabled={side <= 1}
            onClick={() => endreSide?.(side - 1)}
            page={side - 1}
            size={"small"}
            icon={
                <Back
                    className="navds-pagination__prev-next-icon"
                    aria-hidden={true}
                />
            }
        >
            <BodyShort
                size={"small"}
                className="navds-pagination__prev-text"
            >
                Forrige
            </BodyShort>
        </Item>
        <BodyShort>{side}</BodyShort>
        <Item
            className={cl("navds-pagination__prev-next", {
                "navds-pagination--invisible": antallTreffPåSide !== ANTALL_RESULTATER_PER_SIDE,
                "navds-pagination--prev-next--with-text": true,
            })}
            disabled={antallTreffPåSide !== ANTALL_RESULTATER_PER_SIDE}
            onClick={() => endreSide?.(side + 1)}
            page={side + 1}
            size={"small"}
            icon={
                <Next
                    className="navds-pagination__prev-next-icon"
                    aria-hidden={true}
                />
            }
            iconPosition="right"
        >
            <BodyShort
                size={"small"}
                className="navds-pagination__next-text"
            >
                Neste
            </BodyShort>
        </Item>
        <Detail size={"small"}>
            Tallene viser offisiell sykefraværsstatistikk for andre kvartal 2022.
        </Detail>
    </div>)
}