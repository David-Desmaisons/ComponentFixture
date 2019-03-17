import { shallowMount } from "@vue/test-utils";
import ComponentFixture from "@/components/ComponentFixture.vue";
import FakeComponent from "../../mock/FakeComponent.vue";
import FakeComponentForVModel from "../../mock/FakeComponentForVModel";
import FakeComponentForCustomVModel from "../../mock/FakeComponentForCustomVModel";
import FakeEditor from "../../mock/FakeEditor.vue";

const { console } = window;
const { error: originalError, warn: originalWarn } = console;
const nullFunction = () => { };

const mountComponentWithDefaultSlot = (arg = {}) => {
  const { slot = FakeComponent } = arg;
  return shallowMount(ComponentFixture, {
    slots: {
      default: slot
    }
  });
};

describe("ComponentFixture.vue", () => {
  beforeEach(() => {
    console.error = nullFunction;
    console.warn = nullFunction;
  });

  afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  it("throws when no default slot is passed", () => {
    const render = () => shallowMount(ComponentFixture, {});
    expect(render).toThrow(
      "ComponentFixture should have one unique default slot"
    );
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

    it("has an empty data property events", () => {
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
          args: [0]
        },
        {
          name: "event2",
          args: ["a", "b", true]
        }
      ]);
    });

    it("renders component from slot", () => {
      expect(wrapper.contains(FakeComponent)).toBe(true);
    });
  });

  describe("when re-render after update", () => {
    let wrapper;
    let options;
    let currentProps;
    beforeEach(async () => {
      wrapper = mountComponentWithDefaultSlot();
      const { vm } = wrapper;

      await wrapper.vm.$nextTick();
      const { $options } = vm.$children[0];
      options = $options;
      currentProps = options.props;
      const newProps = {
        ...currentProps, newProp: {
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

    beforeEach(() => {
      wrapper = mountComponentWithDefaultSlot({ slot: FakeComponentForVModel });
      vm = wrapper.vm;
      dynamicAttributes = wrapper.vm.dynamicAttributes;
    });

    it("computes the dynamicAttributes with default value computed when required", () => {
      expect(dynamicAttributes.value).toEqual([]);
    });

    it("listens to event tracked by v-model and update prop", () => {
      const testComponentVm = vm.$children[0];
      testComponentVm.$emit("input", [1, 2, 3]);
      expect(dynamicAttributes.value).toEqual([1, 2, 3]);
    });
  });

  describe("when initialized with a component supporting custom v-model API", () => {
    let wrapper = null;
    let vm = null;
    let dynamicAttributes = null;

    beforeEach(() => {
      wrapper = mountComponentWithDefaultSlot({
        slot: FakeComponentForCustomVModel
      });
      vm = wrapper.vm;
      dynamicAttributes = wrapper.vm.dynamicAttributes;
    });

    it("computes the dynamicAttributes with default value", () => {
      expect(dynamicAttributes.customValue).toEqual("string");
    });

    it("listens to event tracked by v-model ans update prop", () => {
      const testComponentVm = vm.$children[0];
      testComponentVm.$emit("customInput", "new value");
      expect(dynamicAttributes.customValue).toEqual("new value");
    });
  });

  describe("when initialized with a controller slot", () => {
    const mountComponentWithDefaultSlotAndControllerSlot = control =>
      shallowMount(ComponentFixture, {
        slots: {
          default: FakeComponent
        },
        scopedSlots: {
          control
        }
      });

    let wrapper = null;
    let control = null;

    beforeEach(() => {
      control = jest.fn(function (props) {
        return this.$createElement(FakeEditor, { props });
      });
      wrapper = mountComponentWithDefaultSlotAndControllerSlot(control);
    });

    it("renders component from default slot", () => {
      expect(wrapper.contains(FakeComponent)).toBe(true);
    });

    it("calls the control scoped slot", () => {
      expect(control.mock.calls.length).toBe(1);
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

      expect(control.mock.calls[0][0].attributes).toEqual(expectedAttributes);
    });

    it("call the control scoped slot with componentName", () => {
      expect(control.mock.calls[0][0].componentName).toEqual("fake-component");
    });

    it("renders the control slot", () => {
      expect(wrapper.contains(FakeEditor)).toBe(true);
    });
  });
});
