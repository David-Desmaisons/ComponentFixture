import { getOffset, listenToError } from "@/utils/browserHelper";

describe("getOffset", () => {
  const root = {
    offsetLeft: 10,
    offsetTop: 20
  };

  const child = {
    offsetLeft: 100,
    offsetTop: 200,
    offsetParent: root
  };

  test.each([[root, { x: 10, y: 20 }], [child, { x: 110, y: 220 }]])(
    "called with %o returns %o",
    (argument, expected) => {
      const res = getOffset(argument);
      expect(res).toEqual(expected);
    }
  );
});
