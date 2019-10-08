import { shallowMount } from "@vue/test-utils";
import ComponentFixture from "@/components/ComponentFixture.vue";
import FakeComponent from "../../mock/FakeComponent.vue";
import FakeComponentMethods from "../../mock/FakeComponentMethods.vue";
import FakeComponentForVModel from "../../mock/FakeComponentForVModel";
import FakeComponentForCustomVModel from "../../mock/FakeComponentForCustomVModel";
import FakeEditor from "../../mock/FakeEditor.vue";
import { advanceTo } from "jest-date-mock";

const { console } = window;
const { error: originalError, warn: originalWarn } = console;
const nullFunction = () => {};

const mountComponentWithDefaultSlot = (arg = {}) => {
  const { slot = FakeComponent } = arg;
  return shallowMount(ComponentFixture, {
    slots: {
      default: slot
    },
    stubs: {
      component: true,
      component1: true,
      component2: true
    }
  });
};

const mountComponentWithDefaultSlotAndControllerSlot = control =>
  shallowMount(ComponentFixture, {
    slots: {
      default: FakeComponent
    },
    scopedSlots: {
      control
    }
  });

const buildFakeEditor = () => {
  return jest.fn(function(props) {
    return this.$createElement(FakeEditor, { props });
  });
};

describe("ComponentFixture.vue", () => {
  beforeEach(() => {
    console.error = nullFunction;
    console.warn = nullFunction;
    advanceTo(0);
  });

  afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  const defaultSlotNotUnique = [
    [[]],
    [["<div/>", "<div/>"]],
    [["<div/>", "<component1/>", "<component2/>"]]
  ];

  test.each(defaultSlotNotUnique)(
    "throws when there is not exactly than one default slots are passed: %p",
    args => {
      const render = () => mountComponentWithDefaultSlot({ slot: args });
      expect(render).toThrow(
        "ComponentFixture should have one unique default slot"
      );
    }
  );

  it("does not throw when one default slot is passed", () => {
    const render = () =>
      mountComponentWithDefaultSlot({ slot: "<component/>" });
    expect(render).not.toThrow();
  });

  describe("when correctly initialized", () => {
    let wrapper = null;
    let vm = null;
    let dynamicAttributes = null;

    beforeEach(() => {
      wrapper = mountComponentWithDefaultSlot();
      vm = wrapper.vm;
      dynamicAttributes = wrapper.vm.dynamicAttributes;
    });

    it("sets the component name", () => {
      expect(vm.componentName).toEqual("fake-component");
    });

    it("computes the dynamicAttributes number with all props", () => {
      expect(Object.keys(dynamicAttributes).length).toEqual(4);
    });

    it("computes the dynamicAttributes number with default value", () => {
      expect(dynamicAttributes.number).toEqual(25);
    });

    it("computes the dynamicAttributes with default value computed when required", () => {
      expect(dynamicAttributes.string).toEqual("");
    });

    it("computes the dynamicAttributes with default value undefined when required", () => {
      expect(dynamicAttributes.hasOwnProperty("undefinedString")).toBe(true);
      expect(dynamicAttributes.undefinedString).toBe(undefined);
    });

    it("computes the dynamicAttributes with default value computed from factory", () => {
      expect(dynamicAttributes.objectWithFactory).toEqual({
        createdByFactory: true
      });
    });

    it("has an empty events property events", () => {
      expect(vm.events).toEqual([]);
    });

    const propDefinition = [
      [
        "number",
        {
          type: Number,
          default: 25
        }
      ],
      [
        "string",
        {
          type: String,
          required: true
        }
      ],
      [
        "undefinedString",
        {
          type: String,
          required: false
        }
      ]
    ];

    test.each(propDefinition)(
      "propsDefinition contains props definition: key: %p value: %p",
      (key, expected) => {
        const { propsDefinition } = vm;
        expect(propsDefinition[key].definition).toEqual(expected);
      }
    );

    test.each(propDefinition)(
      "propsDefinition contains props isModel: key: %p value: false",
      key => {
        const { propsDefinition } = vm;
        expect(propsDefinition[key].isModel).toEqual(false);
      }
    );

    it("propsDefinition contains props types", () => {
      const expectedTypes = {
        number: ["Number"],
        string: ["String"],
        undefinedString: ["String"],
        objectWithFactory: ["Object"]
      };

      const { propsDefinition } = vm;
      Object.keys(propsDefinition).forEach(key => {
        expect(propsDefinition[key].types).toEqual(expectedTypes[key]);
      });
    });

    it("tracks events on component under fixtures", () => {
      const testComponentVm = vm.$children[0];
      testComponentVm.$emit("event1", 0);
      testComponentVm.$emit("event2", "a", "b", true);
      expect(vm.events).toEqual([
        {
          name: "event1",
          instant: new Date(),
          args: [0]
        },
        {
          name: "event2",
          instant: new Date(),
          args: ["a", "b", true]
        }
      ]);
    });

    it("does not tracks hook events on component under fixtures", () => {
      const testComponentVm = vm.$children[0];
      testComponentVm.$emit("hook:beforeUpdate", 0);
      testComponentVm.$emit("hook:updated", "a", "b", true);
      expect(vm.events).toEqual([]);
    });

    it("renders component from slot", () => {
      expect(wrapper.contains(FakeComponent)).toBe(true);
    });

    describe("when calling update", () => {
      let testedComponent;

      beforeEach(() => {
        testedComponent = vm.$refs.cut;
        testedComponent.$forceUpdate = jest.fn();
        vm.update();
      });

      it("calls force update", () => {
        expect(testedComponent.$forceUpdate).toHaveBeenCalled();
      });
    });
  });

  describe.each([
    ["mounted with default", mountComponentWithDefaultSlot],
    [
      "mounted with control slot",
      () => mountComponentWithDefaultSlotAndControllerSlot(buildFakeEditor())
    ]
  ])("when %s and re-rendered after update", (_, factory) => {
    let wrapper;
    let options;
    let currentProps;
    beforeEach(async () => {
      wrapper = factory();
      const { vm } = wrapper;

      await vm.$nextTick();

      const { node } = vm.getComponentInformation();
      options = node.componentOptions.Ctor.options;

      currentProps = options.props;
      const newProps = {
        ...currentProps,
        newProp: {
          type: String,
          default: "abc"
        }
      };
      options.props = newProps;

      vm.$forceUpdate();
      await vm.$nextTick();
    });

    afterEach(() => {
      options.props = currentProps;
    });

    it("updates the dynamicAttributes", async () => {
      const { vm } = wrapper;
      await vm.$nextTick();
      const { dynamicAttributes } = vm;
      expect(dynamicAttributes.newProp).toEqual("abc");
    });
  });

  describe("when initialized with a component supporting standard v-model API", () => {
    let wrapper = null;
    let vm = null;
    let dynamicAttributes = null;
    let propsDefinition = null;

    beforeEach(() => {
      wrapper = mountComponentWithDefaultSlot({ slot: FakeComponentForVModel });
      vm = wrapper.vm;
      dynamicAttributes = vm.dynamicAttributes;
      propsDefinition = vm.propsDefinition;
    });

    it("computes the dynamicAttributes with default value computed when required", () => {
      expect(dynamicAttributes.value).toEqual([]);
    });

    it("set propsDefinition isModel to true", () => {
      expect(propsDefinition.value.isModel).toEqual(true);
    });

    it("listens to event tracked by v-model and update prop", () => {
      const testVm = vm.$children[0];
      testVm.$emit("input", [1, 2, 3]);
      expect(dynamicAttributes.value).toEqual([1, 2, 3]);
    });

    it("listens to two-way binding events to update properties", () => {
      const testVm = vm.$children[0];
      testVm.$emit("update:int", 25);
      expect(dynamicAttributes.int).toEqual(25);
    });
  });

  describe("when initialized with a component supporting custom v-model API", () => {
    let wrapper = null;
    let vm = null;
    let dynamicAttributes = null;
    let propsDefinition = null;

    beforeEach(() => {
      wrapper = mountComponentWithDefaultSlot({
        slot: FakeComponentForCustomVModel
      });
      vm = wrapper.vm;
      dynamicAttributes = vm.dynamicAttributes;
      propsDefinition = vm.propsDefinition;
    });

    it("computes the dynamicAttributes with default value", () => {
      expect(dynamicAttributes.customValue).toEqual("string");
    });

    it("set propsDefinition isModel to true", () => {
      expect(propsDefinition.customValue.isModel).toEqual(true);
    });

    it("listens to event tracked by v-model ans update prop", () => {
      const testComponentVm = vm.$children[0];
      testComponentVm.$emit("customInput", "new value");
      expect(dynamicAttributes.customValue).toEqual("new value");
    });
  });

  describe("when initialized with methods", () => {
    let wrapper = null;
    let vm = null;
    let componentMethods = null;

    beforeEach(() => {
      wrapper = mountComponentWithDefaultSlot({ slot: FakeComponentMethods });
      vm = wrapper.vm;
      componentMethods = vm.componentMethods;
    });

    it("computes the methods with correct name", () => {
      expect(
        componentMethods.map(({ argumentNumber, name }) => ({
          argumentNumber,
          name
        }))
      ).toEqual([
        { argumentNumber: 0, name: "method1" },
        { argumentNumber: 0, name: "method2" }
      ]);
    });

    test.each([["method1"], ["method2"]])(
      "computes the method %s with correct binding",
      name => {
        const { execute } = componentMethods.find(m => m.name === name);
        const method = FakeComponentMethods.methods[name];
        expect(method).not.toHaveBeenCalled();
        execute();
        expect(method).toHaveBeenCalled();
      }
    );
  });

  const lastParameters = fake => {
    const {
      mock: { calls }
    } = fake;
    const length = calls.length;
    return calls[length - 1][0];
  };

  describe("when initialized with a controller slot", () => {
    let wrapper = null;
    let control = null;

    beforeEach(() => {
      control = buildFakeEditor();
      wrapper = mountComponentWithDefaultSlotAndControllerSlot(control);
    });

    it("renders component from default slot", () => {
      expect(wrapper.contains(FakeComponent)).toBe(true);
    });

    it("calls the control scoped slot", () => {
      expect(control).toHaveBeenCalled();
    });

    it("call the control scoped slot with attributes", () => {
      const expectedAttributes = {
        number: 25,
        string: "",
        undefinedString: undefined,
        objectWithFactory: {
          createdByFactory: true
        }
      };

      expect(lastParameters(control).attributes).toEqual(expectedAttributes);
    });

    it("call the control scoped slot with componentName", () => {
      expect(lastParameters(control).componentName).toEqual("fake-component");
    });

    it("calls the control scoped slot initially with data", () => {
      expect(lastParameters(control).data).toEqual({ a: 90 });
    });

    it("renders the control slot", () => {
      expect(wrapper.contains(FakeEditor)).toBe(true);
    });
  });
});
