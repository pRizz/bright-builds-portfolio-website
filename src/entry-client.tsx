import { mount, StartClient } from "@solidjs/start/client";

function startClient() {
  const maybeRoot = document.getElementById("app");

  if (!maybeRoot) {
    throw new Error("SolidStart root element #app was not found.");
  }

  return mount(() => <StartClient />, maybeRoot);
}

export default startClient();
