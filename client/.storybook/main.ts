module.exports = {
    stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-vite",
    },
    staticDirs: ["public"],
    async viteFinal(config, { configType }) {
        return {
            ...config,
            base: "./",
        };
    },
};
