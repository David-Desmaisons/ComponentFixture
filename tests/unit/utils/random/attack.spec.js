import { Attack } from "@/utils/random/attack";

describe("Attack", () => {
  const option = {
    delay: 100,
    stopOnErrorLog: true,
    maxOperation: 1000,
    mouseEvents: false,
    includeMethod: true
  };
  let attack;

  beforeEach(() => {
    attack = new Attack(option);
  });

  it("constructor copy options", () => {
    const {
      delay,
      stopOnErrorLog,
      maxOperation,
      mouseEvents,
      includeMethod
    } = attack;
    expect({
      delay,
      stopOnErrorLog,
      maxOperation,
      mouseEvents,
      includeMethod
    }).toEqual(option);
  });

  it("constructor default status to 'running'", () => {
    expect(attack.status).toEqual("running");
  });

  it("constructor default isUnderAttack to true", () => {
    expect(attack.isUnderAttack).toEqual(true);
  });

  it("constructor default fps to empty array", () => {
    expect(attack.fps).toEqual([]);
  });

  it("constructor default error to empty array", () => {
    expect(attack.error).toEqual([]);
  });

  it("constructor default attackNumber to 0", () => {
    expect(attack.attackNumber).toEqual(0);
  });

  it("constructor default seed to 0", () => {
    expect(attack.seed).toEqual(0);
  });

  it("constructor default horde to null", () => {
    expect(attack.horde).toEqual(null);
  });

  describe("after setting horde", () => {
    let horde;
    const seed = 324;

    beforeEach(() => {
      horde = {
        randomizer: jest.fn(() => ({
          seed
        })),
        stop: jest.fn()
      };
      attack.setHorde(horde);
    });

    it("calls horde randomizer", () => {
      expect(horde.randomizer).toHaveBeenCalled();
    });

    it("copies seed", () => {
      expect(attack.seed).toEqual(seed);
    });

    it("copies horde", () => {
      expect(attack.horde).toBe(horde);
    });

    test.each([1, 2, 3])(
      "onAttack when called %o increases attackNumber",
      count => {
        for (let i = 0; i < count; i++) {
          attack.onAttack();
        }
        expect(attack.attackNumber).toBe(count);
      }
    );

    describe("getWatchers", () => {
      let watchers;

      beforeEach(() => {
        watchers = attack.getWatchers();
      });

      it("returns an object with a fpsWatcher function", () => {
        expect(typeof watchers.fpsWatcher).toEqual("function");
      });

      it("returns an object with a onGremlin function", () => {
        expect(typeof watchers.onGremlin).toEqual("function");
      });
    });

    it("when calling fpsWatcher adds fps to the collection", () => {
      attack.fpsWatcher(30);
      attack.fpsWatcher(60);

      expect(attack.fps).toEqual([30, 60]);
    });

    describe("when calling stop", () => {
      it("set status to stopped", () => {
        attack.stop();
        expect(attack.status).toBe("stopped");
      });

      it("set horde to null", () => {
        attack.stop();
        expect(attack.horde).toBe(null);
      });

      it("does not throw when called twice", () => {
        attack.stop();
        expect(() => attack.stop()).not.toThrow();
      });
    });

    describe("when calling onEnded", () => {
      it("set status to completed if status null", () => {
        attack.onEnded();
        expect(attack.status).toBe("completed");
      });

      test.each(["cancelled", "other"])(
        "keep status when sets to %s",
        status => {
          attack.status = status;
          attack.onEnded();
          expect(attack.status).toBe(status);
        }
      );

      it("set isUnderAttack to false", () => {
        attack.onEnded();
        expect(attack.isUnderAttack).toBe(false);
      });
    });

    describe("when calling onError", () => {
      test.each([
        { type: "" },
        { type: "exception" },
        { type: "console.error" }
      ])("with %o add error to list", error => {
        attack.onError(error);
        expect(attack.error).toEqual([error]);
      });

      it("calls stop on horde on exception", () => {
        attack.onError({ type: "exception" });
        expect(horde.stop).toHaveBeenCalled();
      });

      test.each([{ type: "other" }, { type: "console.error" }])(
        "with %o and stopOnErrorLog true calls stop on horde",
        error => {
          attack.stopOnErrorLog = true;
          attack.onError(error);
          expect(horde.stop).toHaveBeenCalled();
        }
      );

      test.each([{ type: "other" }, { type: "console.error" }])(
        "with %o and stopOnErrorLog false does not call stop on horde",
        error => {
          attack.stopOnErrorLog = false;
          attack.onError(error);
          expect(horde.stop).not.toHaveBeenCalled();
        }
      );

      const dataToStopHorde = [
        [{ type: "other" }, true],
        [{ type: "console.error" }, true],
        [{ type: "exception" }, true],
        [{ type: "exception" }, false]
      ];

      test.each(dataToStopHorde)(
        "with %o and stopOnErrorLog true calls set status as stopped",
        (error, stopOnErrorLog) => {
          attack.stopOnErrorLog = stopOnErrorLog;
          attack.onError(error);
          expect(attack.status).toBe("stopped");
        }
      );

      test.each(dataToStopHorde)(
        "with %o and stopOnErrorLog true calls set horde to null",
        (error, stopOnErrorLog) => {
          attack.stopOnErrorLog = stopOnErrorLog;
          attack.onError(error);
          expect(attack.horde).toBe(null);
        }
      );
    });
  });
});
