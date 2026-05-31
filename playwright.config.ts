import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests",
  testMatch: /browser-release\.playwright\.ts/,
  fullyParallel: true,
  reporter: [["list"]],
  webServer: {
    command: "bun run serve:static",
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
    url: baseURL,
  },
  use: {
    baseURL,
    colorScheme: "dark",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
        colorScheme: "dark",
      },
    },
    {
      name: "chromium-reduced-motion",
      use: {
        ...devices["Desktop Chrome"],
        contextOptions: {
          reducedMotion: "reduce",
        },
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
});
