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

const åpneOpprettDialog = () => åpneDialog("Legg til mål");

const nesteÅr = new Date().getFullYear() + 1;

const fyllUtMål = (
    dialog: HTMLElement,
    type: string,
    nåværende: string,
    mål: string,
    frist = `31.12.${nesteÅr}`,
) => {
    const skjema = within(dialog).getByRole("region", {
        name: "Legg til sykefraværsmål",
    });
    fireEvent.change(within(skjema).getByLabelText("Sykefraværsmåltype"), {
        target: { value: type },
    });
    fireEvent.change(within(skjema).getByLabelText(/^I dag/), {
        target: { value: nåværende },
    });
    fireEvent.change(within(skjema).getByLabelText(/^Mål \(/), {
        target: { value: mål },
    });
    fireEvent.change(within(skjema).getByLabelText("Når skal målet nås?"), {
        target: { value: frist },
    });
    fireEvent.click(
        within(skjema).getByRole("button", { name: "Legg til mål" }),
    );
};

const ventPåLukketDialog = () =>
    waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

describe("MålFane", () => {
    beforeAll(() => {
        (
            globalThis as { AKSEL_NO_EXIT_ANIMATIONS?: boolean }
        ).AKSEL_NO_EXIT_ANIMATIONS = true;
    });

    beforeEach(() => {
        jest.restoreAllMocks();
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

        fireEvent.click(
            within(
                within(dialog).getByRole("region", {
                    name: "Legg til sykefraværsmål",
                }),
            ).getByRole("button", { name: "Legg til mål" }),
        );

        const lenke = await within(dialog).findByRole("link", {
            name: "Velg en sykefraværsmåltype.",
        });
        const felt = within(dialog).getByLabelText("Sykefraværsmåltype");
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
        const sjekk = jest
            .spyOn(personopplysningssjekk, "sjekkPersonopplysninger")
            .mockResolvedValue(ingenFunn);
        const dialog = await åpneOpprettDialog();

        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6,5", "4");
        fireEvent.change(within(dialog).getByLabelText("Mål 1"), {
            target: { value: "  Færre korte fravær " },
        });
        fireEvent.click(within(dialog).getByRole("button", { name: "Lagre" }));

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
        expect(screen.getByText("Målene er lagret.")).toBeInTheDocument();
    });

    test("advarer om personopplysninger og lagrer med KI-advarsel når brukeren lagrer likevel", async () => {
        jest.spyOn(
            personopplysningssjekk,
            "sjekkPersonopplysninger",
        ).mockResolvedValue({
            ...ingenFunn,
            kanInneholdePersonopplysninger: true,
            kiFlagget: true,
        });
        const dialog = await åpneOpprettDialog();

        fireEvent.change(within(dialog).getByLabelText("Mål 1"), {
            target: { value: "Ola skal tilbake i jobb" },
        });
        fireEvent.click(within(dialog).getByRole("button", { name: "Lagre" }));

        expect(
            await within(dialog).findByText(
                "Teksten kan inneholde personopplysninger",
            ),
        ).toBeInTheDocument();
        expect(lagreKall).toHaveLength(0);

        fireEvent.click(
            within(dialog).getByRole("button", { name: "Lagre likevel" }),
        );

        await ventPåLukketDialog();
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { mål: "Ola skal tilbake i jobb", lagretMedKiAdvarsel: true },
        ]);
        expect(
            await screen.findByText("Ola skal tilbake i jobb"),
        ).toBeInTheDocument();
    });

    test("sjekker bare nye og endrede samarbeidsmål og beholder ID og KI-flagg på uendrede", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: true },
            ],
        };
        const sjekk = jest
            .spyOn(personopplysningssjekk, "sjekkPersonopplysninger")
            .mockResolvedValue(ingenFunn);
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        expect(within(dialog).getByLabelText("Mål 1")).toHaveValue(
            "Bedre dialog",
        );
        fireEvent.click(
            within(dialog).getByRole("button", {
                name: "Legg til mål",
                description: "Mål for samarbeidet",
            }),
        );
        const nyttFelt = within(dialog).getByLabelText("Mål 2");
        await waitFor(() => expect(nyttFelt).toHaveFocus());
        fireEvent.change(nyttFelt, { target: { value: "Færre fravær" } });
        fireEvent.click(within(dialog).getByRole("button", { name: "Lagre" }));

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

    test("sletter samarbeidsmål og flytter fokus til legg til-knappen", async () => {
        lagret = {
            sykefraværsmål: [],
            samarbeidsmål: [
                { id: 7, mål: "Bedre dialog", lagretMedKiAdvarsel: false },
                { id: 8, mål: "Færre fravær", lagretMedKiAdvarsel: false },
            ],
        };
        const dialog = await åpneDialog("Rediger", "Rediger mål");

        fireEvent.click(
            within(dialog).getByRole("button", { name: "Slett mål 1" }),
        );

        expect(
            within(dialog).getByRole("button", {
                name: "Legg til mål",
                description: "Mål for samarbeidet",
            }),
        ).toHaveFocus();
        fireEvent.click(within(dialog).getByRole("button", { name: "Lagre" }));

        await ventPåLukketDialog();
        expect(lagreKall[0].samarbeidsmål).toEqual([
            { id: 8, mål: "Færre fravær", lagretMedKiAdvarsel: false },
        ]);
    });

    test("holder dialogen åpen og viser feil når lagringen feiler", async () => {
        lagringFeiler = true;
        const dialog = await åpneOpprettDialog();

        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");
        fireEvent.click(within(dialog).getByRole("button", { name: "Lagre" }));

        expect(
            await within(dialog).findByText("Kunne ikke lagre målene"),
        ).toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("flytter fokus til listen over opprettede mål etter at et sykefraværsmål er lagt til", async () => {
        const dialog = await åpneOpprettDialog();
        await waitFor(() => expect(dialog).toHaveFocus());
        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");

        const overskrift = await within(dialog).findByRole("heading", {
            name: "Opprettede sykefraværsmål",
        });
        await waitFor(() => expect(overskrift).toHaveFocus());
    });

    test("viser slett-knapp for samarbeidsmål først når feltet har tekst", async () => {
        const dialog = await åpneOpprettDialog();

        expect(
            within(dialog).queryByRole("button", { name: "Slett mål 1" }),
        ).not.toBeInTheDocument();

        fireEvent.change(within(dialog).getByLabelText("Mål 1"), {
            target: { value: "Færre fravær" },
        });

        expect(
            within(dialog).getByRole("button", { name: "Slett mål 1" }),
        ).toBeInTheDocument();
    });

    test("opprettelsesdialogen har ingen axe-brudd", async () => {
        const dialog = await åpneOpprettDialog();
        fyllUtMål(dialog, "KORTTIDSFRAVÆR", "6", "4");
        await within(dialog).findByText("Opprettede sykefraværsmål");

        expect(await axe(dialog)).toHaveNoViolations();
    });

    test("redigeringsdialogen lar brukeren legge til, endre og slette sykefraværsmål", async () => {
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

        fyllUtMål(dialog, "LEGEMELDT_FRAVÆR", "3", "2");
        const kort = await within(dialog).findByRole("region", {
            name: "Legemeldt fravær",
        });
        fireEvent.change(within(kort).getByLabelText("Mål (%)"), {
            target: { value: "1,5" },
        });
        const korttid = within(dialog).getByRole("region", {
            name: "Korttidsfravær",
        });
        fireEvent.click(
            within(korttid).getByRole("button", {
                name: "Slett sykefraværsmål",
            }),
        );
        fireEvent.click(within(dialog).getByRole("button", { name: "Lagre" }));

        await ventPåLukketDialog();
        expect(lagreKall[0].sykefraværsmål).toEqual([
            {
                type: "LEGEMELDT_FRAVÆR",
                nåværende: 3,
                mål: 1.5,
                frist: `${nesteÅr}-12-31`,
            },
        ]);
        expect(await screen.findByText("1,5 %")).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "Korttidsfravær" }),
        ).not.toBeInTheDocument();
    });
});
