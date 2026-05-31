import { existsSync, statSync } from "node:fs";
import { extname, isAbsolute, join, relative, resolve } from "node:path";

const staticOutputRoot = resolve(".output/public");
const defaultHost = "127.0.0.1";
const defaultPort = 4173;

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
]);

if (!existsSync(staticOutputRoot)) {
  throw new Error(`Missing ${staticOutputRoot}. Run bun run build before serving static output.`);
}

const server = Bun.serve({
  hostname: process.env.HOST ?? defaultHost,
  port: maybePort(process.env.PORT) ?? defaultPort,
  fetch(request) {
    const maybeFilePath = maybeStaticFilePath(request.url);

    if (!maybeFilePath) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(Bun.file(maybeFilePath), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": contentTypeForPath(maybeFilePath),
      },
    });
  },
});

console.log(`Serving ${staticOutputRoot} at ${server.url}`);

function maybePort(maybeValue: string | undefined): number | null {
  if (!maybeValue) {
    return null;
  }

  const port = Number(maybeValue);

  if (Number.isInteger(port) && port > 0 && port < 65536) {
    return port;
  }

  throw new Error(`Invalid PORT value: ${maybeValue}`);
}

function maybeStaticFilePath(requestUrl: string): string | null {
  const url = new URL(requestUrl);
  const maybePathname = maybeDecodedPathname(url.pathname);

  if (!maybePathname) {
    return null;
  }

  for (const candidate of candidatePathsForPathname(maybePathname)) {
    const absolutePath = resolve(staticOutputRoot, candidate);

    if (!isInsideStaticRoot(absolutePath) || !existsSync(absolutePath)) {
      continue;
    }

    const stats = statSync(absolutePath);

    if (stats.isFile()) {
      return absolutePath;
    }
  }

  return null;
}

function maybeDecodedPathname(pathname: string): string | null {
  try {
    const decoded = decodeURIComponent(pathname);

    if (decoded.includes("\0")) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

function candidatePathsForPathname(pathname: string): readonly string[] {
  const normalizedPath = pathname.replace(/^\/+/, "");

  if (!normalizedPath) {
    return ["index.html"];
  }

  if (extname(normalizedPath)) {
    return [normalizedPath];
  }

  return [join(normalizedPath, "index.html"), `${normalizedPath}.html`];
}

function isInsideStaticRoot(absolutePath: string): boolean {
  const relativePath = relative(staticOutputRoot, absolutePath);

  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function contentTypeForPath(path: string): string {
  return contentTypes.get(extname(path)) ?? "application/octet-stream";
}
