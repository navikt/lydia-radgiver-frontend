import { initialize, mswDecorator } from "msw-storybook-addon";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
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
        url: "./mockServiceWorker.js"
    },
});

// Provide the MSW addon decorator globally
export const decorators = [mswDecorator];
