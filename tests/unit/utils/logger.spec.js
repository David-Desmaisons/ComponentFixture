import { log, warn, info, error } from "@/utils/logger";

const suffix = "ComponentFixture:";

describe.each([["log", log], ["warn", warn], ["info", info], ["error", error]])(
  "%s",
  (name, logFunction) => {
    let native;
    let mockedLog;
    beforeEach(() => {
      native = window.console[name];
      mockedLog = jest.fn();
      window.console[name] = mockedLog;
    });

    afterEach(() => {
      window.console[name] = native;
    });

    test.each([
      [["message"], [suffix, "message"]],
      [["message", {}], [suffix, "message", {}]],
      [[{}], [suffix, {}]]
    ])(`called with %j calls console.${name} with %j"`, (arg, expected) => {
      logFunction.apply(null, arg);
      expect(mockedLog).toHaveBeenCalledWith(...expected);
    });
  }
);
