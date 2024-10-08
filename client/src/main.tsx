import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

export const getRootElement = () =>
    document.getElementById("root") as HTMLElement;

const rootHtmlElement = getRootElement();
const reactDomRoot = createRoot(rootHtmlElement);
reactDomRoot.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
