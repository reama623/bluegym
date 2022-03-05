import { createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import "../styles/globals.css";
import Layout from "./components/layout";

axios.defaults.baseURL = "http://localhost:3000/api";

function MyApp({ Component, pageProps }) {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
