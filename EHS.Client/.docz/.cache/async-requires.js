// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---src-docs-bugs-mdx": () => import("../../src/docs/bugs.mdx" /* webpackChunkName: "component---src-docs-bugs-mdx" */),
  "component---src-docs-faq-mdx": () => import("../../src/docs/faq.mdx" /* webpackChunkName: "component---src-docs-faq-mdx" */),
  "component---readme-md": () => import("../../README.md" /* webpackChunkName: "component---readme-md" */),
  "component---src-docs-modules-mdx": () => import("../../src/docs/modules.mdx" /* webpackChunkName: "component---src-docs-modules-mdx" */),
  "component---src-docs-index-mdx": () => import("../../src/docs/index.mdx" /* webpackChunkName: "component---src-docs-index-mdx" */),
  "component---src-pages-404-js": () => import("../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

