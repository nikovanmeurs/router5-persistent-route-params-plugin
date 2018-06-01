import { createRouter } from "router5";
import persistentRouteParamsPlugin from "./index";

const createTestRouter = () => {
  const router = createRouter([
    { name: "route1", path: "/route1/:id" },
    { name: "route2", path: "/route1/:id/details/:tab" }
  ]);
  router.usePlugin(persistentRouteParamsPlugin()).start();

  return router;
};

const promisify = func =>
  new Promise((resolve, reject) => {
    const callback = (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    };

    func(callback);
  });

describe("Persistent route params plugin", () => {
  let router;

  beforeEach(() => (router = createTestRouter()));

  test("should persist parameters when routing", async () => {
    const state1 = await promisify(callback =>
      router.navigate("route1", { id: 1 }, {}, callback)
    );
    const state2 = await promisify(callback =>
      router.navigate("route2", { tab: "contact" }, {}, callback)
    );

    expect(state2.params.id).toBe(1);
  });

  test("should override persisted parameters when explicitly passed along", async () => {
    const state1 = await promisify(callback =>
      router.navigate("route1", { id: 1 }, {}, callback)
    );
    const state2 = await promisify(callback =>
      router.navigate("route2", { id: 2, tab: "contact" }, {}, callback)
    );

    expect(state2.params.id).toBe(2);
  });

  test("should not add parameters to state which are not part of the url", async () => {
    const state1 = await promisify(callback =>
      router.navigate("route2", { id: 2, tab: "contact" }, {}, callback)
    );
    const state2 = await promisify(callback =>
      router.navigate("route1", {}, {}, callback)
    );

    expect(typeof state2.params.tab).toBe("undefined");
  });
});
