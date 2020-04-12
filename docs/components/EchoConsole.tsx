import * as React from "react";
import Console from "../../src";
// import { getMode, Mode } from "../editor/mode";
// import { version } from "../editor/version";

interface Props {
  //   output: string;
  //   setOutput: (output: string) => void;
}

interface EchoConsoleState {
  count: number;
}
export default function EchoConsole(props: Props) {
  //   constructor(props: EchoConsoleProps) {
  //     super(props);
  //     this.state = {
  //       count: 0
  //     };
  //   }
  // child: {
  //   console?: Console;
  // } = {};

  const consoleRef = React.createRef<{
    log: (text: string) => void;
    enter: () => void;
  }>();

  const echo = (text: string) => {
    consoleRef.current!.log(text);
    // this.setState(
    //   {
    //     count: this.state.count + 1
    //   },
    //   () => {
    //     this.consoleRef.current.enter();
    //   }
    // );
    consoleRef.current!.enter();
    // this.child.console.return
    // this.consoleRef.current.enter;
  };
  const promptLabel = () => {
    // return this.state.count + "> ";
    return "> ";
  };
  // componentDidUpdate(prevProps: EchoConsoleProps, prevState: EchoConsoleState) {
  //   const { output, setOutput } = this.props;
  //   if (output) {
  //     // this.child.console.log(output);
  //     this.consoleRef.current.log(output)
  //     // setOutput("");
  //     // this.child.console.return();
  //     this.consoleRef.current.enter();
  //   }
  //   //const { foo, bar } = prevProps
  //   // if (prevState.baz && this.props.isLoading) { }
  // }
  //   render() {
  const welcomeMessage = `Welcome to the Console`;
  return (
    <Console
      ref={consoleRef}
      handler={echo}
      promptLabel={promptLabel}
      welcomeMessage={welcomeMessage}
      autofocus={true}
    />
  );
  //   }
}
