import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";
import {worker} from "./mocks/browser";

if (process.env.NODE_ENV === "development") {
    await worker.start()
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootHtmlElement = document.getElementById("root")!
const reactDomRoot = createRoot(rootHtmlElement)
reactDomRoot.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);
