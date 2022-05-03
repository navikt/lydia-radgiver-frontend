module.exports = {
    stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-queryparams",
    ],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-vite",
    },
    staticDirs: ["../public"],
    async viteFinal(config, { configType }) {
        if (configType === "PRODUCTION") {
            return {
                ...config,
                base: "/fia/",
            };
        }
        return config;
    },
};
