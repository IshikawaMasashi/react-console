'use strict';

import * as React from 'react';

const { useEffect, useRef } = React;
interface Props {
  point?: number;
  value?: string;
  label?: string;
  argument?: string;
}

// interface ConsolePromptState {}

export default function ConsolePrompt({
  point = -1,
  value = '',
  label = '> ',
  argument
}: Props) {
  // static defaultProps: ConsolePromptProps = {
  //   point: -1,
  //   value: "",
  //   label: "> "
  //   // argument: null as string
  // };
  const cursorRef = useRef<HTMLSpanElement>(null);
  // Component Lifecycle
  // componentDidMount() {
  //   this.idle();
  // }
  useEffect(() => {
    idle();
    return () => {};
  }, []);
  // componentDidUpdate() {
  //   this.idle();
  // }
  useEffect(() => {
    idle();
    // return () => {};
  });

  // DOM Management
  const updateSemaphoreRef = useRef(0);
  const idle = () => {
    // Blink cursor when idle
    if (cursorRef.current) {
      if (updateSemaphoreRef.current == 0) {
        cursorRef.current.className = 'react-console-cursor';
      }
      updateSemaphoreRef.current++;
      window.setTimeout(() => {
        updateSemaphoreRef.current--;
        if (updateSemaphoreRef.current == 0 && cursorRef.current) {
          cursorRef.current.className =
            'react-console-cursor react-console-cursor-idle';
        }
      }, 1000);
    }
  };
  const renderValue = () => {
    if (point < 0) {
      return [value];
    } else if (point == value.length) {
      return [
        value,
        <span ref={cursorRef} key="cursor" className="react-console-cursor">
          &nbsp;
        </span>
      ];
    } else {
      return [
        value.substring(0, point),
        <span ref={cursorRef} key="cursor" className="react-console-cursor">
          {value.substring(point, point + 1)}
        </span>,
        value.substring(point + 1)
      ];
    }
  };
  // render() {
  // let label = props.label;
  if (argument) {
    let idx = label.lastIndexOf('\n');
    if (idx >= 0) {
      label = label.substring(0, idx + 1);
    } else {
      label = '';
    }
  }
  return (
    <div className="react-console-prompt-box">
      <span className="react-console-prompt-label">{label}</span>
      <span className="react-console-prompt-argument">{argument}</span>
      <span className="react-console-prompt">{renderValue()}</span>
    </div>
  );
  // }
}

// ConsolePrompt.defaultProps = {
//   point: -1,
//   value: "",
//   label: "> "
//   // argument: null as string
// };
