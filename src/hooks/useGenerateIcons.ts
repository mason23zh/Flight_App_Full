// import * as Comlink from "comlink";
// import ComlinkWorker from "vite-plugin-comlink";
//
// const generateIconWorker = new ComlinkWorker<typeof import("./workers/generateIcon.worker")>(
//     new URL("./workers/generateIconWorker.ts", import.meta.url),
// {
//     name: "generateIconComlink",
//     type: "module",
// }
// );
//
// export const generateFirIcon = async (icao: string, isFss: boolean) => {
//     const generateFirIcon = Comlink.wrap(generateIconWorker).generateFirIcon;
//     return await generateFirIcon(icao, isFss);
// };
