import styled from "styled-components";
import { contentSpacing } from "../../styling/contentSpacing";

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
export const ScrollUtTilKantenContainer = styled.div<OffsetProps>`
    overflow-x: auto;

    /* Vi strekk komponenten heilt ut til venstre kant med margin, 
   * og dyttar innhaldet tilbake til startpunktet med padding */
    margin-left: calc(
        -${contentSpacing.mobileX} + ${(props) => props.$offsetLeft * -1}rem
    );
    padding-left: calc(
        ${contentSpacing.mobileX} + ${(props) => props.$offsetLeft}rem
    );

    margin-right: calc(
        -${contentSpacing.mobileX} + ${(props) => props.$offsetRight * -1}rem
    );
    padding-right: calc(
        ${contentSpacing.mobileX} + ${(props) => props.$offsetRight}rem
    );

    // For at div-en ikkje skal kutte skuggar har vi lagt på 24px "minus-margin-plus-padding".
    // Den største skuggen i designsystemet per 2023-12-19 er 24px, difor er denne verdien brukt.
    margin-top: -24px;
    padding-top: 24px;
    margin-bottom: -24px;
    padding-bottom: 24px;

    /* Firefox har per 2023-12-15 ein bug som gjer at padding ikkje vert inkludert i den utrekna breidda av element,
   * til trass for at ein bruker border-box som boksmodell. 
   * Den fyrste registreringa av buggen er frå 2012: https://bugzilla.mozilla.org/show_bug.cgi?id=748518. 
   *
   * Koden under retter fiksar oppførselen ved å leggje inn eit usynleg :after-element med paddingbreidda 
   * etter det siste bornet til komponenten. 
   * 
   * Dette er reint pirk, brukarane av Fia brukar per 2023 Chrome eller Edge. 
   * Sidan eg sjølv testar i Firefox syntes eg dette var ei spanande utfordring å løyse.
   */
    @-moz-document url-prefix() {
        display: flex; // viser innhaldet som ei flex-rad.

        & > *::after {
            content: "";
            width: ${(props) => props.$offsetRight}rem;
            visibility: hidden;
        }
    }
`;

interface OffsetProps {
    /** Kor mykje padding det er til venstre for komponenten som du vil låne til å scrolle innhald på.
     *  Hardkoda verdi i rem. */
    $offsetLeft: number;
    /** Kor mykje padding det er til høgre for komponenten som du vil låne til å scrolle innhald på.
     *  Hardkoda verdi i rem. */
    $offsetRight: number;
}
