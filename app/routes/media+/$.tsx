import fs from "node:fs";

import { LoaderFunctionArgs } from "@remix-run/node";
import contentDisposition from "content-disposition";

import { download } from "~/utils/image-download.server.ts";
import { teamBadgeBaseUrl } from "~/utils/misc.tsx";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const [, ...mediaFileName] = pathname.split("/").filter(Boolean);
  const remoteFileName = mediaFileName.join("/");
  const localFileName = remoteFileName.replaceAll("/", "_");
  const localFilePath = `/tmp/${localFileName}`;
  let mediaFile = null;

  if (fs.existsSync(localFilePath)) {
    mediaFile = fs.readFileSync(localFilePath);
  } else {
    const remoteUrl = `${teamBadgeBaseUrl}/${remoteFileName}`;

    try {
      await download(remoteUrl, localFilePath);
      mediaFile = fs.readFileSync(localFilePath);
    } catch (error) {
      console.log(remoteUrl);
    }
  }

  return mediaFile
    ? new Response(mediaFile, {
        status: 200,
        headers: {
          "Content-Disposition": contentDisposition(localFileName),
        },
      })
    : null;
};
