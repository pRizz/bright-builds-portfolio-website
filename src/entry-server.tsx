import { createHandler, type DocumentComponentProps, StartServer } from "@solidjs/start/server";
import { writingFeedMetadata } from "./domain/feed";

const writingFeed = writingFeedMetadata();

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
          title={writingFeed.title}
          href={writingFeed.feedUrl}
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
