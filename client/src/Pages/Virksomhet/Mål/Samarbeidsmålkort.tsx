import {
    BodyLong,
    Button,
    HStack,
    InlineMessage,
    Textarea,
} from "@navikt/ds-react";
import { PersonopplysningssjekkResultat } from "../../../api/lydia-api/personopplysningssjekk";
import {
    lagreLikevelId,
    MAKS_ANTALL_TEGN_I_MÅL,
    redigerKnappId,
    Sjekk,
} from "./målskjema";
import { Målkortknapper, Målkortramme } from "./Målkort";
import {
    Personopplysningsadvarsel,
    Sjekkfeil,
} from "./Personopplysningsadvarsel";
import styles from "./mål.module.scss";

export function Samarbeidsmålkort({
    feltId,
    mål,
    flagget,
    funn,
    onRediger,
    onSlett,
    redigering,
}: {
    feltId: string;
    mål: string;
    flagget: boolean;
    funn?: PersonopplysningssjekkResultat;
    onRediger: () => void;
    onSlett: () => void;
    redigering?: {
        tekst: string;
        feil?: string;
        sjekk?: Sjekk;
        onEndre: (tekst: string) => void;
        onLagre: () => void;
        onLagreLikevel: () => void;
        onAvbryt: () => void;
    };
}) {
    const tekstId = `${feltId}-tekst`;
    if (redigering) {
        const { sjekk } = redigering;
        const sjekker = sjekk?.status === "sjekker";
        return (
            <Målkortramme>
                <Textarea
                    id={feltId}
                    label="Endre mål"
                    description="Husk ingen personopplysninger."
                    maxLength={MAKS_ANTALL_TEGN_I_MÅL}
                    value={redigering.tekst}
                    error={redigering.feil}
                    readOnly={sjekker}
                    onChange={(e) => redigering.onEndre(e.target.value)}
                />
                {sjekk?.status === "feilet" ? (
                    <Sjekkfeil />
                ) : sjekk?.status === "funn" ? (
                    <Personopplysningsadvarsel resultat={sjekk.resultat} />
                ) : (
                    flagget &&
                    redigering.tekst === mål && (
                        <Personopplysningsadvarsel resultat={funn} />
                    )
                )}
                <HStack gap="space-8" wrap>
                    {sjekk?.status !== "funn" && (
                        <Button
                            type="button"
                            size="small"
                            loading={sjekker}
                            onClick={redigering.onLagre}
                        >
                            Lagre
                        </Button>
                    )}
                    {(sjekk?.status === "funn" ||
                        sjekk?.status === "feilet") && (
                        <Button
                            id={lagreLikevelId(feltId)}
                            type="button"
                            variant={
                                sjekk.status === "funn"
                                    ? "primary"
                                    : "secondary"
                            }
                            size="small"
                            onClick={redigering.onLagreLikevel}
                        >
                            Lagre likevel
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        disabled={sjekker}
                        onClick={redigering.onAvbryt}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </Målkortramme>
        );
    }
    return (
        <Målkortramme>
            <BodyLong id={tekstId} className={styles.samarbeidsmaal}>
                {mål}
            </BodyLong>
            <Målkortknapper
                redigerId={redigerKnappId(feltId)}
                beskrevetAv={tekstId}
                onRediger={onRediger}
                onSlett={onSlett}
                varsel={
                    flagget && (
                        <InlineMessage status="warning" size="small">
                            Teksten kan inneholde personopplysninger
                        </InlineMessage>
                    )
                }
            />
        </Målkortramme>
    );
}
