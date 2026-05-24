import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { SiteLayout } from "./components/SiteLayout";
import "./styles/app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <SiteLayout>
            <Suspense>{props.children}</Suspense>
          </SiteLayout>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
