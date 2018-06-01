function persistentRouteParamsPluginFactory() {
  function persistentRouteParamsPlugin(router) {
    const { buildPath, buildState, makeState } = router;
    let persistentRouteParams = {};

    router.buildPath = function(route, params) {
      const routeParams = {
        ...persistentRouteParams,
        ...params
      };
      return buildPath.call(router, route, routeParams);
    };

    router.buildState = function(route, params) {
      const routeParams = {
        ...persistentRouteParams,
        ...params
      };
      return buildState.call(router, route, routeParams);
    };

    router.makeState = function(name, params, path, meta, forceId) {
      if (meta && meta.params) {
        params = Object.values(meta.params)
          .map(Object.keys)
          .reduce((a, b) => a.concat(b))
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: params[key]
            }),
            {}
          );
      }

      return makeState.call(router, name, params, path, meta, forceId);
    };

    return {
      onTransitionSuccess(toState) {
        persistentRouteParams = toState.params;
      }
    };
  }

  persistentRouteParamsPlugin.pluginName = "PERSISTENT_ROUTE_PARAMS_PLUGIN";

  return persistentRouteParamsPlugin;
}

export default persistentRouteParamsPluginFactory;
