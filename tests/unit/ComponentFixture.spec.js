import { mount, shallowMount } from "@vue/test-utils";
import ComponentFixture from "@/components/ComponentFixture.vue";
import FakeComponent from '../mock/FakeComponent.vue'

const originalError = console.error;

describe("ComponentFixture.vue", () => {
  beforeEach(() => {
    console.error = () => { };
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("throws when no default slot is passed", () => {
    const render = () => shallowMount(ComponentFixture, {});
    expect(render).toThrow("ComponentFixture should have one unique default slot");
  });

  const defaultSlotNotUnique = [[[]], [['<div/>', '<div/>']], [['<div/>', '<component1/>', '<component2/>']]];

  test.each(defaultSlotNotUnique)(
    'throws when there is not exactly than one default slots are passed',
    (args) => {
      const render = () => shallowMount(ComponentFixture, {
        slots: {
          default: args
        }
      });
      expect(render).toThrow("ComponentFixture should have one unique default slot");
    },
  );

  it("does not throw when one default slot is passed", () => {
    const render = () => shallowMount(ComponentFixture, {
      slots: {
        default: '<component/>'
      }
    });
    expect(render).not.toThrow();
  });

  it("sets the component name", async () => {
    const wrapper = mount(ComponentFixture, {
      attachToDocument: true,
      slots: {
        default: FakeComponent
      }
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.componentName).toEqual('FakeComponent');
  });
});
