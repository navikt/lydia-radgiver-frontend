import {
    Fylke,
    FylkeMedKommuner,
    Kommune,
} from "../domenetyper/fylkeOgKommune";

export const finnFylkerForKommuner = (
    kommuner: Kommune[],
    fylkerMedKommuner: FylkeMedKommuner[],
): Fylke[] => {
    const kommunenummerViVilFinneFylkeTil = kommuner.map(
        (kommune) => kommune.nummer,
    );

    return fylkerMedKommuner
        .filter((fylke) =>
            fylke.kommuner
                .map((kommune) => kommune.nummer)
                .some((kommunenummer) =>
                    kommunenummerViVilFinneFylkeTil.includes(kommunenummer),
                ),
        )
        .map((fylkeMedKommunerSomMatcher) => fylkeMedKommunerSomMatcher.fylke);
};
