import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    staticDirs: ["../public"],
    async viteFinal(config, {
        configType
    }) {
        if (configType === "PRODUCTION") {
            return {
                ...config,
                base: "/lydia-radgiver-frontend/"
            };
        }
        return config;
    },
    docs: {
        autodocs: true
    }
};

export default config;