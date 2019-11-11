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

describe("listenToError", () => {
  let originalErrorLog;
  let originalOnError;
  let listener;
  let result;

  beforeEach(() => {
    originalErrorLog = window.console.error;
    originalOnError = window.onerror;
    window.console.error = jest.fn();
    window.onerror = jest.fn();

    listener = jest.fn();
    result = listenToError(listener);
  });

  afterEach(() => {
    window.console.error = originalErrorLog;
    window.onerror = originalOnError;
  });

  it("call listener when calling window log error", () => {
    window.console.error("error here");
    expect(listener).toHaveBeenCalledWith({
      message: ["error here"],
      type: "console.error"
    });
  });

  it("call listener when calling window onerror", () => {
    const error = new Error();
    window.onerror(error);
    expect(listener).toHaveBeenCalledWith({
      lineNumber: undefined,
      message: error,
      type: "exception",
      url: undefined
    });
  });

  it("does call listener when calling window log error after calling result function", () => {
    result();
    window.console.error("error here");
    expect(listener).not.toHaveBeenCalled();
  });

  it("does call listener when calling window log error after calling result function", () => {
    result();
    window.onerror(new Error());
    expect(listener).not.toHaveBeenCalled();
  });
});
