import * as React from "react";
// import { render } from "react-dom";
import { shallow, mount } from "enzyme";

import { ConsoleMessage } from "../../src";

describe("<ConsoleMessage />", () => {
  describe("[Property] type: ", () => {
    it("Has class `react-console-message` when type=null", function() {
      var wrapper = shallow(<ConsoleMessage />);
      //   assert(
      //     wrapper.hasClass("react-console-message"),
      //     "Missing class `react-console-message`"
      //   );
      expect(wrapper.hasClass("react-console-message")).toBeTruthy();
    });
    it("Has class `react-console-message react-console-message-foo` when type='foo'", function() {
      var wrapper = shallow(<ConsoleMessage type="foo" />);
      // assert(
      //   wrapper.hasClass("react-console-message-foo"),
      //   "Missing class `react-console-message-foo`"
      // );
      expect(wrapper.hasClass("react-console-message-foo")).toBeTruthy();
      // assert(
      //   wrapper.hasClass("react-console-message"),
      //   "Missing class `react-console-message`"
      // );
      expect(wrapper.hasClass("react-console-message")).toBeTruthy();
    });
  });
  describe("[Property] value: ", function() {
    it("Text == 'ababa' when value={['ababa']}", function() {
      var wrapper = shallow(<ConsoleMessage value={["ababa"]} />);
      // assert(wrapper.text() == "ababa", "Text does not equal 'ababa'");
      expect(wrapper.text()).toBe("ababa");
    });
    it("Text == 'a\\nb\\nc' when value={['a','b','c']}", function() {
      var wrapper = mount(<ConsoleMessage value={["a", "b", "c"]} />);
      // assert(wrapper.text() == "a\nb\nc", "Text does not equal 'a\\nb\\nc'");
      expect(wrapper.text()).toBe("a\nb\nc");
    });
    it("Text == JSON.stringify(value) when value={[['a','b','c',1,2,3]]}", function() {
      var wrapper = shallow(
        <ConsoleMessage value={[["a", "b", "c", 1, 2, 3]]} />
      );
      // assert(
      //   wrapper.text() == JSON.stringify(["a", "b", "c", 1, 2, 3]),
      //   "Text does not equal JSON.stringify(value)"
      // );
      expect(wrapper.text()).toBe(JSON.stringify(["a", "b", "c", 1, 2, 3]));
    });
    it("Text == JSON.stringify(value) when value={[{a:1,b:2,c:[3,4,5]}]}", function() {
      var wrapper = shallow(
        <ConsoleMessage value={[{ a: 1, b: 2, c: [3, 4, 5] }]} />
      );
      // assert(
      //   wrapper.text() == JSON.stringify({ a: 1, b: 2, c: [3, 4, 5] }),
      //   "Text does not equal JSON.stringify(value)"
      // );
      expect(wrapper.text()).toBe(JSON.stringify({ a: 1, b: 2, c: [3, 4, 5] }));
    });
  });
});
