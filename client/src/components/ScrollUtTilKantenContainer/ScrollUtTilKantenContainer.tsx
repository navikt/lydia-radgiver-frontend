import styles from "./scrollUtTilKantenContainer.module.scss";

/*
 * "Scroll innhald heilt ut til kanten av forelderen-boks"
 *
 * Laga etter mønster frå Josh W Comeau
 */

/**
 * Komponent som let deg scrolle innhald horisontalt på eit breiare område enn forelderen sin margin/padding eigentleg tillet.
 *
 * Input:
 *    - offsetLeft, offsetRight – (rem) Avstanden på høgre og venstre side som du vil bruke til å vise scrollbart innhald.
 *        Du finn desse ved å måle avstanden frå innhaldet og ut til breidda av forelderen i ein nettlesar.
 *    - paddingY – ekstra-padding som skal leggjast til over og under komponenten, til dømes for å vise skuggar.
 *
 * Komponenten er tenkt til å liggje rundt eitt (1) anna element om gongen.
 *
 * */

export function ScrollUtTilKantenContainer({
    $offsetLeft,
    $offsetRight,
    style = {},
    className = "",
    ...remainingProps
}: OffsetProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...remainingProps}
            style={
                {
                    "--scroll-ut-til-kanten-offset-left": `${$offsetLeft}rem`,
                    "--scroll-ut-til-kanten-offset-right": `${$offsetRight}rem`,
                    ...style,
                } as React.CSSProperties
            }
            className={`${styles.scrollUtTilKantenContainer} ${className}`}
        />
    );
}

interface OffsetProps {
    /** Kor mykje padding det er til venstre for komponenten som du vil låne til å scrolle innhald på.
     *  Hardkoda verdi i rem. */
    $offsetLeft: number;
    /** Kor mykje padding det er til høgre for komponenten som du vil låne til å scrolle innhald på.
     *  Hardkoda verdi i rem. */
    $offsetRight: number;
}
