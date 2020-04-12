import * as React from 'react';
import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';

// import './react-console.scss';
// import "./react-console.css";

import ConsolePrompt from './ConsolePrompt';
import ConsoleMessage from './ConsoleMessage';

export interface LogMessage {
  type?: string;
  value: any[];
}
export interface LogEntry {
  label: string;
  command: string;
  message: LogMessage[];
}

export interface ConsoleProps {
  handler: (command: string) => any;
  cancel?: () => any;
  complete?: (words: string[], curr: number, promptText: string) => string[];
  continue?: (promptText: string) => boolean;
  autofocus?: boolean;
  promptLabel?: string | (() => string);
  welcomeMessage?: string;
}
export const enum ConsoleCommand {
  Default,
  Search,
  Kill,
  Yank,
}
export const enum SearchDirection {
  Reverse,
  Forward,
}
export interface ConsoleState {
  focus?: boolean;
  acceptInput?: boolean;
  typer?: string;
  point?: number;
  currLabel?: string;
  promptText?: string;
  restoreText?: string;
  searchText?: string;
  searchDirection?: SearchDirection;
  searchInit?: boolean;
  log?: LogEntry[];
  history?: string[];
  historyn?: number;
  kill?: string[];
  killn?: number;
  argument?: string;
  lastCommand?: ConsoleCommand;
}

// type LogRecord = {};

type ForwardedRef = {
  log: (...messages: any[]) => void;
  enter: () => void;
};

// const Console: React.FC<ConsoleProps> = props => {
const Console = forwardRef<ForwardedRef, ConsoleProps>((props, ref) => {
  const nextLabel = () => {
    if (typeof props.promptLabel === 'string') {
      return props.promptLabel as string;
    } else {
      return (props.promptLabel as () => string)();
    }
  };

  // const [logRecords, setLogRecords] = useState<LogRecord[]>([]);
  const [promptText, setPromptText] = useState('');
  const [point, setPoint] = useState(0);
  const [restoreText, setRestoreText] = useState('');
  const [argument, setArgument] = useState<string | undefined>(undefined);
  const [lastCommand, setLastCommand] = useState(ConsoleCommand.Default);
  const [typer, setTyper] = useState('');
  const [state, setState] = useState({
    focus: false,
    acceptInput: true,
    // typer: "",
    // point: 0,
    currLabel: nextLabel(),
    // promptText: "",
    // restoreText: "",
    searchText: '',
    searchDirection: null as any,
    searchInit: false,
    log: [] as LogEntry[],
    history: [] as any[],
    historyn: 0,
    kill: [] as any,
    killn: 0,
    // argument: null,
    // lastCommand: ConsoleCommand.Default
  });

  const typerRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);

  // Command API
  const log = (...messages: any[]) => {
    const log = state.log;
    log[state.log.length - 1].message.push({ value: messages });
    setState({ ...state, log: log });
    scrollIfBottom();
  };

  // const logX = (type: string, ...messages: any[]) => {
  //   let log = state.log;
  //   log[state.log.length - 1].message.push({
  //     type: type,
  //     value: messages
  //   });
  //   setState({ ...state, log: log });
  //   scrollIfBottom();
  // };

  const enter = () => {
    setState({ ...state, acceptInput: true, currLabel: nextLabel() });
    scrollIfBottom();
  };

  // Component Lifecycle
  useEffect(() => {
    if (props.autofocus) {
      focus();
    }
  }, []);

  // Event Handlers
  const focus = () => {
    if (!window.getSelection) {
      return;
    }
    if (!window.getSelection()!.toString()) {
      typerRef.current!.focus();
      setState({ ...state, focus: true });
      scrollToBottom();
    }
  };
  const blur = () => {
    setState({ ...state, focus: false });
  };
  const keyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    interface keyMap {
      [key: number]: () => void;
    }
    const keyCodes: keyMap = {
      // return
      13: acceptLine,
      // left
      37: backwardChar,
      // right
      39: forwardChar,
      // up
      38: previousHistory,
      // down
      40: nextHistory,
      // backspace
      8: backwardDeleteChar,
      // delete
      46: deleteChar,
      // end
      35: endOfLine,
      // start
      36: beginningOfLine,
      // tab
      9: complete,
      // esc
      27: prefixMeta,
    };
    const ctrlCodes: keyMap = {
      // C-a
      65: beginningOfLine,
      // C-e
      69: endOfLine,
      // C-f
      70: forwardChar,
      // C-b
      66: backwardChar,
      // C-l TODO
      //76: this.clearScreen,
      // C-p
      80: previousHistory,
      // C-n
      78: nextHistory,
      // C-r
      82: reverseSearchHistory,
      // C-s
      83: forwardSearchHistory,
      // C-d
      68: deleteChar, // TODO EOF
      // C-q TODO
      //81: this.quotedInsert,
      // C-v TODO
      //86: this.quotedInsert,
      // C-t TODO
      //84: this.transposeChars,
      // C-k
      75: killLine,
      // C-u
      85: backwardKillLine,
      // C-y TODO
      89: yank,
      // C-c
      67: cancelCommand,
      // C-w TODO
      //87: this.killPreviousWhitespace,
      // C-] TODO
      //221: this.characterSearch,
      // C-x TODO
      //88: this.prefixCtrlX,
    };
    //var ctrlXCodes: keyMap = { // TODO state
    //    // C-x Rubout
    //    8: this.backwardKillLine,
    //    // C-x ( TODO
    //    //57: this.startKbdMacro,
    //    // C-x ) TODO
    //    //48: this.endKbdMacro,
    //    // C-x e TODO
    //    //69: this.callLastKbdMacro,
    //    // C-x C-u TODO
    //    //85: this.undo,
    //    // C-x C-x TODO
    //    //88: this.exchangePointAndMark,
    //};
    //var ctrlShiftCodes: keyMap = {
    //    // C-_ TODO
    //    //189: this.undo,
    //    // C-@ TODO
    //    //50: this.setMark,
    //};
    const metaCodes: keyMap = {
      // M-f
      70: forwardWord,
      // M-b
      66: backwardWord,
      // M-p
      80: nonIncrementalReverseSearchHistory,
      // M-n
      78: nonIncrementalForwardSearchHistory,
      // M-.
      190: yankLastArg,
      // M-TAB TODO
      //9: this.tabInsert,
      // M-t TODO
      //84: this.transposeWords,
      // M-u TODO
      //85: this.upcaseWord,
      // M-l TODO
      //76: this.downcaseWord,
      // M-c TODO
      //67: this.capitalizeWord,
      // M-d
      68: killWord,
      // M-backspace
      8: backwardKillWord,
      // M-w TODO
      //87: this.unixWordRubout,
      // M-\ TODO
      //220: this.deleteHorizontalSpace,
      // M-y
      89: yankPop,
      // M-0 TODO
      //48: () => this.digitArgument(0),
      // M-1 TODO
      //49: () => this.digitArgument(1),
      // M-2 TODO
      //50: () => this.digitArgument(2),
      // M-3 TODO
      //51: () => this.digitArgument(3),
      // M-4 TODO
      //52: () => this.digitArgument(4),
      // M-5 TODO
      //53: () => this.digitArgument(5),
      // M-6 TODO
      //54: () => this.digitArgument(6),
      // M-7 TODO
      //55: () => this.digitArgument(7),
      // M-8 TODO
      //56: () => this.digitArgument(8),
      // M-9 TODO
      //57: () => this.digitArgument(9),
      // M-- TODO
      //189: () => this.digitArgument('-'),
      // M-f TODO
      //71: () => this.abort,
      // M-r TODO
      //82: this.revertLine,
      // M-SPACE TODO
      //32: this.setMark,
    };
    const metaShiftCodes: keyMap = {
      // TODO hook in
      // M-<
      188: beginningOfHistory,
      // M->
      190: endOfHistory,
      // M-_
      189: yankLastArg,
      // M-? TODO
      //191: this.possibleCompletions,
      // M-* TODO
      //56: this.insertCompletions,
    };
    const metaCtrlCodes: keyMap = {
      // M-C-y
      89: yankNthArg,
      // M-C-] TODO
      //221: this.characterSearchBackward,
      // M-C-j TODO !!!
      //74: this.viEditingMode,
    };
    if (state.acceptInput) {
      if (e.altKey) {
        if (e.ctrlKey) {
          if (e.keyCode in metaCtrlCodes) {
            metaCtrlCodes[e.keyCode]();
            e.preventDefault();
          }
        } else if (e.shiftKey) {
          if (e.keyCode in metaShiftCodes) {
            metaShiftCodes[e.keyCode]();
            e.preventDefault();
          }
        } else if (e.keyCode in metaCodes) {
          metaCodes[e.keyCode]();
          e.preventDefault();
        }
        e.preventDefault();
      } else if (e.ctrlKey) {
        if (e.keyCode in ctrlCodes) {
          ctrlCodes[e.keyCode]();
          e.preventDefault();
        }
        e.preventDefault();
      } else if (e.keyCode in keyCodes) {
        keyCodes[e.keyCode]();
        e.preventDefault();
      }
    }
  };
  const change = () => {
    let idx = 0;
    for (; idx < typer.length && idx < typerRef.current!.value.length; idx++) {
      if (typer[idx] != typerRef.current!.value[idx]) {
        break;
      }
    }
    const insert = typerRef.current!.value.substring(idx);
    const replace = typer.length - idx;
    if (lastCommand == ConsoleCommand.Search) {
      setTyper(typerRef.current!.value);
      setState({
        ...state,
        searchText: state.searchInit
          ? insert
          : textInsert(insert, state.searchText, replace),
        // typer: typerRef.current.value
      });
      triggerSearch();
    } else {
      consoleInsert(insert, replace);
      setTyper(typerRef.current!.value);
      setLastCommand(ConsoleCommand.Default);
      // setState({
      //   ...state,
      //   // ...consoleInsert(insert, replace),
      //   // typer: typerRef.current.value
      //   // lastCommand: ConsoleCommand.Default
      // });
      scrollToBottom();
    }
  };
  const paste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const insert = e.clipboardData.getData('text');
    if (lastCommand == ConsoleCommand.Search) {
      setTyper(typerRef.current!.value);
      setState({
        ...state,
        searchText: state.searchInit
          ? insert
          : textInsert(insert, state.searchText),
        // typer: typerRef.current.value
      });
      triggerSearch();
    } else {
      consoleInsert(insert);
      setLastCommand(ConsoleCommand.Default);
      // setState({
      //   ...state,
      //   // ...consoleInsert(insert)
      //   // lastCommand: ConsoleCommand.Default
      // });

      scrollToBottom();
    }
    e.preventDefault();
  };
  // Commands for Moving
  const beginningOfLine = () => {
    setPoint(0);
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Default);
    setState({
      ...state,
      // point: 0,
      // argument: null,
      // lastCommand: ConsoleCommand.Default
    });
    scrollToBottom();
  };
  const endOfLine = () => {
    setPoint(promptText.length);
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Default);
    // setState({
    //   ...state,
    //   // point: promptText.length,
    //   // argument: null,
    //   // lastCommand: ConsoleCommand.Default
    // });
    scrollToBottom();
  };
  const forwardChar = () => {
    setPoint(movePoint(1));
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Default);
    // setState({
    //   ...state,
    //   // point: movePoint(1),
    //   // argument: null,
    //   lastCommand: ConsoleCommand.Default
    // });
    scrollToBottom();
  };
  const backwardChar = () => {
    setPoint(movePoint(-1));
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Default);
    // setState({
    //   ...state,
    //   // point: movePoint(-1),
    //   // argument: null,
    //   lastCommand: ConsoleCommand.Default
    // });
    scrollToBottom();
  };
  const forwardWord = () => {
    setPoint(nextWord());
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Default);
    // setState({
    //   ...state,
    //   // point: nextWord(),
    //   // argument: null,
    //   lastCommand: ConsoleCommand.Default
    // });
    scrollToBottom();
  };
  const backwardWord = () => {
    setPoint(previousWord());
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Default);
    // setState({
    //   ...state,
    //   // point: previousWord(),
    //   // argument: null,
    //   lastCommand: ConsoleCommand.Default
    // });
    scrollToBottom();
  };
  // Commands for Manipulating the History
  const acceptLine = () => {
    typerRef.current!.value = '';
    if (props.continue!(promptText)) {
      consoleInsert('\n');
      setTyper('');
      setLastCommand(ConsoleCommand.Default);
      setState({
        ...state,
        // ...consoleInsert("\n"),
        // typer: ""
        // lastCommand: ConsoleCommand.Default
      });

      scrollToBottom();
    } else {
      const command = promptText;
      const history = state.history;
      const log = state.log; //.slice(); // sliceは必要か？
      if (!history || history[history.length - 1] != command) {
        history.push(command);
      }
      log.push({
        label: state.currLabel,
        command: command,
        message: [],
      });
      setPromptText('');
      setPoint(0);
      setRestoreText('');
      setArgument(undefined);
      setLastCommand(ConsoleCommand.Default);
      setTyper('');
      setState({
        ...state,
        acceptInput: false,
        // typer: "",
        // point: 0,
        // promptText: "",
        // restoreText: "",
        log: log,
        history: history,
        historyn: 0,
        // argument: null,
        // lastCommand: ConsoleCommand.Default
      });
      // () => {
      scrollToBottom();
      if (props.handler) {
        props.handler(command);
      } else {
        enter(); //this.return();
      }
      // }
    }
  };
  const previousHistory = () => {
    rotateHistory(-1);
  };
  const nextHistory = () => {
    rotateHistory(1);
  };
  const beginningOfHistory = () => {
    rotateHistory(-state.history.length);
  };
  const endOfHistory = () => {
    rotateHistory(state.history.length);
  };
  const triggerSearch = () => {
    if (state.searchDirection == SearchDirection.Reverse) {
      reverseSearchHistory();
    } else {
      forwardSearchHistory();
    }
  };
  const reverseSearchHistory = () => {
    if (lastCommand == ConsoleCommand.Search) {
      setArgument(`(reverse-i-search)\`${state.searchText}': `);
      setLastCommand(ConsoleCommand.Search);
      setState({
        ...state,
        ...searchHistory(SearchDirection.Reverse, true),
        // argument: `(reverse-i-search)\`${state.searchText}': `,
        // lastCommand: ConsoleCommand.Search
      });

      scrollToBottom();
    } else {
      setArgument(`(reverse-i-search)\`': `);
      setLastCommand(ConsoleCommand.Search);
      setState({
        ...state,
        searchDirection: SearchDirection.Reverse,
        searchInit: true,
        // argument: `(reverse-i-search)\`': `,
        // lastCommand: ConsoleCommand.Search
      });
      scrollToBottom();
    }
  };
  const forwardSearchHistory = () => {
    if (lastCommand == ConsoleCommand.Search) {
      setArgument(`(forward-i-search)\`${state.searchText}': `);
      setLastCommand(ConsoleCommand.Search);
      setState({
        ...state,
        ...searchHistory(SearchDirection.Forward, true),
        // argument: `(forward-i-search)\`${state.searchText}': `,
        // lastCommand: ConsoleCommand.Search
      });
      scrollToBottom();
    } else {
      setArgument(`(forward-i-search)\`': `);
      setLastCommand(ConsoleCommand.Search);
      setState({
        ...state,
        searchDirection: SearchDirection.Forward,
        searchInit: true,
        // argument: `(forward-i-search)\`': `,
        // lastCommand: ConsoleCommand.Search
      });
      scrollToBottom();
    }
  };
  const nonIncrementalReverseSearchHistory = () => {
    // TODO
  };
  const nonIncrementalForwardSearchHistory = () => {
    // TODO
  };
  // const historySearchBackward = () => {
  //   // TODO
  // };
  // const historySearchForward = () => {
  //   // TODO
  // };
  // const historySubstringSearchBackward = () => {
  //   // TODO
  // };
  // const historySubstringSearchForward = () => {
  //   // TODO
  // };
  const yankNthArg = () => {
    // TODO
  };
  const yankLastArg = () => {
    // TODO
  };
  // Commands for Changing Text
  const deleteChar = () => {
    if (point < promptText.length) {
      setPromptText(
        promptText.substring(0, point) + promptText.substring(point + 1)
      );
      setArgument(undefined);
      setLastCommand(ConsoleCommand.Default);
      // setState({
      //   ...state,
      //   // promptText:
      //   //   promptText.substring(0, state.point) +
      //   //   promptText.substring(state.point + 1),
      //   // argument: null,
      //   lastCommand: ConsoleCommand.Default
      // });
      scrollToBottom();
    }
  };
  const backwardDeleteChar = () => {
    if (lastCommand == ConsoleCommand.Search) {
      setTyper(typerRef.current!.value);
      setState({
        ...state,
        searchText: state.searchText.substring(0, state.searchText.length - 1),
        // typer: typerRef.current.value
      });
      triggerSearch();
    } else if (point > 0) {
      setPromptText(
        promptText.substring(0, point - 1) + promptText.substring(point)
      );
      setPoint(movePoint(-1));
      setArgument(undefined);
      setLastCommand(ConsoleCommand.Default);
      // setState({
      //   ...state,
      //   // point: movePoint(-1),
      //   // promptText:
      //   //   state.promptText.substring(0, state.point - 1) +
      //   //   state.promptText.substring(state.point),
      //   // argument: null,
      //   lastCommand: ConsoleCommand.Default
      // });
      scrollToBottom();
    }
  };
  // Killing and Yanking
  const killLine = () => {
    const kill = state.kill;
    if (lastCommand == ConsoleCommand.Kill) {
      kill[0] = kill[0] + promptText.substring(point);
    } else {
      kill.unshift(promptText.substring(point));
    }
    setPromptText(promptText.substring(0, point));
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Kill);
    setState({
      ...state,
      // promptText: promptText.substring(0, state.point),
      kill: kill,
      killn: 0,
      // argument: null,
      // lastCommand: ConsoleCommand.Kill
    });
    scrollToBottom();
  };
  const backwardKillLine = () => {
    const kill = state.kill;
    if (lastCommand == ConsoleCommand.Kill) {
      kill[0] = promptText.substring(0, point) + kill[0];
    } else {
      kill.unshift(promptText.substring(0, point));
    }
    setPoint(0);
    setPromptText(promptText.substring(point));
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Kill);
    setState({
      ...state,
      // point: 0,
      // promptText: state.promptText.substring(state.point),
      kill: kill,
      killn: 0,
      // argument: null,
      // lastCommand: ConsoleCommand.Kill
    });
    scrollToBottom();
  };
  // const killWholeLine = () => {
  //   let kill = state.kill;
  //   if (lastCommand == ConsoleCommand.Kill) {
  //     kill[0] =
  //       promptText.substring(0, point) + kill[0] + promptText.substring(point);
  //   } else {
  //     kill.unshift(promptText);
  //   }
  //   setPoint(0);
  //   setPromptText("");
  //   setArgument(undefined);
  //   setLastCommand(ConsoleCommand.Kill);
  //   setState({
  //     ...state,
  //     // point: 0,
  //     // promptText: "",
  //     kill: kill,
  //     killn: 0
  //     // argument: null,
  //     // lastCommand: ConsoleCommand.Kill
  //   });
  //   scrollToBottom();
  // };
  const killWord = () => {
    const kill = state.kill;
    if (lastCommand == ConsoleCommand.Kill) {
      kill[0] = kill[0] + promptText.substring(point, nextWord());
    } else {
      kill.unshift(promptText.substring(point, nextWord()));
    }

    setPromptText(
      promptText.substring(0, point) + promptText.substring(nextWord())
    );
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Kill);
    setState({
      ...state,
      // promptText:
      //   promptText.substring(0, state.point) +
      //   promptText.substring(nextWord()),
      kill: kill,
      killn: 0,
      // argument: null,
      // lastCommand: ConsoleCommand.Kill
    });
    scrollToBottom();
  };
  const backwardKillWord = () => {
    const kill = state.kill;
    if (lastCommand == ConsoleCommand.Kill) {
      kill[0] = promptText.substring(previousWord(), point) + kill[0];
    } else {
      kill.unshift(promptText.substring(previousWord(), point));
    }

    setPromptText(
      promptText.substring(0, previousWord()) + promptText.substring(point)
    );
    setPoint(previousWord());
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Kill);
    setState({
      ...state,
      // point: previousWord(),
      // promptText:
      //   state.promptText.substring(0, previousWord()) +
      //   state.promptText.substring(state.point),
      kill: kill,
      killn: 0,
      // argument: null,
      // lastCommand: ConsoleCommand.Kill
    });
    scrollToBottom();
  };
  const yank = () => {
    setLastCommand(ConsoleCommand.Yank);
    consoleInsert(state.kill[state.killn]);
    // setState({
    //   ...state,
    //   ...consoleInsert(state.kill[state.killn]),
    //   // lastCommand: ConsoleCommand.Yank
    // });
    scrollToBottom();
  };
  const yankPop = () => {
    if (lastCommand == ConsoleCommand.Yank) {
      const killn = rotateRing(1, state.killn, state.kill.length);
      setLastCommand(ConsoleCommand.Yank);
      consoleInsert(state.kill[killn], state.kill[state.killn].length);
      setState({
        ...state,
        // ...consoleInsert(state.kill[killn], state.kill[state.killn].length),

        killn: killn,
        // lastCommand: ConsoleCommand.Yank
      });

      scrollToBottom();
    }
  };
  // Numeric Arguments
  // Completing
  const complete = () => {
    if (props.complete) {
      // Split text and find current word
      const words = promptText.split(' ');
      let curr = 0;
      let idx = words[0].length;
      while (idx < point && curr + 1 < words.length) {
        idx += words[++curr].length + 1;
      }

      const completions = props.complete(words, curr, promptText);
      if (completions.length == 1) {
        // Perform completion
        words[curr] = completions[0];
        let newPoint = -1;
        for (let i = 0; i <= curr; i++) {
          newPoint += words[i].length + 1;
        }
        setPoint(newPoint);
        setPromptText(words.join(' '));
        setArgument(undefined);
        setLastCommand(ConsoleCommand.Default);
        // setState({
        //   ...state,
        //   // point: point,
        //   // promptText: words.join(" "),
        //   // argument: null,
        //   lastCommand: ConsoleCommand.Default
        // });
        scrollToBottom();
      } else if (completions.length > 1) {
        // show completions
        const log = state.log;
        log.push({
          label: state.currLabel,
          command: promptText,
          message: [
            {
              type: 'completion',
              value: [completions.join('\t')],
            },
          ],
        });
        setArgument(undefined);
        setLastCommand(ConsoleCommand.Default);
        setState({
          ...state,
          currLabel: nextLabel(),
          log: log,
          // argument: null,
          // lastCommand: ConsoleCommand.Default
        });
        scrollToBottom();
      }
    }
  };
  // Keyboard Macros
  // Miscellaneous
  const prefixMeta = () => {
    if (lastCommand == ConsoleCommand.Search) {
      setArgument(undefined);
      setLastCommand(ConsoleCommand.Default);
      // setState({
      //   ...state,
      //   // argument: null,
      //   lastCommand: ConsoleCommand.Default
      // });
    }
    // TODO Meta prefixed state
  };
  const cancelCommand = () => {
    if (state.acceptInput) {
      // Typing command
      typerRef.current!.value = '';
      const log = state.log;
      log.push({
        label: state.currLabel,
        command: promptText,
        message: [],
      });
      setPoint(0);
      setPromptText('');
      setRestoreText('');
      setArgument(undefined);
      setLastCommand(ConsoleCommand.Default);
      setTyper('');
      setState({
        ...state,
        // typer: "",
        // point: 0,
        // promptText: "",
        // restoreText: "",
        log: log,
        historyn: 0,
        // argument: null,
        // lastCommand: ConsoleCommand.Default
      });
      scrollToBottom();
    } else {
      // command is executing, call handler
      props.cancel!();
    }
  };
  // Helper functions
  const textInsert = (
    insert: string,
    text: string,
    replace = 0,
    point: number = text.length
  ): string => {
    return text.substring(0, point - replace) + insert + text.substring(point);
  };
  const consoleInsert = (insert: string, replace = 0) => {
    const newPromptText = textInsert(insert, promptText, replace, point);
    setPoint(
      movePoint(
        insert.length - replace,
        insert.length - replace + promptText.length
      )
    );
    setPromptText(newPromptText);
    setRestoreText(newPromptText);
    setArgument(undefined);
    setLastCommand(ConsoleCommand.Default);
    // return {
    //   // point: movePoint(
    //   //   insert.length - replace,
    //   //   insert.length - replace + promptText.length
    //   // ),
    //   // promptText: newPromptText,
    //   // restoreText: newPromptText,
    //   // argument: null as string,
    //   lastCommand: ConsoleCommand.Default
    // };
  };
  const movePoint = (n: number, max: number = promptText.length) => {
    const pos = point + n;
    if (pos < 0) {
      return 0;
    }
    if (pos > max) {
      return max;
    } else {
      return pos;
    }
  };
  const nextWord = (): number => {
    // Find first alphanumeric char after first non-alphanumeric char
    const search = /\W\w/.exec(promptText.substring(point));
    if (search) {
      return search.index + point + 1;
    } else {
      return promptText.length;
    }
  };
  const previousWord = (): number => {
    // Find first non-alphanumeric char after first alphanumeric char in reverse
    const search = /\W\w(?!.*\W\w)/.exec(promptText.substring(0, point - 1));
    if (search) {
      return search.index + 1;
    } else {
      return 0;
    }
  };
  const rotateRing = (
    n: number,
    ringn: number,
    ring: number,
    circular = true
  ): number => {
    if (ring == 0) return 0;
    if (circular) {
      return (ring + ((ringn + n) % ring)) % ring;
    } else {
      ringn = ringn - n;
      if (ringn < 0) {
        return 0;
      } else if (ringn >= ring) {
        return ring;
      } else {
        return ringn;
      }
    }
  };
  const rotateHistory = (n: number) => {
    const historyn = rotateRing(n, state.historyn, state.history.length, false);
    if (historyn == 0) {
      setPoint(restoreText.length);
      setPromptText(restoreText);
      setArgument(undefined);
      setLastCommand(ConsoleCommand.Default);
      setState({
        ...state,
        // point: state.restoreText.length,
        // promptText: state.restoreText,
        historyn: historyn,
        // argument: null,
        // lastCommand: ConsoleCommand.Default
      });
      scrollToBottom();
    } else {
      // let promptText = state.history[state.history.length - historyn];
      setPoint(promptText.length);
      setPromptText(state.history[state.history.length - historyn]);
      setArgument(undefined);
      setLastCommand(ConsoleCommand.Default);
      setState({
        ...state,
        // point: promptText.length,
        // promptText: promptText,
        historyn: historyn,
        // argument: null,
        // lastCommand: ConsoleCommand.Default
      });
      scrollToBottom();
    }
  };
  const searchHistory = (
    direction: SearchDirection = state.searchDirection,
    next = false
  ) => {
    let idx = state.historyn;
    const inc = direction == SearchDirection.Reverse ? 1 : -1;
    if (next) {
      idx = idx + inc;
    }
    for (; idx > 0 && idx <= state.history.length; idx = idx + inc) {
      const entry = state.history[state.history.length - idx];
      const newPoint = entry.indexOf(state.searchText);
      if (newPoint > -1) {
        setPoint(newPoint);
        setPromptText(entry);
        return {
          // point: point,
          // promptText: entry,
          searchDirection: direction,
          searchInit: false,
          historyn: idx,
        };
      }
    }
    return {
      searchDirection: direction,
      searchInit: false,
    };
  };
  // DOM management
  const scrollSemaphoreRef = useRef(0);
  const scrollIfBottom = () => {
    if (
      scrollSemaphoreRef.current > 0 ||
      containerRef.current!.scrollTop ==
        containerRef.current!.scrollHeight - containerRef.current!.offsetHeight
    ) {
      scrollSemaphoreRef.current++;
      return scrollIfBottomTrue();
    } else {
      return null;
    }
  };
  const scrollIfBottomTrue = () => {
    scrollToBottom();
    scrollSemaphoreRef.current--;
  };
  const scrollToBottom = () => {
    containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
    const rect = focusRef.current!.getBoundingClientRect();
    if (
      rect.top < 0 ||
      rect.left < 0 ||
      rect.bottom >
        (window.innerHeight || document.documentElement.clientHeight) ||
      rect.right > (window.innerWidth || document.documentElement.clientWidth)
    ) {
      typerRef.current!.scrollIntoView(false);
    }
  };

  // コンポーネントのインスタンスが持つメソッドを宣言
  useImperativeHandle(ref, () => ({
    log(...messages: any[]) {
      log(...messages);
    },
    enter() {
      enter();
    },
  }));

  return (
    <div
      ref={containerRef}
      className={
        'react-console-container ' +
        (state.focus ? 'react-console-focus' : 'react-console-nofocus')
      }
      onClick={focus}
    >
      {props.welcomeMessage ? (
        <div className="react-console-message react-console-welcome">
          {props.welcomeMessage}
        </div>
      ) : null}
      {state.log.map((val: LogEntry, index) => {
        return [
          <ConsolePrompt
            key={'console-prompt-' + index}
            label={val.label}
            value={val.command}
          />,
          ...val.message.map((val: LogMessage, idx: number) => {
            return (
              <ConsoleMessage
                key={'console-message-' + idx}
                type={val.type}
                value={val.value}
              />
            );
          }),
        ];
      })}
      {state.acceptInput ? (
        <ConsolePrompt
          label={state.currLabel}
          value={promptText}
          point={point}
          argument={argument}
        />
      ) : null}
      <div style={{ overflow: 'hidden', height: 1, width: 1 }}>
        <textarea
          ref={typerRef}
          className="react-console-typer"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{
            outline: 'none',
            color: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            resize: 'none',
            overflow: 'hidden',
          }}
          onBlur={blur}
          onKeyDown={keyDown}
          onChange={change}
          onPaste={paste}
        />
      </div>
      <div ref={focusRef}>&nbsp;</div>
    </div>
  );
});

Console.defaultProps = {
  promptLabel: '> ',
  continue: function () {
    return false;
  },
  cancel: function () {},
};

export default Console;
