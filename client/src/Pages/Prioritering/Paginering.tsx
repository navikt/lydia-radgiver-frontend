import React from "react";
import styled from "styled-components";
import cl from "clsx";
import { ChevronLeftIcon as Back, ChevronRightIcon as Next } from "@navikt/aksel-icons";
import { BodyShort, Pagination } from "@navikt/ds-react";
import { ANTALL_RESULTATER_PER_SIDE } from "./Prioriteringsside";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

interface Props {
    side: number;
    endreSide: (side: number) => void;
    antallTreffPåSide: number;
}

export const Paginering = ({ side, antallTreffPåSide, endreSide }: Props) => (
    <Nav>
        <Pagination.Item
            className={cl("navds-pagination__prev-next", "navds-pagination--prev-next--with-text", {
                "navds-pagination--invisible": side === 1
            })}
            disabled={side <= 1}
            onClick={() => endreSide?.(side - 1)}
            page={side - 1}
            size="small"
            icon={
                <Back
                    className="navds-pagination__prev-next-icon"
                    aria-hidden={true}
                />
            }
        >
            <BodyShort
                size="small"
                className="navds-pagination__prev-text"
            >
                Forrige
            </BodyShort>
        </Pagination.Item>
        <BodyShort>{side}</BodyShort>
        <Pagination.Item
            className={cl("navds-pagination__prev-next", "navds-pagination--prev-next--with-text", {
                "navds-pagination--invisible": antallTreffPåSide !== ANTALL_RESULTATER_PER_SIDE,
            })}
            disabled={antallTreffPåSide !== ANTALL_RESULTATER_PER_SIDE}
            onClick={() => endreSide?.(side + 1)}
            page={side + 1}
            size="small"
            icon={
                <Next
                    className="navds-pagination__prev-next-icon"
                    aria-hidden={true}
                />
            }
            iconPosition="right"
        >
            <BodyShort
                size="small"
                className="navds-pagination__next-text"
            >
                Neste
            </BodyShort>
        </Pagination.Item>
    </Nav>
)
