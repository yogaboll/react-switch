import React, {useState} from "react";
import Switch from "../..";

export default function VerticalSwitch () {
  const [checked, setChecked] = useState();
  const checkedClassName = "vertical-switch__selector";
  const uncheckedClassName = "vertical-switch__selector vertical-switch__selector_hide";

  return (
    <div className="example">
      <h2>Vertical switch</h2>
      <p>
        Just set height more than weight.
      </p>
      <label className="vertical-switch">
        <Switch
          onChange={setChecked}
          checked={checked}
          width={12}
          height={56}
          handleDiameter={30}
          boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
          checkedIcon=""
          uncheckedIcon=""
          onColor='gray'
          checkedHandleIcon="💸"
          uncheckedHandleIcon="💳"
          className="react-switch"
        />
        <span className="vertical-switch__selectors">
          <span className={checked ? uncheckedClassName : checkedClassName}>Credit Card</span>
          <span className={checked ? checkedClassName : uncheckedClassName}>Cash Money</span>
        </span>
      </label>
      <pre>
        {`
function VerticalSwitch () {
  const [checked, setChecked] = useState();
  const checkedClassName = "vertical-switch__selector";
  const uncheckedClassName = "vertical-switch__selector vertical-switch__selector_hide";

  return (
    <label className="vertical-switch">
        <Switch
          onChange={setChecked}
          checked={checked}
          width={12}
          height={56}
          handleDiameter={30}
          boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
          checkedIcon=""
          uncheckedIcon=""
          onColor='gray'
          checkedHandleIcon="💸"
          uncheckedHandleIcon="💳"
          className="react-switch"
        />
        <span className="vertical-switch__selectors">
          <span className={checked ? uncheckedClassName : checkedClassName}>Credit Card</span>
          <span className={checked ? checkedClassName : uncheckedClassName}>Cash Money</span>
        </span>
      </label>
  );
}`}
      </pre>
    </div>
  );
}
