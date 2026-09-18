const React = require("react");

const MockChart = React.forwardRef(({ children }, ref) =>
    React.createElement("div", { ref }, children),
);

// The real component also returns null. Browser tests cover the module behavior.
const MockAccessibility = () => null;

module.exports = {
    Accessibility: MockAccessibility,
    Chart: MockChart,
};
