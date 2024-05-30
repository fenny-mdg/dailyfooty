import { createWriteStream } from "node:fs";

import { stream } from "undici";

export const download = (url: string, localTarget: string) =>
  stream(
    url,
    {
      opaque: { target: localTarget },
      method: "GET",
    },
    ({ statusCode, opaque }) => {
      if (statusCode !== 200) {
        throw new Error(`failed to download, ${statusCode}`);
      }

      // @ts-expect-error opaque is unknown
      return createWriteStream(opaque.target);
    },
  );
