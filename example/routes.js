const requireContext = require.context("./examples/", false, /\.vue$/);

const componentRoutes = requireContext.keys().map(key => {
  const component = requireContext(key).default;
  const { meta } = component;
  const path = key.replace(/\.vue$/, "").replace(/^\./, "");
  return {
    path,
    component,
    meta
  }
});

const [{ path: redirect }, ...dummy] = componentRoutes;

const routes = [
  { path: "/", redirect },
  ...componentRoutes
];

export default routes;