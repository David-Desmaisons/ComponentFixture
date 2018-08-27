import { shallowMount } from "@vue/test-utils";
import ComponentFixture from "@/components/ComponentFixture.vue";

describe("ComponentFixture.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(ComponentFixture, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
