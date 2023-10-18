import { Preview } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { NavFarger } from "../src/styling/farger";
import { mswHandlers } from "./mswHandlers";

const preview: Preview = {
    parameters: {
        actions: {argTypesRegex: "^on[A-Z].*"},
        backgrounds: {
            default: 'canvasBackground',
            values: [
                {
                    name: 'canvasBackground',
                    value: NavFarger.backgroundSubtle,
                },
                {
                    name: 'white',
                    value: NavFarger.white,
                },
                {
                    name: 'limegreen-500',
                    value: '#A2AD00',
                },
                {
                    name: 'limegreen-50',
                    value: '#FDFFE6',
                },
                {
                    name: 'light',
                    value: '#F8F8F8',
                },
                {
                    name: 'dark',
                    value: '#333333',
                },
            ]
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        msw: { // Handlers to be applied in every story, see https://github.com/mswjs/msw-storybook-addon/tree/d64eb49bf6bb190d25d7c86a2751386068dbda54#advanced-usage
            handlers: mswHandlers,
        },
    }
};

// Initialize MSW (mock service worker)
initialize({
    serviceWorker: {
        url:
            process.env.NODE_ENV === "production"
                ? "/lydia-radgiver-frontend/mockServiceWorker.js"
                : "./mockServiceWorker.js",
    },

    // Guide frå https://github.com/mswjs/msw/discussions/1231#discussioncomment-4803373
    onUnhandledRequest: (req, print) => {
        // specify routes to exclude
        const excludedRoutes = ['/node_modules', '/src', '/.storybook'];
        const excludedExternalRoutes = ['cdn.nav.no', 'amplitude.nav.no']

        // check if the req.url.pathname contains excludedRoutes
        const isExcluded = excludedRoutes.some(route => req.url.pathname.includes(route));
        const isExcludedDomain = excludedExternalRoutes.some(hostname => req.url.hostname.includes(hostname))

        if (isExcluded || isExcludedDomain) {
            return;
        }

        print.warning()
    }
});

// Provide the MSW addon decorator globally
export const decorators = [mswDecorator];

export default preview;
