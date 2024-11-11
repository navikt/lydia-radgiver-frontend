import useSWR, { SWRConfiguration } from "swr";
import { dispatchFeilmelding } from "../../components/Banner/FeilmeldingBanner";
import { ZodError, ZodType } from "zod";

export const defaultSwrConfiguration: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

const csrfFetcher = async () =>
    fetch("/csrf-token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((csrfJson) => csrfJson.csrfToken);

const defaultFetcher = (...args: [url: string, options?: RequestInit]) =>
    fetch(...args).then(async (res) => {
        if (!res.ok) {
            throw await res
                .text()
                .then((innhold) => {
                    try {
                        return JSON.parse(innhold);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (e) {
                        return {
                            message: innhold,
                        };
                    }
                })
                .catch(() => {
                    return {
                        message:
                            "Noe har gått galt. Prøv å laste inn siden på nytt.",
                    };
                });
        }
        return res.status == 204 ? undefined : res.json();
    });

const fetchNative =
    (method: "POST" | "DELETE" | "PUT") =>
    <T>(url: string, schema: ZodType<T>, body?: unknown): Promise<T> =>
        csrfFetcher()
            .then((csrfToken) =>
                fetch(url, {
                    method,
                    body: body ? JSON.stringify(body) : undefined,
                    headers: {
                        "Content-Type": "application/json",
                        "x-csrf-token": csrfToken,
                    },
                }),
            )
            .then((res) => {
                if (res.ok) {
                    return res;
                }

                if (res.status === 404) {
                    return Promise.reject(
                        Promise.resolve(
                            `Noe gikk galt. Fant ikke ressursen: ${url}`,
                        ),
                    );
                }

                return Promise.reject(res.text());
            })
            .then((res) => res.json())
            .catch((e: Promise<string | ZodError>) => {
                e.then((reason) => {
                    if (reason instanceof ZodError) {
                        console.error(reason);
                        return;
                    }
                    dispatchFeilmelding({
                        feilmelding: reason,
                    });
                });
            })
            .then((data) => {
                const safeparsed = schema.safeParse(data);
                return safeparsed.success
                    ? safeparsed.data
                    : Promise.reject(safeparsed.error);
            });

export const post = <T>(
    url: string,
    schema: ZodType<T>,
    body?: unknown,
): Promise<T> => fetchNative("POST")(url, schema, body);
export const put = <T>(
    url: string,
    schema: ZodType<T>,
    body?: unknown,
): Promise<T> => fetchNative("PUT")(url, schema, body);
export const httpDelete = <T>(url: string, schema: ZodType<T>): Promise<T> =>
    fetchNative("DELETE")(url, schema);

export const useSwrTemplate = <T>(
    path: string | (() => string | null) | null,
    schema: ZodType<T>,
    config: SWRConfiguration = defaultSwrConfiguration,
    visFeilmelding: boolean = true,
) => {
    const {
        data,
        error: fetchError,
        mutate,
        isLoading,
        isValidating,
    } = useSWR<T>(path, defaultFetcher, {
        ...defaultSwrConfiguration,
        ...config,
        onErrorRetry: () => {
            /* Do nothing */
        },
    });

    if (!data && !fetchError) {
        return {
            data,
            mutate,
            error: undefined,
            loading: isLoading,
            validating: isValidating,
        };
    }
    if (fetchError) {
        if (visFeilmelding) {
            dispatchFeilmelding({ feilmelding: fetchError.message });
        }
        return {
            data,
            mutate,
            error: fetchError,
            loading: isLoading,
            validating: isValidating,
        };
    }
    const safeParseResultat = schema.safeParse(data);

    if (!safeParseResultat.success) {
        console.error(
            "Feil i parsing av data fra server",
            safeParseResultat.error,
        );
        return {
            data,
            mutate,
            error: safeParseResultat.error,
            loading: isLoading,
            validating: isValidating,
        };
    }
    return {
        data: safeParseResultat.data,
        mutate,
        error: undefined,
        loading: isLoading,
        validating: isValidating,
    };
};
