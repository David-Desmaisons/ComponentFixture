import { delegateEvents } from "@/utils/delegateEvents";

describe("delegateEvents", () => {
  test.each([[["a"]], [["a", "b"]], [["a", "b", "c"]]])(
    "creates object with provided keys: %o",
    keys => {
      const res = delegateEvents(keys);
      const realKeys = Object.keys(res);
      expect(realKeys).toEqual(keys);
    }
  );

  test.each([["a", 0], ["b", { value: true }], ["c", "arguments"]])(
    "create method %s that emit the passed argument %o",
    (method, value) => {
      const res = delegateEvents(["a", "b", "c"]);
      const fake = {
        $emit: jest.fn()
      };
      res[method].call(fake, value);

      expect(fake.$emit).toHaveBeenCalledWith(method, value);
    }
  );
});
