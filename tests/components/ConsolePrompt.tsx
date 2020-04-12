import * as React from "react";
// import { render } from "react-dom";
import { shallow, mount } from "enzyme";

import { ConsolePrompt } from "../../src";

describe("<ConsolePrompt />", () => {
  describe("[Property] point: ", () => {
    it("Has no cursor when point is not passed", () => {
      var wrapper = shallow(<ConsolePrompt />);
      // expect((wrapper.instance() as ConsolePrompt).child.cursor).not.exist;
      // expect(wrapper.find('.react-console-cursor')).length(0);
      expect(wrapper.find(".react-console-cursor").length).toBe(0);
    });
    it("Has cursor when point is >= 0", () => {
      var wrapper = shallow(<ConsolePrompt point={0} />);
      // expect(wrapper.find('.react-console-cursor')).length(1);
      expect(wrapper.find(".react-console-cursor").length).toBe(1);
    });
  });
  describe("[Property] value: ", () => {
    it("`.react-console-prompt` has text 'foo' when value='foo'", () => {
      var wrapper = shallow(<ConsolePrompt value="foo" />);
      //   expect(wrapper.find(".react-console-prompt").text()).equals("foo");
      expect(wrapper.find(".react-console-prompt").text()).toBe("foo");
    });
    it("`.react-console-prompt` has text 'bar' and `.react-console-cursor` has text 'b' when value='bar' and point=0", () => {
      var wrapper = shallow(<ConsolePrompt value="bar" point={0} />);
      //   expect(wrapper.find(".react-console-prompt").text()).equals("bar");
      expect(wrapper.find(".react-console-prompt").text()).toBe("bar");
      //   expect(wrapper.find(".react-console-cursor").text()).equals("b");
      expect(wrapper.find(".react-console-cursor").text()).toBe("b");
    });
    it("`.react-console-prompt` has text 'bar' and `.react-console-cursor` has text 'a' when value='bar' and point=1", () => {
      var wrapper = shallow(<ConsolePrompt value="bar" point={1} />);
      //   expect(wrapper.find(".react-console-prompt").text()).equals("bar");
      expect(wrapper.find(".react-console-prompt").text()).toBe("bar");
      //   expect(wrapper.find(".react-console-cursor").text()).equals("a");
      expect(wrapper.find(".react-console-cursor").text()).toBe("a");
    });
    it("`.react-console-prompt` has text 'bar' and `.react-console-cursor` has text 'r' when value='bar' and point=2", () => {
      var wrapper = shallow(<ConsolePrompt value="bar" point={2} />);
      //   expect(wrapper.find(".react-console-prompt").text()).equals("bar");
      expect(wrapper.find(".react-console-prompt").text()).toBe("bar");
      //   expect(wrapper.find(".react-console-cursor").text()).equals("r");
      expect(wrapper.find(".react-console-cursor").text()).toBe("r");
    });
  });
  describe("[Property] label: ", function() {
    it("`.react-console-prompt-label` has text 'foo' when label='foo'", function() {
      var wrapper = shallow(<ConsolePrompt label="foo" />);
      //   expect(wrapper.find(".react-console-prompt-label").text()).equals("foo");
      expect(wrapper.find(".react-console-prompt-label").text()).toBe("foo");
    });
  });
  describe("[Property] argument: ", function() {
    it("`.react-console-prompt-argument` has text 'foo' when argument='foo'", function() {
      var wrapper = shallow(<ConsolePrompt argument="foo" />);
      //   expect(wrapper.find(".react-console-prompt-argument").text()).equals(
      //     "foo"
      //   );
      expect(wrapper.find(".react-console-prompt-argument").text()).toBe("foo");
    });
    it("`.react-console-prompt-label` has text '' when label='foo' and `.react-console-prompt-argument` has text 'bar' when argument='bar'", function() {
      var wrapper = shallow(<ConsolePrompt label="foo" argument="bar" />);
      //   expect(wrapper.find(".react-console-prompt-label").text()).equals("");
      //   expect(wrapper.find(".react-console-prompt-argument").text()).equals(
      //     "bar"
      //   );
      expect(wrapper.find(".react-console-prompt-label").text()).toBe("");
      expect(wrapper.find(".react-console-prompt-argument").text()).toBe("bar");
    });
    it("`.react-console-prompt-label` has text 'foo\\n' when label='foo\\nbar' and `.react-console-prompt-argument` has text 'baz' when argument='baz'", function() {
      var wrapper = mount(<ConsolePrompt label="foo\nbar" argument="baz" />);
      //   expect(wrapper.find(".react-console-prompt-label").text()).equals(
      //     "foo\n"
      //   );
      //   expect(wrapper.find(".react-console-prompt-argument").text()).equals(
      //     "baz"
      //   );
      // expect(wrapper.find(".react-console-prompt-label").text()).toBe("foo\n");
      expect(wrapper.find(".react-console-prompt-argument").text()).toBe("baz");
    });
  });
  describe("[Style] idle: ", function() {
    it("Is not idle right after mount", function() {
      var wrapper = shallow(<ConsolePrompt point={0} />);
      //   expect(wrapper.find(".react-console-cursor-idle")).length(0);
      expect(wrapper.find(".react-console-cursor-idle").length).toBe(0);
    });
    // it("Is idle after 1 second", function(done) {
    //   var wrapper = mount(<ConsolePrompt point={0} />);
    //   //   window.setTimeout(() => {
    //   //     expect(wrapper.find(".react-console-cursor-idle")).length(1);
    //   //     done();
    //   //   }, 1100);
    //   window.setTimeout(() => {
    //     expect(wrapper.find(".react-console-cursor-idle").length).toBe(1);
    //     done();
    //   }, 1100);
    // });
  });
});
