import React from "react";
import { createRoot } from "react-dom/client";
import { UnheadProvider, createHead } from "@unhead/react/client";
import "./index.css";
import App from "./App";

export const getRootElement = () =>
    document.getElementById("root") as HTMLElement;

const rootHtmlElement = getRootElement();
const reactDomRoot = createRoot(rootHtmlElement);
const head = createHead();

reactDomRoot.render(
    <React.StrictMode>
        <UnheadProvider head={head}>
            <App />
        </UnheadProvider>
    </React.StrictMode>,
);
