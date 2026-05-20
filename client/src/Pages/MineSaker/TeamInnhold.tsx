import { IASak } from "../../domenetyper/domenetyper";
import { loggFølgeSak } from "../../util/analytics-klient";
import { BodyShort, Button, HStack } from "@navikt/ds-react";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import {
    HeartFillIcon,
    HeartIcon,
    PersonFillIcon,
    PersonIcon,
} from "@navikt/aksel-icons";
import { useHentBrukerinformasjon } from "../../api/lydia-api/bruker";
import {
    fjernBrukerFraTeam,
    leggBrukerTilTeam,
    useHentTeam,
} from "../../api/lydia-api/team";
import { useErPåAktivSak } from "../Virksomhet/VirksomhetContext";
import styles from "./minesaker.module.scss";
import {
    bliEierNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "../../api/lydia-api/nyFlyt";
import { useHentMineSaker } from "../../api/lydia-api/sak";
import { useOversiktMutate } from "../Virksomhet/Debugside/Oversikt";

function følgerSak(
    brukerIdent: string | undefined,
    følgere?: string[],
): boolean {
    return !!følgere?.some((følger) => følger === brukerIdent);
}

export default function TeamInnhold({
    iaSak,
    lukkEksternContainer = () => {},
    erPåMineSaker = false,
}: {
    iaSak: IASak;
    lukkEksternContainer?: () => void;
    erPåMineSaker?: boolean;
}) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();

    const { data: følgere = [], mutate: muterFølgere } = useHentTeam(
        iaSak.saksnummer,
    );

    const brukerIdent = brukerInformasjon?.ident;
    const erPåAktivSak = useErPåAktivSak();

    const kanTaEierskap = erPåAktivSak || erPåMineSaker;
    const brukerErEier = iaSak.eidAv === brukerIdent;
    const brukerErFølger = følgerSak(brukerIdent, følgere);
    const { mutate: muterIaSak } = useHentSpesifikkSakNyFlyt(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { mutate: muterMineSaker } = useHentMineSaker();
    const muterOversikt = useOversiktMutate(iaSak.orgnr);

    const gjørTaEierskap = async () => {
        await bliEierNyFlyt(iaSak.orgnr);
        muterIaSak();
        muterMineSaker();
        muterOversikt();
        lukkEksternContainer();
    };

    return (
        <>
            <div className={styles.eierboks}>
                <div>
                    <b>Eier:</b>{" "}
                    {iaSak.eidAv ? (
                        <NavIdentMedLenke navIdent={iaSak.eidAv} />
                    ) : (
                        "Ingen eier"
                    )}
                </div>

                <div className={styles.eierknappboks}>
                    {!brukerErEier && iaSak.eidAv && (
                        <span>
                            Ønsker du å ta eierskap til virksomheten? Nåværende
                            eier blir automatisk fjernet.
                        </span>
                    )}
                    {!brukerErEier && !iaSak.eidAv && (
                        <span>Ønsker du å ta eierskap til virksomheten?</span>
                    )}
                    <Button
                        size="small"
                        iconPosition="right"
                        variant="secondary"
                        disabled={!kanTaEierskap}
                        onClick={gjørTaEierskap}
                    >
                        <HStack gap={"space-8"} align={"center"}>
                            {!brukerErEier ? (
                                <PersonIcon aria-hidden />
                            ) : (
                                <PersonFillIcon aria-hidden />
                            )}
                            {!brukerErEier ? (
                                <BodyShort>Ta eierskap</BodyShort>
                            ) : (
                                <BodyShort>Du eier virksomheten</BodyShort>
                            )}
                        </HStack>
                    </Button>
                </div>
            </div>
            <div className={styles.følgereboks}>
                <div className={styles.følgereheader}>Følgere:</div>
                {!!følgere.length && (
                    <div className={styles.følgereliste}>
                        {følgere.map((følger) => (
                            <NavIdentMedLenke key={følger} navIdent={følger} />
                        ))}
                    </div>
                )}
                {!brukerErFølger && (
                    <span>
                        Følg virksomheten for å se den under &ldquo;Mine
                        virksomheter&rdquo;
                    </span>
                )}
                {brukerErFølger ? (
                    <Button
                        size="small"
                        icon={<HeartFillIcon />}
                        iconPosition="left"
                        variant="secondary"
                        onClick={async () => {
                            await fjernBrukerFraTeam(iaSak.saksnummer);
                            muterFølgere();
                            loggFølgeSak(false);
                            lukkEksternContainer();
                        }}
                        disabled={!(erPåAktivSak || erPåMineSaker)}
                    >
                        Slutt å følge virksomheten
                    </Button>
                ) : (
                    <Button
                        icon={<HeartIcon />}
                        size="small"
                        iconPosition="left"
                        onClick={async () => {
                            await leggBrukerTilTeam(iaSak.saksnummer);
                            muterFølgere();
                            loggFølgeSak(true);
                            lukkEksternContainer();
                        }}
                        disabled={!(erPåAktivSak || erPåMineSaker)}
                    >
                        Følg virksomheten
                    </Button>
                )}
            </div>
        </>
    );
}
