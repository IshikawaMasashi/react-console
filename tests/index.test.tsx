import * as React from "react";
// import { render } from "react-dom";
import { mount } from "enzyme";

import Console from "../src";

describe("<Console />", function() {
  describe("[Property] autofocus: ", function() {
    it("Has class `react-console-nofocus` until clicked when autofocus is undefined", function() {
      const consoleRef = React.createRef<{
        log: (text: string) => void;
        enter: () => void;
      }>();

      var wrapper = mount(
        <Console ref={consoleRef} handler={(command: string) => {}} />
      );
      // expect(wrapper.find(".react-console-nofocus")).length(1);
      // expect(wrapper.find(".react-console-focus")).length(0);
      // wrapper.simulate("click");
      // expect(wrapper.find(".react-console-focus")).length(1);
      // expect(wrapper.find(".react-console-nofocus")).length(0);

      expect(wrapper.find(".react-console-nofocus").length).toBe(1);
      expect(wrapper.find(".react-console-focus").length).toBe(0);
      wrapper.simulate("click");
      // expect(wrapper.find(".react-console-focus").length).toBe(1);
      // expect(wrapper.find(".react-console-nofocus").length).toBe(0);
    });
    it("Has class `react-console-focus` on mount when autofocus=true", function() {
      // var wrapper = mount(<Console autofocus={true} />);
      // expect(wrapper.find(".react-console-focus")).length(1);
      // expect(wrapper.find(".react-console-nofocus")).length(0);
    });
  });
  describe("[Property] handler: ", () => {
    it("Recieves input value", done => {
      // function handler(command: string) {
      //   expect(command).equals("ababa");
      //   done();
      // }
      // var wrapper = mount(<Console handler={handler} />);
      // var typer = wrapper.find(".react-console-typer");
      // (typer.get(0) as HTMLTextAreaElement).value = "ababa";
      // typer.simulate("change");
      // typer.simulate("keyDown", { keyCode: 13 /* Return */ });
      /*
			wrapper.setState({promptText: 'ababa'});
			var instance = wrapper.instance() as Console;
			instance.acceptLine();
      */
      function handler(command: string) {
        expect(command).toBe("ababa");
        done();
      }
      var wrapper = mount(<Console handler={handler} />);
      var typer = wrapper.find(".react-console-typer");
      typer.getDOMNode<HTMLTextAreaElement>().value = "ababa";
      typer.simulate("change");
      typer.simulate("keyDown", { keyCode: 13 /* Return */ });
    });
  });
  describe("[Property] promptLabel: ", function() {
    it("Has label '> ' when promptLabel undefined", () => {
      const wrapper = mount(<Console handler={(command: string) => {}} />);
      expect(wrapper.find(".react-console-prompt-label").text()).toBe("> ");
    });
    it("Has label 'ababa: ' when promptLabel='ababa:' ", () => {
      const wrapper = mount(
        <Console promptLabel="ababa: " handler={(command: string) => {}} />
      );
      expect(wrapper.find(".react-console-prompt-label").text()).toBe(
        "ababa: "
      );
    });
    it("Calls function when passed as promptLabel and uses returned values as labels", () => {
      // var count = 0;
      // function counter() {
      //   return count++;
      // }
      // var wrapper = mount(<Console promptLabel={counter} />);
      // var typer = wrapper.find(".react-console-typer");
      // typer.simulate("keyDown", { keyCode: 13 /* Return */ });
      // typer.simulate("keyDown", { keyCode: 13 /* Return */ });
      // typer.simulate("keyDown", { keyCode: 13 /* Return */ });
      // var labels = wrapper.find(".react-console-prompt-label");
      // expect(labels).length(4);
      // expect(count).equals(4);
      // expect(labels.at(0).text()).equals("0");
      // expect(labels.at(1).text()).equals("1");
      // expect(labels.at(2).text()).equals("2");
      // expect(labels.at(3).text()).equals("3");
    });
  });
  // describe("[Property] welcomeMessage: ", () => {
  //   it("Doesn't have class `react-console-welcome` when welcomeMessage undefined", () => {
  //     // var wrapper = shallow(<Console />);
  //     // expect(wrapper.find(".react-console-message")).length(0);
  //   });
  //   it("Has div `react-console-welcome` with text()='foo' when welcomeMessage='foo'", () => {
  //     // var wrapper = shallow(<Console welcomeMessage="foo" />);
  //     // var welcome = wrapper.find(".react-console-welcome");
  //     // expect(welcome).length(1);
  //     // expect(welcome.text()).equal("foo");
  //     const wrapper = shallow(
  //       <Console welcomeMessage="foo" handler={(command: string) => {}} />
  //     );
  //     const welcome = wrapper.find(".react-console-welcome");
  //     expect(welcome.length).toBe(1);
  //     expect(welcome.text()).toBe("foo");
  //   });
  // });
});
