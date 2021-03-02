import React from "react";
import { render } from "react-dom";
import "./styles.css";
import BasicExample from "./BasicExample";
import MaterialDesign from "./MaterialDesign";
import KitchenSink from "./KitchenSink";
import Disabled from "./Disabled";
import Vertical from "./Vertical";
import AriaLabelledby from "./AriaLabelledby";
import AriaLabel from "./AriaLabel";
import PassThroughProps from "./PassThroughProps";
import OnlyTurnedOn from "./OnlyTurnedOn";

function Examples() {
  return (
    <div id="examples">
      <h1>React Switch</h1>
      <BasicExample />
      <MaterialDesign />
      <KitchenSink />
      <Disabled />
      <Vertical />
      <PassThroughProps />
      <OnlyTurnedOn />
      <AriaLabelledby />
      <AriaLabel />
      <p>
        The full source code for this page can be found&nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/markusenglund/react-switch/tree/master/demo/src"
        >
          here
        </a>
        .
      </p>
    </div>
  );
}

render(<Examples />, document.getElementById("app"));
