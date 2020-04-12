'use strict';

import * as React from 'react';

interface ConsoleMessageProps {
  type?: string;
  value?: any[];
}

const ConsoleMessage: React.FC<ConsoleMessageProps> = ({
  type,
  value = [],
  children
}) => {
  //constructor(props: ConsoleMessageProps) {
  //  super(props);
  //}
  // public render() {
  //const {
  //  type,
  //  value
  //} = this.props;
  return (
    <div
      className={
        'react-console-message' + (type ? ' react-console-message-' + type : '')
      }
    >
      {value
        .map((val: any) => {
          if (typeof val == 'string') {
            return val;
          } else {
            return JSON.stringify(val);
          }
        })
        .join('\n')}
    </div>
  );
  // }
};

ConsoleMessage.defaultProps = {
  // type: undefined as string,
  value: []
};

export default ConsoleMessage;
