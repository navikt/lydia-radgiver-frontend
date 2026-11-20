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
const SYKEFRAVÆRSMÅL_URL = `${MÅL_URL}/sykefravaersmaal`;
const SAMARBEIDSMÅL_URL = `${MÅL_URL}/samarbeidsmaal`;

const ingenFunn: personopplysningssjekk.PersonopplysningssjekkResultat = {
    kanInneholdePersonopplysninger: false,
    inneholderTall: false,
    inneholderEpost: false,
    kiFlagget: false,
};

let lagret: Mål;
let lagreKall: Partial<Mål>[];
let lagringFeiler: boolean;
let nesteId: number;
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

const medId = <T extends { id?: number | null }>(mål: T) => ({
    ...mål,
    id: mål.id ?? nesteId++,
});

const falskBackend = (url: string, init?: RequestInit) => {
    if (url === "/csrf-token") return svar(200, { csrfToken: "token" });
    if (url === MÅL_URL && init?.method !== "PUT") return svar(200, lagret);
    if (
        init?.method !== "PUT" ||
        (url !== SYKEFRAVÆRSMÅL_URL && url !== SAMARBEIDSMÅL_URL)
    )
        return svar(404, "Fant ikke ressursen");
    if (lagringFeiler) return svar(500, "Noe gikk galt");

    const body = JSON.parse(init.body as string);
    if (url === SYKEFRAVÆRSMÅL_URL) {
        lagreKall.push({ sykefraværsmål: body });
        lagret = { ...lagret, sykefraværsmål: body.map(medId) };
    } else {
        lagreKall.push({ samarbeidsmål: body });
        lagret = { ...lagret, samarbeidsmål: body.map(medId) };
    }
    return svar(200, lagret);
};

const visSide = (iaSak: IASak = testIaSak) =>
    render(
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
            <MålFane iaSak={iaSak} samarbeid={testSamarbeid} />
        </SWRConfig>,
    );

const SYKEFRAVÆRSDIALOG = "Mål for sykefraværet";
const SAMARBEIDSDIALOG = "Mål for samarbeidet";

const finnDialog = async (
    knapp: { name: string; description?: string },
    dialognavn: string,
) => {
    fireEvent.click(await screen.findByRole("button", knapp));
    const dialog = await screen.findByRole("dialog", { name: dialognavn });
    // Aksel flytter startfokus til dialogen i en requestAnimationFrame. Uten
    // ventingen kan det overstyre fokus som testen flytter rett etterpå.
    await waitFor(() => expect(dialog).toHaveFocus());
    return dialog;
};

const åpneDialog = (
    knapp: { name: string; description?: string },
    dialognavn: string,
) => {
    visSide();
    return finnDialog(knapp, dialognavn);
};

const åpneSykefraværsdialog = () =>
    åpneDialog({ name: "Legg til mål for sykefraværet" }, SYKEFRAVÆRSDIALOG);

const åpneSamarbeidsdialog = () =>
    åpneDialog({ name: "Legg til mål for samarbeidet" }, SAMARBEIDSDIALOG);

const redigerSykefraværsmål = () =>
    åpneDialog(
        { name: "Rediger", description: SYKEFRAVÆRSDIALOG },
        SYKEFRAVÆRSDIALOG,
    );

const redigerSamarbeidsmål = () =>
    åpneDialog(
        { name: "Rediger", description: SAMARBEIDSDIALOG },
        SAMARBEIDSDIALOG,
    );

const nesteÅr = new Date().getFullYear() + 1;

const leggTilSykefraværsmålKnapp = (dialog: HTMLElement) =>
    within(dialog).getByRole("button", {
        name: "Lagre",
        description: "Legg til nytt Mål for sykefraværet",
    });

// X-knappen i dialogens header heter også «Lukk», så vi tar den siste.
const lukkKnapp = (dialog: HTMLElement) =>
    within(dialog).getAllByRole("button", { name: "Lukk" }).at(-1)!;

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
        description: "Legg til nytt Mål for samarbeidet",
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
        nesteId = 100;
        global.fetch = jest.fn(falskBackend) as unknown as typeof fetch;
    });

    test("viser tom tilstand", async () => {
        visSide();

        expect(
            await screen.findByRole("button", {
                name: "Legg til mål for sykefraværet",
            }),
        ).toBeEnabled();
        expect(
            screen.getByRole("button", { name: "Legg til mål for samarbeidet" }),
        ).toBeEnabled();
        expect(
            screen.queryByRole("button", { name: "Rediger" }),
        ).not.toBeInTheDocument();
    });

    test("deaktiverer endringsknappene for brukere som ikke er eier eller følger", async () => {
        visSide({ ...testIaSak, eidAv: "Z999999" });

        expect(
            await screen.findByRole("button", {
                name: "Legg til mål for sykefraværet",
            }),
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Legg til mål for samarbeidet" }),
        ).toBeDisabled();
    });

    test("viser feiloppsummering med lenker til feltene ved tomt skjema", async () => {
        const dialog = await åpneSykefraværsdialog();

        fireEvent.click(leggTilSykefraværsmålKnapp(dialog));

        const lenke = await within(dialog).findByRole("link", {
            name: "Velg en sykefraværsmåltype.",
        });
        const felt = within(dialog).getByLabelText("Type sykefravær");
        expect(lenke).toHaveAttribute("href", `#${felt.id}`);
    });

    test("avviser frist før dagens dato", async () => {
        const dialog = await åpneSykefraværsdialog();

        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6,5", "4", "01.01.2020");

        expect(
            await within(dialog).findByRole("link", {
                name: FEILMELDINGER.frist,
            }),
        ).toBeInTheDocument();
    });

    test("bruker dagsverk for tapte dagsverk og deaktiverer brukt sykefraværsmåltype", async () => {
        const dialog = await åpneSykefraværsdialog();

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

    test("lagrer hvert mål i backend med en gang og viser dem i hvert sitt kort etter Lukk", async () => {
        const sykefraværsdialog = await åpneSykefraværsdialog();
        fyllUtMål(sykefraværsdialog, "KORTTIDSFRAVÆR", "6,5", "4");
        await waitFor(() => expect(lagreKall).toHaveLength(1));
        fireEvent.click(lukkKnapp(sykefraværsdialog));
        await ventPåLukketDialog();

        const samarbeidsdialog = await finnDialog(
            { name: "Legg til mål for samarbeidet" },
            SAMARBEIDSDIALOG,
        );
        await leggTilSamarbeidsmål(samarbeidsdialog, "  Færre korte fravær ");
        fireEvent.click(lukkKnapp(samarbeidsdialog));
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
            },
            {
                samarbeidsmål: [
                    { mål: "Færre korte fravær", lagretMedKiAdvarsel: false },
                ],
            },
        ]);
        const sykefraværskort = screen.getByRole("region", {
            name: SYKEFRAVÆRSDIALOG,
        });
        expect(
            within(sykefraværskort).getByRole("heading", {
                name: "Korttidsfravær",
            }),
        ).toBeInTheDocument();
        expect(within(sykefraværskort).getByText("6,5 %")).toBeInTheDocument();
        expect(
            within(sykefraværskort).getByText(`31.12.${nesteÅr}`),
        ).toBeInTheDocument();
        expect(
            within(
                screen.getByRole("region", { name: SAMARBEIDSDIALOG }),
            ).getByText("Færre korte fravær"),
        ).toBeInTheDocument();
    });

    test("advarer om personopplysninger når et nytt samarbeidsmål lagres og flagger det ved Lagre likevel", async () => {
        sjekk.mockResolvedValue({
            ...ingenFunn,
            kanInneholdePersonopplysninger: true,
            kiFlagget: true,
        });
        const dialog = await åpneSamarbeidsdialog();

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
                description: "Legg til nytt Mål for samarbeidet",
            }),
        ).not.toBeInTheDocument();
        expect(
            within(dialog).getByRole("button", {
                name: "Lagre likevel",
                description: "Legg til nytt Mål for samarbeidet",
            }),
        ).toHaveFocus();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Lagre likevel",
                description: "Legg til nytt Mål for samarbeidet",
            }),
        );

        await waitFor(() =>
            expect(within(dialog).getByLabelText("Legg til mål")).toHaveValue(
                "",
            ),
        );
        expect(lagreKall).toEqual([
            {
                samarbeidsmål: [
                    {
                        mål: "Ola skal tilbake i jobb",
                        lagretMedKiAdvarsel: true,
                    },
                ],
            },
        ]);
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

        expect(sjekk).toHaveBeenCalledTimes(1);
        expect(lagreKall).toHaveLength(1);
    });

    test("tilbyr Lagre likevel når sjekken av et nytt samarbeidsmål feiler", async () => {
        sjekk.mockRejectedValue(new Error("Nede"));
        const dialog = await åpneSamarbeidsdialog();

        skrivOgLagreSamarbeidsmål(dialog, "Bedre dialog");

        expect(
            await within(dialog).findByRole("heading", {
                name: /Kunne ikke sjekke teksten/,
            }),
        ).toBeInTheDocument();
        expect(
            within(dialog).getByRole("button", {
                name: "Lagre",
                description: "Legg til nytt Mål for samarbeidet",
            }),
        ).toBeInTheDocument();

        fireEvent.click(
            within(dialog).getByRole("button", { name: "Lagre likevel" }),
        );

        await waitFor(() =>
            expect(lagreKall).toEqual([
                {
                    samarbeidsmål: [
                        { mål: "Bedre dialog", lagretMedKiAdvarsel: false },
                    ],
                },
            ]),
        );
    });

    test("sjekker bare det nye samarbeidsmålet og beholder ID og KI-flagg på de lagrede", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: true },
            ],
        };
        const dialog = await redigerSamarbeidsmål();

        expect(within(dialog).getByText("Bedre dialog")).toBeInTheDocument();
        await leggTilSamarbeidsmål(dialog, "Færre fravær");

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
    });

    test("sletter samarbeidsmål og flytter fokus til listen over samarbeidsmål", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false },
                { id: 8, mål: "Færre fravær", lagretMedKiAdvarsel: false },
            ],
        };
        const dialog = await redigerSamarbeidsmål();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Slett",
                description: "Bedre dialog",
            }),
        );

        await waitFor(() =>
            expect(
                within(dialog).getByRole("heading", {
                    name: "Mål for samarbeidet mål som er lagt til",
                    level: 3,
                }),
            ).toHaveFocus(),
        );
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
        const dialog = await redigerSamarbeidsmål();
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
        const dialog = await redigerSamarbeidsmål();

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
        expect(lagreKall).toHaveLength(0);
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
        const dialog = await redigerSamarbeidsmål();

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

        await waitFor(() =>
            expect(
                within(dialog).queryByLabelText("Endre mål"),
            ).not.toBeInTheDocument(),
        );
        expect(within(dialog).getByText(KORT_ADVARSEL)).toBeInTheDocument();
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { id: 7, mål: "Ring 12345678", lagretMedKiAdvarsel: true },
        ]);
    });

    test("Lukk stopper når et samarbeidsmål er under redigering", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false },
            ],
        };
        const dialog = await redigerSamarbeidsmål();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Bedre dialog",
            }),
        );
        fireEvent.click(lukkKnapp(dialog));

        const lenke = await within(dialog).findByRole("link", {
            name: FEILMELDINGER.ulagretEndringSamarbeidsmål,
        });
        expect(lenke).toHaveAttribute(
            "href",
            `#${within(dialog).getByLabelText("Endre mål").id}`,
        );
        expect(lagreKall).toHaveLength(0);
    });

    test("ber om Lagre likevel når et samarbeidsmål med personopplysninger er under redigering", async () => {
        sjekk.mockResolvedValue({
            ...ingenFunn,
            kanInneholdePersonopplysninger: true,
        });
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false },
            ],
        };
        const dialog = await redigerSamarbeidsmål();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Bedre dialog",
            }),
        );
        const felt = within(dialog).getByLabelText("Endre mål");
        const kort = kortMedFelt(felt);
        fireEvent.change(felt, { target: { value: "Ring Ola" } });
        fireEvent.click(within(kort).getByRole("button", { name: "Lagre" }));
        await within(kort).findByRole("button", { name: "Lagre likevel" });
        fireEvent.click(lukkKnapp(dialog));

        expect(
            await within(dialog).findByRole("link", {
                name: FEILMELDINGER.ulagretEndringSamarbeidsmålMedPersonopplysninger,
            }),
        ).toHaveAttribute("href", `#${felt.id}`);
        expect(lagreKall).toHaveLength(0);
    });

    test("viser feil og beholder skjemaet når lagringen feiler, og lagrer ved nytt forsøk", async () => {
        lagringFeiler = true;
        const dialog = await åpneSykefraværsdialog();

        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");

        expect(
            await within(dialog).findByText("Kunne ikke lagre målet"),
        ).toBeInTheDocument();
        expect(within(dialog).getByLabelText("Type sykefravær")).toHaveValue(
            "KORTTIDSFRAVÆR",
        );

        lagringFeiler = false;
        fireEvent.click(leggTilSykefraværsmålKnapp(dialog));

        await waitFor(() =>
            expect(
                within(dialog).queryByText("Kunne ikke lagre målet"),
            ).not.toBeInTheDocument(),
        );
        expect(lagreKall).toHaveLength(1);
        expect(within(dialog).getByText("Lagret")).toBeInTheDocument();
    });

    test("flytter fokus til listen over sykefraværsmål etter at et sykefraværsmål er lagt til", async () => {
        const dialog = await åpneSykefraværsdialog();
        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");

        const overskrift = await within(dialog).findByRole("heading", {
            name: "Mål for sykefraværet mål som er lagt til",
            level: 3,
        });
        await waitFor(() => expect(overskrift).toHaveFocus());
    });

    test("legger til samarbeidsmål som kort som kan slettes", async () => {
        const dialog = await åpneSamarbeidsdialog();

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

        expect(await within(dialog).findByText("Slettet")).toBeInTheDocument();
        expect(
            within(dialog).queryByText("Bedre dialog"),
        ).not.toBeInTheDocument();
    });

    test("viser feil og beholder fokus i feltet når et tomt samarbeidsmål legges til", async () => {
        const dialog = await åpneSamarbeidsdialog();

        fireEvent.click(leggTilSamarbeidsmålKnapp(dialog));

        expect(
            within(dialog).getByText(FEILMELDINGER.tomtSamarbeidsmål),
        ).toBeInTheDocument();
        expect(within(dialog).getByLabelText("Legg til mål")).toHaveFocus();
    });

    test("Lukk stopper når et samarbeidsmål ikke er lagt til", async () => {
        const dialog = await åpneSamarbeidsdialog();
        const felt = within(dialog).getByLabelText("Legg til mål");

        fireEvent.change(felt, { target: { value: "Bedre dialog" } });
        fireEvent.click(lukkKnapp(dialog));

        const lenke = await within(dialog).findByRole("link", {
            name: FEILMELDINGER.ulagretSamarbeidsmål,
        });
        expect(lenke).toHaveAttribute("href", `#${felt.id}`);
        expect(lagreKall).toHaveLength(0);
    });

    test("ber om Lagre likevel når et nytt samarbeidsmål med personopplysninger ikke er lagt til", async () => {
        sjekk.mockResolvedValue({
            ...ingenFunn,
            kanInneholdePersonopplysninger: true,
        });
        const dialog = await åpneSamarbeidsdialog();

        skrivOgLagreSamarbeidsmål(dialog, "Ola skal tilbake i jobb");
        await within(dialog).findByRole("button", { name: "Lagre likevel" });
        fireEvent.click(lukkKnapp(dialog));

        expect(
            await within(dialog).findByRole("link", {
                name: FEILMELDINGER.ulagretSamarbeidsmålMedPersonopplysninger,
            }),
        ).toHaveAttribute(
            "href",
            `#${within(dialog).getByLabelText("Legg til mål").id}`,
        );
        expect(lagreKall).toHaveLength(0);
    });

    test("Lukk stopper når sykefraværsskjemaet er utfylt men ikke lagt til", async () => {
        const dialog = await åpneSykefraværsdialog();
        const skjema = leggTilSykefraværsmålKnapp(dialog).closest(
            "form",
        ) as HTMLElement;
        const typefelt = within(skjema).getByLabelText("Type sykefravær");

        fireEvent.change(typefelt, { target: { value: "KORTTIDSFRAVÆR" } });
        fireEvent.click(lukkKnapp(dialog));

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

    test("dialogene og oversikten har ingen axe-brudd", async () => {
        const { container } = visSide();
        const sykefraværsdialog = await finnDialog(
            { name: "Legg til mål for sykefraværet" },
            SYKEFRAVÆRSDIALOG,
        );
        fyllUtMål(sykefraværsdialog, "KORTTIDSFRAVÆR", "6", "4");
        await within(sykefraværsdialog).findByRole("heading", {
            name: "Mål for sykefraværet mål som er lagt til",
            level: 3,
        });
        expect(await axe(sykefraværsdialog)).toHaveNoViolations();
        fireEvent.click(lukkKnapp(sykefraværsdialog));
        await ventPåLukketDialog();

        const samarbeidsdialog = await finnDialog(
            { name: "Legg til mål for samarbeidet" },
            SAMARBEIDSDIALOG,
        );
        await leggTilSamarbeidsmål(samarbeidsdialog, "Bedre dialog");
        expect(await axe(samarbeidsdialog)).toHaveNoViolations();
        fireEvent.click(lukkKnapp(samarbeidsdialog));
        await ventPåLukketDialog();

        expect(await axe(container)).toHaveNoViolations();
    });

    test("Rediger åpner sykefraværsdialogen og lar brukeren legge til, endre og slette sykefraværsmål", async () => {
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
        const dialog = await redigerSykefraværsmål();

        fyllUtMål(dialog, "LEGEMELDT_FRAVÆR", "3", "2");
        await waitFor(() => expect(lagreKall).toHaveLength(1));
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
        await waitFor(() => expect(lagreKall).toHaveLength(3));
        fireEvent.click(lukkKnapp(dialog));

        await ventPåLukketDialog();
        expect(lagreKall.at(-1)?.sykefraværsmål).toStrictEqual([
            {
                id: 7,
                type: "KORTTIDSFRAVÆR",
                nåværende: 6,
                mål: 1.5,
                frist: `${nesteÅr}-12-31`,
            },
            {
                id: 100,
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
        const dialog = await redigerSykefraværsmål();

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

        expect(within(dialog).getByText("4 %")).toBeInTheDocument();
        expect(lagreKall).toHaveLength(0);
    });

    test("Lukk stopper når et sykefraværsmålkort er i redigering", async () => {
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
        const dialog = await redigerSykefraværsmål();

        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Rediger",
                description: "Korttidsfravær",
            }),
        );
        fireEvent.click(lukkKnapp(dialog));

        expect(
            await within(dialog).findByRole("link", {
                name: FEILMELDINGER.ulagretEndringSykefraværsmål,
            }),
        ).toBeInTheDocument();
        expect(lagreKall).toHaveLength(0);
    });
});
