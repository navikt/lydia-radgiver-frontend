module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-mdx-gfm"],
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