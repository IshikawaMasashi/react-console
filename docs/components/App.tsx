import React from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import { VirtualList, ItemStyle } from "../../src";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Example1 from "./Example1";
import Example2 from "./Example2";
import Example3 from "./Example3";
import Example4 from "./Example4";
import Example5 from "./Example5";
import EchoConsole from "./EchoConsole";

import "../lib/highlight/styles/github.css";
import * as hljs from "highlight.js";

const { useEffect } = React;
enum View {
  Example1,
  Example2
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    height: 400
  },
  title: {
    padding: 16
  }
}));

type Props = {};
export default function ResponsiveDrawer(props: Props) {
  const basicSetup = [
    "Elements of equal height",
    "Variable heights",
    "Horizontal list"
  ];

  const controlledProps = ["Scroll to index", "Controlled scroll offset"];

  const labels = basicSetup.concat(controlledProps);

  const examples = [
    <Example1 />,
    <Example2 />,
    <Example3 />,
    <Example4 />,
    <Example5 />
  ];

  // const { container } = props;
  const classes = useStyles({});
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [view, setView] = React.useState(View.Example1);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  function handleListItemClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ): void {
    setSelectedIndex(index);
  }

  useEffect(() => {
    hljs.initHighlightingOnLoad();
    return () => {};
  }, []);

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <div className={classes.title}>
          <Typography variant="h6" noWrap>
            React Virtual List
          </Typography>
        </div>
      </div>
      <Divider />
      <List>
        <ListSubheader>
          <Typography variant="h6" noWrap>
            Basic setup
          </Typography>
        </ListSubheader>
        {basicSetup.map((text, index) => (
          <ListItem
            button
            key={text}
            selected={selectedIndex === index}
            onClick={event => handleListItemClick(event, index)}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>
          <Typography variant="h6" noWrap>
            Controlled props
          </Typography>
        </ListSubheader>
        {controlledProps.map((text, index) => (
          <ListItem
            button
            key={text}
            selected={selectedIndex === index + basicSetup.length}
            onClick={event =>
              handleListItemClick(event, index + basicSetup.length)
            }
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const code = `class Game {
    public animate()
    {
        console.log("animate()");
        this._render();
        requestAnimationFrame(()=>this.animate());
    }
    private _render(): void
    {
        console.log("From _render")
    }
}
let game = new Game();
    game.animate();`;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap>
            {labels[selectedIndex]}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="Mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <EchoConsole></EchoConsole>
        <pre style={{fontSize:"18px"}}>
          <code className="typescript">{code}</code>
        </pre>
        {examples[selectedIndex]}
      </main>
    </div>
  );
}

// ResponsiveDrawer.propTypes = {
//   // Injected by the documentation to work in an iframe.
//   // You won't need it on your project.
//   container: PropTypes.object,
// };
