import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootHtmlElement = document.getElementById("root")!
const reactDomRoot = createRoot(rootHtmlElement)
reactDomRoot.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);
