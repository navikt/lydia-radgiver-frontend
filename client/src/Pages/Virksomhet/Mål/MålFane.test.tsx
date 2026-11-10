import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { SWRConfig } from "swr";
import MålFane from "./index";
import { FEILMELDINGER } from "./målskjema";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { Mål } from "../../../domenetyper/mål";
import * as personopplysningssjekk from "../../../api/lydia-api/personopplysningssjekk";

jest.mock("../../../api/lydia-api/bruker", () => ({
    ...jest.requireActual("../../../api/lydia-api/bruker"),
    useHentBrukerinformasjon: () => ({
        data: {
            ident: "Z123456",
            navn: "Test Testesen",
            epost: "",
            rolle: "Saksbehandler",
        },
        loading: false,
    }),
}));

jest.mock("../../../api/lydia-api/team", () => ({
    ...jest.requireActual("../../../api/lydia-api/team"),
    useHentTeam: () => ({ data: [], loading: false, mutate: jest.fn() }),
}));

const testIaSak: IASak = {
    saksnummer: "SAK-001",
    orgnr: "123456789",
    opprettetTidspunkt: new Date("2025-01-01"),
    opprettetAv: "Z123456",
    endretTidspunkt: null,
    endretAv: null,
    endretAvHendelseId: "hendelse-1",
    eidAv: "Z123456",
    status: "AKTIV",
};

const testSamarbeid: IaSakProsess = {
    id: 42,
    saksnummer: "SAK-001",
    navn: "Samarbeid",
    status: "AKTIV",
};

const MÅL_URL =
    "/proxy/api/v1/virksomhet/123456789/samarbeidsperiode/SAK-001/samarbeid/42/maal";

const ingenFunn: personopplysningssjekk.PersonopplysningssjekkResultat = {
    kanInneholdePersonopplysninger: false,
    inneholderTall: false,
    inneholderEpost: false,
    kiFlagget: false,
};

let lagret: Mål;
let lagreKall: Mål[];
let lagringFeiler: boolean;
let sjekk: jest.SpiedFunction<
    typeof personopplysningssjekk.sjekkPersonopplysninger
>;

const svar = (status: number, body: unknown) =>
    Promise.resolve({
        ok: status < 300,
        status,
        json: () => Promise.resolve(body),
        text: () =>
            Promise.resolve(
                typeof body === "string" ? body : JSON.stringify(body),
            ),
    });

const falskBackend = (url: string, init?: RequestInit) => {
    if (url === "/csrf-token") return svar(200, { csrfToken: "token" });
    if (url !== MÅL_URL) return svar(404, "Fant ikke ressursen");
    if (init?.method !== "PUT") return svar(200, lagret);
    if (lagringFeiler) return svar(500, "Noe gikk galt");

    const body: Mål = JSON.parse(init.body as string);
    lagreKall.push(body);
    lagret = {
        ...body,
        samarbeidsmål: body.samarbeidsmål.map((m, i) => ({
            ...m,
            id: m.id ?? 100 + i,
        })),
    };
    return svar(200, lagret);
};

const visSide = (iaSak: IASak = testIaSak) =>
    render(
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
            <MålFane iaSak={iaSak} samarbeid={testSamarbeid} />
        </SWRConfig>,
    );

const åpneDialog = async (knapp: string, dialognavn = knapp) => {
    visSide();
    fireEvent.click(await screen.findByRole("button", { name: knapp }));
    return screen.findByRole("dialog", { name: dialognavn });
};

const åpneOpprettDialog = () => åpneDialog("Legg til mål", "Mål");

const nesteÅr = new Date().getFullYear() + 1;

const leggTilSykefraværsmålKnapp = (dialog: HTMLElement) =>
    within(dialog).getByRole("button", {
        name: "Lagre",
        description: "Mål for sykefraværet",
    });

const lagreKnapp = (dialog: HTMLElement) =>
    within(dialog).getAllByRole("button", { name: "Lagre" }).at(-1)!;

const kortMedFelt = (felt: HTMLElement) =>
    felt.closest(".aksel-box") as HTMLElement;

const sykefraværskortIRedigering = (dialog: HTMLElement, navn: string) =>
    within(dialog)
        .getByRole("heading", { name: navn, level: 4 })
        .closest(".aksel-box") as HTMLElement;

const fyllUtMål = (
    dialog: HTMLElement,
    type: string,
    nåværende: string,
    mål: string,
    frist = `31.12.${nesteÅr}`,
) => {
    const leggTil = leggTilSykefraværsmålKnapp(dialog);
    const skjema = leggTil.closest("form") as HTMLElement;
    fireEvent.change(within(skjema).getByLabelText("Type sykefravær"), {
        target: { value: type },
    });
    fireEvent.change(within(skjema).getByLabelText(/^Nåværende/), {
        target: { value: nåværende },
    });
    fireEvent.change(within(skjema).getByLabelText(/^Mål \(/), {
        target: { value: mål },
    });
    fireEvent.change(within(skjema).getByLabelText("Når skal målet nås?"), {
        target: { value: frist },
    });
    fireEvent.click(leggTil);
};

const ventPåLukketDialog = () =>
    waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

const leggTilSamarbeidsmålKnapp = (dialog: HTMLElement) =>
    within(dialog).getByRole("button", {
        name: "Lagre",
        description: "Mål for samarbeidet",
    });

const skrivOgLagreSamarbeidsmål = (dialog: HTMLElement, tekst: string) => {
    fireEvent.change(within(dialog).getByLabelText("Legg til mål"), {
        target: { value: tekst },
    });
    fireEvent.click(leggTilSamarbeidsmålKnapp(dialog));
};

const leggTilSamarbeidsmål = async (dialog: HTMLElement, tekst: string) => {
    skrivOgLagreSamarbeidsmål(dialog, tekst);
    await waitFor(() =>
        expect(within(dialog).getByLabelText("Legg til mål")).toHaveValue(""),
    );
};

const KORT_ADVARSEL = "Teksten kan inneholde personopplysninger";

describe("MålFane", () => {
    beforeAll(() => {
        (
            globalThis as { AKSEL_NO_EXIT_ANIMATIONS?: boolean }
        ).AKSEL_NO_EXIT_ANIMATIONS = true;
    });

    beforeEach(() => {
        jest.restoreAllMocks();
        sjekk = jest
            .spyOn(personopplysningssjekk, "sjekkPersonopplysninger")
            .mockResolvedValue(ingenFunn);
        lagret = { sykefraværsmål: [], samarbeidsmål: [] };
        lagreKall = [];
        lagringFeiler = false;
        global.fetch = jest.fn(falskBackend) as unknown as typeof fetch;
    });

    test("viser tom tilstand", async () => {
        visSide();

        expect(
            await screen.findByRole("button", { name: "Legg til mål" }),
        ).toBeInTheDocument();
    });

    test("skjuler endringsknappene for brukere som ikke er eier eller følger", async () => {
        visSide({ ...testIaSak, eidAv: "Z999999" });

        expect(
            await screen.findByText(
                "Du må være eier eller følger for å legge til mål.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Legg til mål" }),
        ).not.toBeInTheDocument();
    });

    test("viser feiloppsummering med lenker til feltene ved tomt skjema", async () => {
        const dialog = await åpneOpprettDialog();

        fireEvent.click(leggTilSykefraværsmålKnapp(dialog));

        const lenke = await within(dialog).findByRole("link", {
            name: "Velg en sykefraværsmåltype.",
        });
        const felt = within(dialog).getByLabelText("Type sykefravær");
        expect(lenke).toHaveAttribute("href", `#${felt.id}`);
    });

    test("avviser frist før dagens dato", async () => {
        const dialog = await åpneOpprettDialog();

        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6,5", "4", "01.01.2020");

        expect(
            await within(dialog).findByRole("link", {
                name: FEILMELDINGER.frist,
            }),
        ).toBeInTheDocument();
    });

    test("bruker dagsverk for tapte dagsverk og deaktiverer brukt sykefraværsmåltype", async () => {
        const dialog = await åpneOpprettDialog();

        fyllUtMål(dialog, "TAPTE_DAGSVERK", "1250", "900,5");

        expect(
            await within(dialog).findByText("1 250 dagsverk"),
        ).toBeInTheDocument();
        expect(
            within(dialog).getByRole("option", {
                name: "Tapte dagsverk (allerede lagt til)",
            }),
        ).toBeDisabled();
    });

    test("lagrer målene i backend og viser dem på siden", async () => {
        const dialog = await åpneOpprettDialog();

        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6,5", "4");
        await leggTilSamarbeidsmål(dialog, "  Færre korte fravær ");
        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(sjekk).toHaveBeenCalledWith(
            "123456789",
            "SAK-001",
            "Færre korte fravær",
        );
        expect(lagreKall).toEqual([
            {
                sykefraværsmål: [
                    {
                        type: "KORTTIDSFRAVÆR",
                        nåværende: 6.5,
                        mål: 4,
                        frist: `${nesteÅr}-12-31`,
                    },
                ],
                samarbeidsmål: [
                    { mål: "Færre korte fravær", lagretMedKiAdvarsel: false },
                ],
            },
        ]);
        expect(
            await screen.findByRole("heading", { name: "Korttidsfravær" }),
        ).toBeInTheDocument();
        expect(screen.getByText("6,5 %")).toBeInTheDocument();
        expect(screen.getByText(`31.12.${nesteÅr}`)).toBeInTheDocument();
        expect(screen.getByText("Færre korte fravær")).toBeInTheDocument();
    });

    test("advarer om personopplysninger når et nytt samarbeidsmål lagres og flagger det ved Lagre likevel", async () => {
        sjekk.mockResolvedValue({
            ...ingenFunn,
            kanInneholdePersonopplysninger: true,
            kiFlagget: true,
        });
        const dialog = await åpneOpprettDialog();

        skrivOgLagreSamarbeidsmål(dialog, "Ola skal tilbake i jobb");

        expect(
            await within(dialog).findByRole("heading", {
                name: new RegExp(KORT_ADVARSEL),
            }),
        ).toBeInTheDocument();
        expect(within(dialog).getByLabelText("Legg til mål")).toHaveValue(
            "Ola skal tilbake i jobb",
        );
        expect(
            within(dialog).queryByRole("button", {
                name: "Lagre",
                description: "Mål for samarbeidet",
            }),
        ).not.toBeInTheDocument();
        expect(
            within(dialog).getByRole("button", {
                name: "Lagre likevel",
                description: "Mål for samarbeidet",
            }),
        ).toHaveFocus();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Lagre likevel",
                description: "Mål for samarbeidet",
            }),
        );

        expect(within(dialog).getByLabelText("Legg til mål")).toHaveValue("");
        expect(
            within(dialog).queryByRole("heading", {
                name: new RegExp(KORT_ADVARSEL),
            }),
        ).not.toBeInTheDocument();
        expect(within(dialog).getByText(KORT_ADVARSEL)).toBeInTheDocument();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Ola skal tilbake i jobb",
            }),
        );
        const kort = kortMedFelt(within(dialog).getByLabelText("Endre mål"));
        expect(
            within(kort).getByText(/kan gjøre en person gjenkjennelig/),
        ).toBeInTheDocument();
        fireEvent.change(within(kort).getByLabelText("Endre mål"), {
            target: { value: "Ola skal tilbake i jobb snart" },
        });
        expect(
            within(kort).queryByText(/kan gjøre en person gjenkjennelig/),
        ).not.toBeInTheDocument();
        fireEvent.click(within(kort).getByRole("button", { name: "Avbryt" }));

        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(sjekk).toHaveBeenCalledTimes(1);
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { mål: "Ola skal tilbake i jobb", lagretMedKiAdvarsel: true },
        ]);
    });

    test("tilbyr Lagre likevel når sjekken av et nytt samarbeidsmål feiler", async () => {
        sjekk.mockRejectedValue(new Error("Nede"));
        const dialog = await åpneOpprettDialog();

        skrivOgLagreSamarbeidsmål(dialog, "Bedre dialog");

        expect(
            await within(dialog).findByRole("heading", {
                name: /Kunne ikke sjekke teksten/,
            }),
        ).toBeInTheDocument();
        expect(
            within(dialog).getByRole("button", {
                name: "Lagre",
                description: "Mål for samarbeidet",
            }),
        ).toBeInTheDocument();

        fireEvent.click(
            within(dialog).getByRole("button", { name: "Lagre likevel" }),
        );
        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { mål: "Bedre dialog", lagretMedKiAdvarsel: false },
        ]);
    });

    test("sjekker ikke samarbeidsmål på nytt ved lagring av dialogen og beholder ID og KI-flagg på uendrede", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: true },
            ],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        expect(within(dialog).getByText("Bedre dialog")).toBeInTheDocument();
        await leggTilSamarbeidsmål(dialog, "Færre fravær");
        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(sjekk).toHaveBeenCalledTimes(1);
        expect(sjekk).toHaveBeenCalledWith(
            "123456789",
            "SAK-001",
            "Færre fravær",
        );
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: true },
            { mål: "Færre fravær", lagretMedKiAdvarsel: false },
        ]);
        expect(await screen.findByRole("list")).toBeInTheDocument();
    });

    test("sletter samarbeidsmål og flytter fokus til listen over samarbeidsmål", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false },
                { id: 8, mål: "Færre fravær", lagretMedKiAdvarsel: false },
            ],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Slett",
                description: "Bedre dialog",
            }),
        );

        expect(
            within(dialog).getByRole("heading", {
                name: "Mål for samarbeidet",
                level: 3,
            }),
        ).toHaveFocus();
        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { id: 8, mål: "Færre fravær", lagretMedKiAdvarsel: false },
        ]);
    });

    test("redigerer samarbeidsmål direkte i kortet og fjerner KI-flagget når den nye teksten er ren", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: true },
            ],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");
        expect(within(dialog).getByText(KORT_ADVARSEL)).toBeInTheDocument();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Bedre dialog",
            }),
        );

        const felt = within(dialog).getByLabelText("Endre mål");
        expect(felt).toHaveValue("Bedre dialog");
        expect(
            within(kortMedFelt(felt)).getByText(
                /Sjekken fant mulige personopplysninger/,
            ),
        ).toBeInTheDocument();
        await waitFor(() => expect(felt).toHaveFocus());
        fireEvent.change(felt, {
            target: { value: "Bedre dialog med ledelsen" },
        });
        fireEvent.click(
            within(kortMedFelt(felt)).getByRole("button", { name: "Lagre" }),
        );

        await waitFor(() =>
            expect(
                within(dialog).getByRole("button", {
                    name: "Rediger",
                    description: "Bedre dialog med ledelsen",
                }),
            ).toHaveFocus(),
        );
        expect(sjekk).toHaveBeenCalledWith(
            "123456789",
            "SAK-001",
            "Bedre dialog med ledelsen",
        );
        expect(within(dialog).getByText("Lagret")).toBeInTheDocument();
        expect(
            within(dialog).queryByText(KORT_ADVARSEL),
        ).not.toBeInTheDocument();

        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(lagreKall[0].samarbeidsmål).toEqual([
            {
                id: 7,
                mål: "Bedre dialog med ledelsen",
                lagretMedKiAdvarsel: false,
            },
        ]);
    });

    test("sjekker ikke uendret tekst i kortet og beholder KI-flagget", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: true },
            ],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Bedre dialog",
            }),
        );
        const felt = within(dialog).getByLabelText("Endre mål");
        fireEvent.click(
            within(kortMedFelt(felt)).getByRole("button", { name: "Lagre" }),
        );

        expect(
            within(dialog).queryByLabelText("Endre mål"),
        ).not.toBeInTheDocument();
        expect(within(dialog).getByText(KORT_ADVARSEL)).toBeInTheDocument();
        expect(sjekk).not.toHaveBeenCalled();
    });

    test("advarer i kortet når endret tekst kan inneholde personopplysninger og flagger ved Lagre likevel", async () => {
        sjekk.mockResolvedValue({
            ...ingenFunn,
            kanInneholdePersonopplysninger: true,
            inneholderTall: true,
        });
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false },
            ],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Bedre dialog",
            }),
        );
        const felt = within(dialog).getByLabelText("Endre mål");
        const kort = kortMedFelt(felt);
        fireEvent.change(felt, { target: { value: "Ring 12345678" } });
        fireEvent.click(within(kort).getByRole("button", { name: "Lagre" }));

        expect(
            await within(kort).findByText(/Teksten inneholder tall/),
        ).toBeInTheDocument();
        expect(felt).toHaveValue("Ring 12345678");
        expect(
            within(kort).queryByRole("button", { name: "Lagre" }),
        ).not.toBeInTheDocument();
        expect(
            within(kort).getByRole("button", { name: "Lagre likevel" }),
        ).toHaveFocus();

        fireEvent.click(
            within(kort).getByRole("button", { name: "Lagre likevel" }),
        );

        expect(
            within(dialog).queryByLabelText("Endre mål"),
        ).not.toBeInTheDocument();
        expect(within(dialog).getByText(KORT_ADVARSEL)).toBeInTheDocument();

        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { id: 7, mål: "Ring 12345678", lagretMedKiAdvarsel: true },
        ]);
    });

    test("stopper lagringen når et samarbeidsmål er under redigering", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false },
            ],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Bedre dialog",
            }),
        );
        fireEvent.click(lagreKnapp(dialog));

        const lenke = await within(dialog).findByRole("link", {
            name: FEILMELDINGER.ulagretEndringSamarbeidsmål,
        });
        expect(lenke).toHaveAttribute(
            "href",
            `#${within(dialog).getByLabelText("Endre mål").id}`,
        );
        expect(lagreKall).toHaveLength(0);
    });

    test("holder dialogen åpen og viser feil når lagringen feiler", async () => {
        lagringFeiler = true;
        const dialog = await åpneOpprettDialog();

        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");
        fireEvent.click(lagreKnapp(dialog));

        expect(
            await within(dialog).findByText("Kunne ikke lagre målene"),
        ).toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("flytter fokus til listen over sykefraværsmål etter at et sykefraværsmål er lagt til", async () => {
        const dialog = await åpneOpprettDialog();
        await waitFor(() => expect(dialog).toHaveFocus());
        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");

        const overskrift = await within(dialog).findByRole("heading", {
            name: "Mål for sykefraværet",
            level: 3,
        });
        await waitFor(() => expect(overskrift).toHaveFocus());
    });

    test("legger til samarbeidsmål som kort som kan slettes", async () => {
        const dialog = await åpneOpprettDialog();

        expect(
            within(dialog).queryByRole("button", { name: "Slett" }),
        ).not.toBeInTheDocument();

        await leggTilSamarbeidsmål(dialog, "Bedre dialog");

        expect(within(dialog).getByText("Bedre dialog")).toBeInTheDocument();
        expect(within(dialog).getByText("Lagret")).toBeInTheDocument();
        expect(within(dialog).getByLabelText("Legg til mål")).toHaveValue("");

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Slett",
                description: "Bedre dialog",
            }),
        );

        expect(
            within(dialog).queryByText("Bedre dialog"),
        ).not.toBeInTheDocument();
        expect(within(dialog).getByText("Slettet")).toBeInTheDocument();
    });

    test("viser feil og beholder fokus i feltet når et tomt samarbeidsmål legges til", async () => {
        const dialog = await åpneOpprettDialog();

        fireEvent.click(leggTilSamarbeidsmålKnapp(dialog));

        expect(
            within(dialog).getByText(FEILMELDINGER.tomtSamarbeidsmål),
        ).toBeInTheDocument();
        expect(within(dialog).getByLabelText("Legg til mål")).toHaveFocus();
    });

    test("stopper lagringen når et samarbeidsmål ikke er lagt til", async () => {
        const dialog = await åpneOpprettDialog();
        const felt = within(dialog).getByLabelText("Legg til mål");

        fireEvent.change(felt, { target: { value: "Bedre dialog" } });
        fireEvent.click(lagreKnapp(dialog));

        const lenke = await within(dialog).findByRole("link", {
            name: FEILMELDINGER.ulagretSamarbeidsmål,
        });
        expect(lenke).toHaveAttribute("href", `#${felt.id}`);
        expect(lagreKall).toHaveLength(0);
    });

    test("stopper lagringen når sykefraværsskjemaet er utfylt men ikke lagt til", async () => {
        const dialog = await åpneOpprettDialog();
        const skjema = leggTilSykefraværsmålKnapp(dialog).closest(
            "form",
        ) as HTMLElement;
        const typefelt = within(skjema).getByLabelText("Type sykefravær");

        fireEvent.change(typefelt, { target: { value: "KORTTIDSFRAVÆR" } });
        fireEvent.click(lagreKnapp(dialog));

        const lenke = await within(dialog).findByRole("link", {
            name: FEILMELDINGER.ulagretNyttSykefraværsmål,
        });
        expect(lenke).toHaveAttribute("href", `#${typefelt.id}`);
        expect(lagreKall).toHaveLength(0);
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        fireEvent.change(within(skjema).getByLabelText(/^Mål \(/), {
            target: { value: "4" },
        });

        expect(
            within(dialog).queryByRole("link", {
                name: FEILMELDINGER.ulagretNyttSykefraværsmål,
            }),
        ).not.toBeInTheDocument();
    });

    test("opprettelsesdialogen har ingen axe-brudd", async () => {
        const dialog = await åpneOpprettDialog();
        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");
        await within(dialog).findByRole("heading", {
            name: "Mål for sykefraværet",
            level: 3,
        });
        await leggTilSamarbeidsmål(dialog, "Bedre dialog");

        expect(await axe(dialog)).toHaveNoViolations();
    });

    test("redigeringsdialogen lar brukeren legge til, endre og slette sykefraværsmål", async () => {
        lagret = {
            sykefraværsmål: [
                {
                    id: 7,
                    type: "KORTTIDSFRAVÆR",
                    nåværende: 6,
                    mål: 4,
                    frist: `${nesteÅr}-12-31`,
                },
                {
                    id: 8,
                    type: "LANGTIDSFRAVÆR",
                    nåværende: 5,
                    mål: 3,
                    frist: `${nesteÅr}-12-31`,
                },
            ],
            samarbeidsmål: [],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fyllUtMål(dialog, "LEGEMELDT_FRAVÆR", "3", "2");
        fireEvent.click(
            await within(dialog).findByRole("button", {
                name: "Rediger",
                description: "Korttidsfravær",
            }),
        );
        const kort = sykefraværskortIRedigering(dialog, "Korttidsfravær");
        expect(
            within(kort).queryByLabelText("Type sykefravær"),
        ).not.toBeInTheDocument();
        await waitFor(() =>
            expect(within(kort).getByLabelText("Nåværende (%)")).toHaveFocus(),
        );
        fireEvent.change(within(kort).getByLabelText("Mål (%)"), {
            target: { value: "1,5" },
        });
        fireEvent.click(within(kort).getByRole("button", { name: "Lagre" }));
        await waitFor(() =>
            expect(
                within(dialog).getByRole("button", {
                    name: "Rediger",
                    description: "Korttidsfravær",
                }),
            ).toHaveFocus(),
        );
        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Slett",
                description: "Langtidsfravær",
            }),
        );
        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(lagreKall[0].sykefraværsmål).toStrictEqual([
            {
                id: 7,
                type: "KORTTIDSFRAVÆR",
                nåværende: 6,
                mål: 1.5,
                frist: `${nesteÅr}-12-31`,
            },
            {
                type: "LEGEMELDT_FRAVÆR",
                nåværende: 3,
                mål: 2,
                frist: `${nesteÅr}-12-31`,
            },
        ]);
        expect(await screen.findByText("1,5 %")).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "Langtidsfravær" }),
        ).not.toBeInTheDocument();
    });

    test("Avbryt i et sykefraværsmålkort forkaster endringene", async () => {
        lagret = {
            sykefraværsmål: [
                {
                    type: "KORTTIDSFRAVÆR",
                    nåværende: 6,
                    mål: 4,
                    frist: `${nesteÅr}-12-31`,
                },
            ],
            samarbeidsmål: [],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Korttidsfravær",
            }),
        );
        const kort = sykefraværskortIRedigering(dialog, "Korttidsfravær");
        fireEvent.change(within(kort).getByLabelText("Mål (%)"), {
            target: { value: "1" },
        });
        fireEvent.click(within(kort).getByRole("button", { name: "Avbryt" }));
        fireEvent.click(lagreKnapp(dialog));

        await ventPåLukketDialog();
        expect(lagreKall[0].sykefraværsmål).toEqual([
            {
                type: "KORTTIDSFRAVÆR",
                nåværende: 6,
                mål: 4,
                frist: `${nesteÅr}-12-31`,
            },
        ]);
    });

    test("stopper lagringen når et sykefraværsmålkort er i redigering", async () => {
        lagret = {
            sykefraværsmål: [
                {
                    type: "KORTTIDSFRAVÆR",
                    nåværende: 6,
                    mål: 4,
                    frist: `${nesteÅr}-12-31`,
                },
            ],
            samarbeidsmål: [],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Korttidsfravær",
            }),
        );
        fireEvent.click(lagreKnapp(dialog));

        expect(
            await within(dialog).findByRole("link", {
                name: FEILMELDINGER.ulagretEndringSykefraværsmål,
            }),
        ).toBeInTheDocument();
        expect(lagreKall).toHaveLength(0);
    });
});
