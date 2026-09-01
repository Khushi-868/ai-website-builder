import React, { useMemo, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

import { detectDependencies } from "../utils/sandpackUtils";
import SandpackErrorMonitor from "./SandpackErrorMonitor";

const FullPagePreview = ({ files }) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);

  console.log("PUBLISHED FILES:", files);

  const sandpackFiles = useMemo(() => {
    if (!files) return {};

    const spFiles = {};

    for (const [path, file] of Object.entries(files)) {
      const content =
        typeof file === "string"
          ? file
          : file?.content || file?.code || "";

      // Sandpack paths should start with /
      const filePath = path.startsWith("/") ? path : `/${path}`;

      spFiles[filePath] = {
        code: content,
      };
    }

    console.log("SANDPACK FILES:", spFiles);

    return spFiles;
  }, [files]);

  const dependencies = useMemo(() => {
    if (!files) return {};

    return detectDependencies(files);
  }, [files]);

  console.log("DEPENDENCIES:", dependencies);

  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      <SandpackProvider
        template="react"
        files={sandpackFiles}
        customSetup={{
          dependencies,
        }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          logLevel: 0,
        }}
      >
        <SandpackErrorMonitor
          onErrorChange={setShowErrorOverlay}
        />

        <SandpackLayout
          style={{
            height: "100%",
            width: "100%",
            border: "none",
            background: "transparent",
          }}
        >
          <SandpackPreview
            showNavigator={false}
            showRefreshButton
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={showErrorOverlay}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default FullPagePreview;