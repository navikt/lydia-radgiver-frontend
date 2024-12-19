import { Virksomhet } from "../../../domenetyper/virksomhet";
import { IASak } from "../../../domenetyper/domenetyper";
import { BodyShort, Button, Dropdown, Heading, Link } from "@navikt/ds-react";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import React, { useState } from "react";
import { SamarbeidsRad } from "./SamarbeidsRad";
import { SamarbeidsDropdownFooter } from "./SamarbeidsDropdownFooter";
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";
import { EndreSamarbeidModal } from "./EndreSamarbeidModal";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import styled from "styled-components";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";

const DropdownMenuInnholdStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    margin-top: 0 !important;
    margin-right: 1.5rem !important;
    margin-bottom: 1.5rem !important;
    margin-left: 1.5rem !important;
`;

const DropdownMenuListStyled = styled(Dropdown.Menu.List)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const DropdownMenuListItemStyled = styled(Dropdown.Menu.List.Item)``;

interface SamarbeidsDropdown2Props {
    iaSak: IASak | undefined;
    virksomhet: Virksomhet;
    setNyttSamarbeidModalÅpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SamarbeidsDropdown = ({
    iaSak,
    virksomhet,
    setNyttSamarbeidModalÅpen,
}: SamarbeidsDropdown2Props) => {
    const { data: alleSamarbeid, mutate: hentSamarbeidPåNytt } =
        useHentSamarbeid(iaSak?.orgnr, iaSak?.saksnummer);

    const harIngenAktiveSamarbeid =
        alleSamarbeid === undefined || alleSamarbeid?.length === 0;

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const [endreSamarbeidModalÅpen, setEndreSamarbeidModalÅpen] =
        useState(false);
    const [valgtSamarbeid, setValgtSamarbeid] = useState<IaSakProsess | null>(
        null,
    );
    return (
        <>
            <Dropdown>
                <Button
                    as={Dropdown.Toggle}
                    icon={<ChevronDownIcon aria-hidden />}
                    iconPosition="right"
                    variant="primary-neutral"
                    size="small"
                    onClick={() => hentSamarbeidPåNytt()}
                >
                    Samarbeid
                    {harIngenAktiveSamarbeid
                        ? ""
                        : ` (${alleSamarbeid?.length})`}
                </Button>

                <Dropdown.Menu
                    style={{
                        width: "22rem",
                        marginTop: "0.3rem",
                        padding: 0,
                    }}
                    placement={"bottom-start"}
                >
                    <DropdownMenuInnholdStyled>
                        <Heading
                            as={Link}
                            href={`/virksomhet/${virksomhet.orgnr}`}
                            title="Gå til virksomhet"
                            size={"medium"}
                            variant={"neutral"}
                            style={{
                                marginTop: "1rem",
                                textDecoration: "none",
                            }}
                        >
                            {virksomhet.navn}
                        </Heading>

                        {harIngenAktiveSamarbeid ? (
                            <BodyShort style={{ paddingLeft: "1rem" }}>
                                <b>Ingen aktive samarbeid </b>
                            </BodyShort>
                        ) : (
                            iaSak &&
                            alleSamarbeid && (
                                <DropdownMenuListStyled>
                                    {alleSamarbeid.map((samarbeid) => (
                                        <DropdownMenuListItemStyled
                                            as={"div"}
                                            key={samarbeid.id}
                                        >
                                            <SamarbeidsRad
                                                orgnr={iaSak.orgnr}
                                                saksnummer={iaSak.saksnummer}
                                                samarbeid={samarbeid}
                                                brukerErEierAvSak={
                                                    brukerErEierAvSak
                                                }
                                                setÅpen={
                                                    setEndreSamarbeidModalÅpen
                                                }
                                                setValgtSamarbeid={
                                                    setValgtSamarbeid
                                                }
                                            />
                                        </DropdownMenuListItemStyled>
                                    ))}
                                </DropdownMenuListStyled>
                            )
                        )}

                        <SamarbeidsDropdownFooter
                            setÅpen={setNyttSamarbeidModalÅpen}
                            brukerErEierAvSak={brukerErEierAvSak}
                            iaSakStatus={iaSak?.status}
                        />
                    </DropdownMenuInnholdStyled>
                </Dropdown.Menu>
            </Dropdown>

            {valgtSamarbeid && iaSak && (
                <EndreSamarbeidModal
                    samarbeid={valgtSamarbeid}
                    iaSak={iaSak}
                    open={endreSamarbeidModalÅpen}
                    setOpen={setEndreSamarbeidModalÅpen}
                />
            )}
        </>
    );
};
