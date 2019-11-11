import { Attack } from "@/utils/random/attack";

describe("Attack", () => {
  const option = {
    delay: 100,
    stopOnErrorLog: true,
    maxOperation: 1000,
    mouseEvents: false
  };
  let attack;

  beforeEach(() => {
    attack = new Attack(option);
  });

  it("constructor copy options", () => {
    const { delay, stopOnErrorLog, maxOperation, mouseEvents } = attack;
    expect({ delay, stopOnErrorLog, maxOperation, mouseEvents }).toEqual(
      option
    );
  });

  it("constructor default properties", () => {
    const expected = {
      status: "running",
      isUnderAttack: true,
      fps: [],
      error: [],
      attackNumber: 0,
      horde: null,
      seed: 0
    };
    const {
      status,
      isUnderAttack,
      fps,
      error,
      attackNumber,
      horde,
      seed
    } = attack;
    expect({
      status,
      isUnderAttack,
      fps,
      error,
      attackNumber,
      horde,
      seed
    }).toEqual(expected);
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
  });
});
