import { createHandler, type DocumentComponentProps, StartServer } from "@solidjs/start/server";

function Document(props: DocumentComponentProps) {
  return (
    <html lang="en" class="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050608" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Bright Builds writing feed"
          href="https://www.brightbuilds.us/feed.xml"
        />
        {props.assets}
      </head>
      <body>
        <div id="app">{props.children}</div>
        {props.scripts}
      </body>
    </html>
  );
}

export default createHandler(() => <StartServer document={Document} />);
