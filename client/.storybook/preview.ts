import { initialize, mswDecorator } from "msw-storybook-addon";
import { NavFarger } from "../src/styling/farger";

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
    backgrounds: {
        default: 'canvasBackground',
        values: [
            {
                name: 'canvasBackground',
                value: NavFarger.canvasBackground,
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
};

// Initialize MSW (mock service worker)
initialize({
    serviceWorker: {
        url:
            process.env.NODE_ENV === "production"
                ? "/lydia-radgiver-frontend/mockServiceWorker.js"
                : "./mockServiceWorker.js",
    },
});

// Provide the MSW addon decorator globally
export const decorators = [mswDecorator];
