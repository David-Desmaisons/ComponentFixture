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

const mountComponentWithDefaultSlot = ({
  slot = FakeComponent,
  propsData = {}
} = {}) => {
  return shallowMount(ComponentFixture, {
    slots: {
      default: slot
    },
    propsData,
    stubs: {
      component: true,
      component1: true,
      component2: true
    }
  });
};

const mountComponentWithStore = ({
  slot = FakeComponent,
  propsData = {},
  store = null
} = {}) => {
  return shallowMount(ComponentFixture, {
    propsData,
    slots: {
      default: slot
    },
    mocks: {
      $store: store
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
      dynamicAttributes = vm.dynamicAttributes;
    });

    it("sets the component name", () => {
      expect(vm.componentName).toEqual("fake-component");
    });

    it("sets useStore to false", () => {
      expect(vm.useStore).toEqual(false);
    });

    it("sets shouldUseStore to false", () => {
      expect(vm.useStore).toEqual(false);
    });

    it("sets componentKey to 1", () => {
      expect(vm.componentKey).toEqual(1);
    });

    it("use key 1 for component under test", () => {
      const {
        vm: { $vnode: node }
      } = wrapper.find({ ref: "cut" });
      expect(node.key).toEqual(1);
    });

    it("computes the dynamicAttributes number with all props", () => {
      expect(Object.keys(dynamicAttributes).length).toEqual(5);
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
        createdByFactory: true,
        madeBy: "fake-component"
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
        objectWithFactory: ["Object"],
        oddNumber: ["Number"]
      };

      const { propsDefinition } = vm;
      const actualTypes = Object.keys(propsDefinition).reduce((acc, key) => {
        acc[key] = propsDefinition[key].types;
        return acc;
      }, {});
      expect(actualTypes).toEqual(expectedTypes);
    });

    it("tracks events on component under fixture", () => {
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

    it("tracks events on component under fixture after update", async () => {
      vm.update();
      await vm.$nextTick();
      const testComponentVm = vm.$children[0];
      testComponentVm.$emit("event3", "argument");
      expect(vm.events).toEqual([
        {
          name: "event3",
          instant: new Date(),
          args: ["argument"]
        }
      ]);
    });

    it("clearEvents clean events", () => {
      const testComponentVm = vm.$children[0];
      testComponentVm.$emit("event1", 0);
      testComponentVm.$emit("event2", "a", "b", true);
      vm.clearEvents();
      expect(vm.events).toEqual([]);
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
      beforeEach(() => {
        vm.update();
      });

      it("update componentKey", () => {
        expect(vm.componentKey).toEqual(2);
      });

      it("update component under test key attribute", () => {
        const {
          vm: { $vnode: node }
        } = wrapper.find({ ref: "cut" });
        expect(node.key).toEqual(2);
      });
    });

    describe("when calling changed", () => {
      test.each([
        { key: "number", value: 56 },
        { key: "string", value: "newValue" },
        { key: "oddNumber", value: 6 }
      ])("with %o changes the property key with the given value", argument => {
        vm.changed(argument);
        const testComponentVm = vm.$children[0];
        expect(testComponentVm[argument.key]).toEqual(argument.value);
      });
    });

    describe("when calling resetAllProps", () => {
      test.each([
        { key: "number", value: 56 },
        { key: "string", value: "newValue" },
        { key: "oddNumber", value: 10 }
      ])("after changing props with: %o reset to default value", argument => {
        vm.changed(argument);
        vm.resetAllProps();
        const testComponentVm = vm.$children[0];
        const { number, string, oddNumber } = testComponentVm;
        expect({ number, string, oddNumber }).toEqual({
          number: 25,
          string: "",
          oddNumber: 2
        });
      });
    });
  });

  describe("when initialized with defaults and possibleValues", () => {
    let wrapper = null;
    let dynamicAttributes = null;
    let propsDefinition = null;
    const propsData = {
      defaults: {
        number: 45
      },
      possibleValues: {
        string: ["a", "b", "c"],
        undefinedString: "new string"
      }
    };

    beforeEach(() => {
      wrapper = mountComponentWithDefaultSlot({ propsData });
      const vm = wrapper.vm;
      dynamicAttributes = vm.dynamicAttributes;
      propsDefinition = vm.propsDefinition;
    });

    it("computes the dynamicAttributes number with default value provided by defaults prop", () => {
      expect(dynamicAttributes.number).toEqual(propsData.defaults.number);
    });

    test.each([
      ["string", ["a", "b", "c"]],
      ["undefinedString", ["new string"]],
      ["number", undefined]
    ])(
      "computes propsDefinition %s with possibleValues %o",
      (prop, expected) => {
        expect(propsDefinition[prop].possibleValues).toEqual(expected);
      }
    );
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

    it("listens to event tracked by v-model and emit success event", () => {
      const testVm = vm.$children[0];
      testVm.$emit("input", 1);
      expect(wrapper.emitted()).toEqual({
        success: [['Updated props "value" to 1 based on v-model']]
      });
    });

    it("listens to two-way binding events to update properties", () => {
      const testVm = vm.$children[0];
      testVm.$emit("update:int", 25);
      expect(dynamicAttributes.int).toEqual(25);
    });

    it("listens to two-way binding events and emit success event", () => {
      const testVm = vm.$children[0];
      testVm.$emit("update:int", 25);
      expect(wrapper.emitted()).toEqual({
        success: [['Updated props "int" to 25 based on update event']]
      });
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
          createdByFactory: true,
          madeBy: "fake-component"
        },
        oddNumber: 2
      };

      expect(lastParameters(control).attributes).toEqual(expectedAttributes);
    });

    it("call the control scoped slot with componentName", () => {
      expect(lastParameters(control).componentName).toEqual("fake-component");
    });

    it("calls the control scoped slot initially with data", () => {
      expect(lastParameters(control).data).toEqual({ a: 90 });
    });

    it("calls the control scoped slot initially with computed", () => {
      expect(lastParameters(control).computed).toEqual({
        computed: 100,
        computedWithError: new Error("Problem here")
      });
    });

    it("renders the control slot", () => {
      expect(wrapper.contains(FakeEditor)).toBe(true);
    });
  });

  describe("when instantiated with a store", () => {
    let store;
    beforeEach(() => {
      store = {
        registerModule: jest.fn(function(name, module) {
          this.state[name] = module.state();
        }),
        unregisterModule: jest.fn(),
        commit: jest.fn(),
        state: {}
      };
    });

    let wrapper = null;
    let vm = null;
    let dynamicAttributes = null;

    describe("without useStore", () => {
      beforeEach(() => {
        wrapper = mountComponentWithStore({ store });
        vm = wrapper.vm;
      });

      it("sets useStore to false", () => {
        expect(vm.useStore).toEqual(false);
      });

      it("sets shouldUseStore to false", () => {
        expect(vm.shouldUseStore).toEqual(false);
      });
    });

    describe("without useStore false", () => {
      beforeEach(() => {
        wrapper = mountComponentWithStore({
          propsData: {
            useStore: false
          },
          store
        });
        vm = wrapper.vm;
      });

      it("sets useStore to false", () => {
        expect(vm.useStore).toEqual(false);
      });

      it("sets shouldUseStore to false", () => {
        expect(vm.shouldUseStore).toEqual(false);
      });
    });

    describe("without useStore true", () => {
      beforeEach(() => {
        wrapper = mountComponentWithStore({
          propsData: {
            useStore: true
          },
          store
        });
        vm = wrapper.vm;
      });

      it("sets useStore to true", () => {
        expect(vm.useStore).toEqual(true);
      });

      it("sets shouldUseStore to true", () => {
        expect(vm.shouldUseStore).toEqual(true);
      });

      it("sets storeName to componentFixture-fake-component-{id}", () => {
        expect(vm.storeName).toEqual(
          `componentFixture-fake-component-${vm.id}`
        );
      });

      it("sets register data as module state", () => {
        expect(store.state[`componentFixture-fake-component-${vm.id}`]).toEqual(
          vm.dynamicAttributes
        );
      });

      it("unregister module on destroy", () => {
        wrapper.destroy();
        expect(store.unregisterModule).toHaveBeenCalledWith(
          `componentFixture-fake-component-${vm.id}`
        );
      });
    });

    describe("without useStore true and with v-model", () => {
      beforeEach(() => {
        wrapper = mountComponentWithStore({
          slot: FakeComponentForVModel,
          propsData: {
            useStore: true
          },
          store
        });
        vm = wrapper.vm;
        dynamicAttributes = vm.dynamicAttributes;
      });

      it("computes the dynamicAttributes with default value computed when required", () => {
        expect(dynamicAttributes.value).toEqual([]);
      });

      it("listens to event tracked by v-model and commit changes", () => {
        const testVm = vm.$children[0];
        testVm.$emit("input", [1, 2, 3]);
        expect(store.commit).toHaveBeenCalledWith(
          `componentFixture-fake-component-vmodel-${vm.id}/updateValue`,
          [1, 2, 3]
        );
      });
    });
  });
});
