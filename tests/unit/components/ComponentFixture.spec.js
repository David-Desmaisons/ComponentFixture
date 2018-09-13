import { shallowMount } from "@vue/test-utils";
import ComponentFixture from "@/components/ComponentFixture.vue";
import FakeComponent from "../../mock/FakeComponent.vue";
import FakeEditor from "../../mock/FakeEditor.vue";

const { console } = window;
const originalError = console.error;

const mountComponentWithDefaultSlot = (slot = FakeComponent) =>
  shallowMount(ComponentFixture, {
    slots: {
      default: slot
    }
  });

describe("ComponentFixture.vue", () => {
  beforeEach(() => {
    console.error = () => { };
  });

  afterEach(() => {
    console.error = originalError;
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
      const render = () => mountComponentWithDefaultSlot(args);
      expect(render).toThrow(
        "ComponentFixture should have one unique default slot"
      );
    }
  );

  it("does not throw when one default slot is passed", () => {
    const render = () => mountComponentWithDefaultSlot("<component/>");
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

    const propDefinition = [
      ["number", {
        type: Number,
        default: 25
      }],
      ["string", {
        type: String,
        required: true
      }],
      ["undefinedString", {
        type: String,
        required: false
      }]
    ];

    test.each(propDefinition)(
      "propsDefinition contains props definition: key: %p value: %p",
      (key, expected) => {
        const { propsDefinition } = vm;
        expect(propsDefinition[key].definition).toEqual(expected);
      }
    );

    it("renders component from slot", () => {
      expect(wrapper.contains(FakeComponent)).toBe(true);
    });
  });

  describe("when initialized with a controller slot", () => {
    const mountComponentWithDefaultSlotAndControllerSlot = (control) =>
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
        return this.$createElement(FakeEditor, { props })
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