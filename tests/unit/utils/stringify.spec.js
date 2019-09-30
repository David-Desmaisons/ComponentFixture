import { stringify } from "@/utils/stringify";
import { mount } from "@vue/test-utils";
import FakeComponent from "../../mock/FakeComponent.vue";

const component = mount(FakeComponent, {
  propsData: { string: "" }
}).vm;

describe("stringify", () => {
  test.each([
    [
      { component },
      `{
  "component": {
    "name": "fake-component",
    "type": "VueComponent"
  }
}`
    ],
    ["abc", '"abc"'],
    [1, "1"],
    [
      { a: "a", one: "one" },
      `{
  "a": "a",
  "one": "one"
}`
    ]
  ])("stringify for %p should return: %p", (arg, expected) => {
    const value = stringify(arg);
    expect(value).toEqual(expected);
  });
});
