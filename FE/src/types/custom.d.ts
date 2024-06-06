// currently no-usage

// this file used to config svg to make it as react component
// main tutorial: https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs
// solution: https://stackoverflow.com/questions/54121536/typescript-module-svg-has-no-exported-member-reactcomponent

// first solution
/// <reference types="vite-plugin-svgr/client" />
declare module "*.svg?react" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;

  export default ReactComponent;
}

// second solution, using vite-plugin-svgr
