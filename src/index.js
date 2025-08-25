import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SnackbarProvider } from "notistack";
import reportWebVitals from "./reportWebVitals";
import {Scrollable} from "./widgets/scroll";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Scrollable style={{ maxHeight: '100vh' }}>
        <SnackbarProvider
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <App />
        </SnackbarProvider>
</Scrollable>
);

reportWebVitals();