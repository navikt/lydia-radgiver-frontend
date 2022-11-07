import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getRootElement = () => document.getElementById("root")!

const rootHtmlElement = getRootElement()
const reactDomRoot = createRoot(rootHtmlElement)
reactDomRoot.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);

