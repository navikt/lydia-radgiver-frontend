import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

/**
 * Standard `render` fra @testing-library/react re-eksportert som "vår" render.
 * Når vi får felles providers (router, swr-config, theme), legges de inn her
 * slik at hver test slipper å duplisere wrapper-oppsettet.
 */
export function renderMedProvidere(
    ui: ReactElement,
    options?: Omit<RenderOptions, "queue">,
) {
    return render(ui, options);
}

export * from "@testing-library/react";
