const requireContext = require.context("./examples/", false, /\.vue$/);

const componentRoutes = requireContext.keys().map(key => {
  const component = requireContext(key).default;
  const { meta } = component;
  return {
    path: `/${key}`,
    component,
    meta
  }
});

const [{ path: redirect }, ...dummy] = componentRoutes;

const routes = [
  { path: "/", redirect },
  ...componentRoutes
]

window.console.log(routes)

export default routes;