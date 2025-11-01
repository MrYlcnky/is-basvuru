import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { tr } from "date-fns/locale";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const theme = createTheme({
  // (opsiyonel) her TextField için mavi vurgu yerine inherit:
  components: {
    MuiTextField: { defaultProps: { color: "inherit" } },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={tr}
          localeText={{
            fieldYearPlaceholder: () => "YYYY",
            fieldMonthPlaceholder: () => "AA",
            fieldDayPlaceholder: () => "GG",
          }}
        >
          <BrowserRouter basename="/is-basvuru2">
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);

/*
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>*/
