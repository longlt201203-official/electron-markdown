// Allow importing raw CSS asset URLs via Vite's ?url suffix
// e.g. import fileUrl from "highlight.js/styles/github.css?url";
declare module '*.css?url' {
    const href: string;
    export default href;
}
