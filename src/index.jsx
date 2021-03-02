import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  checkedIcon as defaultCheckedIcon,
  uncheckedIcon as defaultUncheckedIcon
} from "./icons.jsx";
import getBackgroundColor from "./getBackgroundColor";
import hexColorPropType from "./hexColorPropType";

class ReactSwitch extends Component {
  constructor(props) {
    super(props);
    const { height, width, handleDiameter, checked } = props;

    this.$vertical = height > width;
    const largeSize = this.$vertical ? height : width;
    this.$smallerSize = this.$vertical ? width : height;
    this.$orientation = this.$vertical ? 'Y' : 'X';
    this.$eventField = `client${this.$orientation}`;
    this.$handleDiameter = handleDiameter || this.$smallerSize - 2;
    this.$handleOffset = Math.max(0, (this.$smallerSize - this.$handleDiameter) / 2);
    this.$iconSize = Math.min(
      this.$smallerSize * 1.5,
      largeSize - (this.$handleDiameter + this.$smallerSize) / 2 + 1
    );

    this.$checkedPos = Math.max(
      largeSize - this.$smallerSize,
      largeSize - (this.$smallerSize + this.$handleDiameter) / 2
    );
    this.$uncheckedPos = Math.max(0, (this.$smallerSize - this.$handleDiameter) / 2);
    this.state = {
      $pos: checked ? this.$checkedPos : this.$uncheckedPos
    };
    this.$lastDragAt = 0;
    this.$lastKeyUpAt = 0;

    this.$onMouseDown = this.$onMouseDown.bind(this);
    this.$onMouseMove = this.$onMouseMove.bind(this);
    this.$onMouseUp = this.$onMouseUp.bind(this);

    this.$onTouchStart = this.$onTouchStart.bind(this);
    this.$onTouchMove = this.$onTouchMove.bind(this);
    this.$onTouchEnd = this.$onTouchEnd.bind(this);
    this.$onClick = this.$onClick.bind(this);

    this.$onInputChange = this.$onInputChange.bind(this);
    this.$onKeyUp = this.$onKeyUp.bind(this);
    this.$setHasOutline = this.$setHasOutline.bind(this);
    this.$unsetHasOutline = this.$unsetHasOutline.bind(this);
    this.$getInputRef = this.$getInputRef.bind(this);
  }

  componentDidMount() {
    this.$isMounted = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked === this.props.checked) {
      return;
    }

    const $pos = this.props.checked ? this.$checkedPos : this.$uncheckedPos;
    this.setState({ $pos });
  }

  componentWillUnmount() {
    this.$isMounted = false;
  }

  $onDragStart(clientX) {
    this.$inputRef.focus();
    this.setState({
      $startX: clientX,
      $hasOutline: true,
      $dragStartingTime: Date.now()
    });
  }

  $onDrag(clientX) {
    const { $startX, $isDragging, $pos } = this.state;
    const { checked } = this.props;
    const startPos = checked ? this.$checkedPos : this.$uncheckedPos;
    const mousePos = startPos + clientX - $startX;
    // We need this check to fix a windows glitch where onDrag is triggered onMouseDown in some cases
    if (!$isDragging && clientX !== $startX) {
      this.setState({ $isDragging: true });
    }
    const newPos = Math.min(
      this.$checkedPos,
      Math.max(this.$uncheckedPos, mousePos)
    );
    // Prevent unnecessary rerenders
    if (newPos !== $pos) {
      this.setState({ $pos: newPos });
    }
  }

  $onDragStop(event) {
    const { $pos, $isDragging, $dragStartingTime } = this.state;
    const { checked } = this.props;
    const halfwayCheckpoint = (this.$checkedPos + this.$uncheckedPos) / 2;

    /*
      Set position state back to the previous position even if user drags the switch with intention to change the state.
      This is to prevent the switch from getting stuck in the middle if the event isn't handled in the onChange callback.
    */
    const prevPos = this.props.checked ? this.$checkedPos : this.$uncheckedPos;
    this.setState({ $pos: prevPos });

    // Act as if the user clicked the handle if they didn't drag it _or_ the dragged it for less than 250ms
    const timeSinceStart = Date.now() - $dragStartingTime;
    const isSimulatedClick = !$isDragging || timeSinceStart < 250;

    // Handle when the user has dragged the switch more than halfway from either side
    const isDraggedHalfway =
      (checked && $pos <= halfwayCheckpoint) ||
      (!checked && $pos >= halfwayCheckpoint);

    if (isSimulatedClick || isDraggedHalfway) {
      this.$onChange(event);
    }

    if (this.$isMounted) {
      this.setState({ $isDragging: false, $hasOutline: false });
    }
    this.$lastDragAt = Date.now();
  }

  $onMouseDown(event) {
    event.preventDefault();
    // Ignore right click and scroll
    if (typeof event.button === "number" && event.button !== 0) {
      return;
    }

    this.$onDragStart(event[this.$eventField]);
    window.addEventListener("mousemove", this.$onMouseMove);
    window.addEventListener("mouseup", this.$onMouseUp);
  }

  $onMouseMove(event) {
    event.preventDefault();
    this.$onDrag(event[this.$eventField]);
  }

  $onMouseUp(event) {
    this.$onDragStop(event);
    window.removeEventListener("mousemove", this.$onMouseMove);
    window.removeEventListener("mouseup", this.$onMouseUp);
  }

  $onTouchStart(event) {
    this.$checkedStateFromDragging = null;
    this.$onDragStart(event.touches[0][this.$eventField]);
  }

  $onTouchMove(event) {
    this.$onDrag(event.touches[0][this.$eventField]);
  }

  $onTouchEnd(event) {
    event.preventDefault();
    this.$onDragStop(event);
  }

  $onInputChange(event) {
    // This condition is unfortunately needed in some browsers where the input's change event might get triggered
    // right after the dragstop event is triggered (occurs when dropping over a label element)
    if (Date.now() - this.$lastDragAt > 50) {
      this.$onChange(event);
      // Prevent clicking label, but not key activation from setting outline to true - yes, this is absurd
      if (Date.now() - this.$lastKeyUpAt > 50) {
        if (this.$isMounted) {
          this.setState({ $hasOutline: false });
        }
      }
    }
  }

  $onKeyUp() {
    this.$lastKeyUpAt = Date.now();
  }

  $setHasOutline() {
    this.setState({ $hasOutline: true });
  }

  $unsetHasOutline() {
    this.setState({ $hasOutline: false });
  }

  $getInputRef(el) {
    this.$inputRef = el;
  }

  $onClick(event) {
    event.preventDefault();
    this.$inputRef.focus();
    this.$onChange(event);
    if (this.$isMounted) {
      this.setState({ $hasOutline: false });
    }
  }

  $onChange(event) {
    const { checked, onChange, id } = this.props;
    onChange(!checked, event, id);
  }

  render() {
    const {
      checked,
      disabled,
      className,
      offColor,
      onColor,
      offHandleColor,
      onHandleColor,
      checkedIcon,
      uncheckedIcon,
      checkedHandleIcon,
      uncheckedHandleIcon,
      boxShadow,
      activeBoxShadow,
      height,
      width,
      borderRadius,
      handleDiameter, // just to filter this prop out
      ...rest
    } = this.props;

    const { $pos, $isDragging, $hasOutline } = this.state;

    const rootStyle = {
      position: "relative",
      display: "inline-block",
      textAlign: "left",
      opacity: disabled ? 0.5 : 1,
      direction: "ltr",
      borderRadius: height / 2,
      WebkitTransition: "opacity 0.25s",
      MozTransition: "opacity 0.25s",
      transition: "opacity 0.25s",
      touchAction: "none",
      WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none"
    };

    const backgroundStyle = {
      height,
      width,
      margin: Math.max(0, (this.$handleDiameter - this.$smallerSize) / 2),
      position: "relative",
      background: getBackgroundColor(
        $pos,
        this.$checkedPos,
        this.$uncheckedPos,
        offColor,
        onColor
      ),
      borderRadius:
        typeof borderRadius === "number" ? borderRadius : height / 2,
      cursor: disabled ? "default" : "pointer",
      WebkitTransition: $isDragging ? null : "background 0.25s",
      MozTransition: $isDragging ? null : "background 0.25s",
      transition: $isDragging ? null : "background 0.25s"
    };

    const checkedIconStyle = {
      height: this.$vertical ? this.$iconSize : height,
      width: this.$vertical ? width : this.$iconSize,
      position: "relative",
      opacity:
        ($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos),
      pointerEvents: "none",
      WebkitTransition: $isDragging ? null : "opacity 0.25s",
      MozTransition: $isDragging ? null : "opacity 0.25s",
      transition: $isDragging ? null : "opacity 0.25s"
    };

    const uncheckedIconStyle = {
      height: this.$vertical ? this.$iconSize : height,
      width: this.$vertical ? width : this.$iconSize,
      position: "absolute",
      opacity:
        1 -
        ($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos),
      right: 0,
      top: this.$vertical ? undefined : 0,
      bottom: this.$vertical ? 0 : undefined,
      pointerEvents: "none",
      WebkitTransition: $isDragging ? null : "opacity 0.25s",
      MozTransition: $isDragging ? null : "opacity 0.25s",
      transition: $isDragging ? null : "opacity 0.25s"
    };

    const handleStyle = {
      height: this.$handleDiameter,
      width: this.$handleDiameter,
      background: getBackgroundColor(
        $pos,
        this.$checkedPos,
        this.$uncheckedPos,
        offHandleColor,
        onHandleColor
      ),
      display: "inline-block",
      cursor: disabled ? "default" : "pointer",
      borderRadius: typeof borderRadius === "number" ? borderRadius - 1 : "50%",
      position: "absolute",
      transform: `translate${this.$orientation}(${$pos}px)`,
      top: this.$vertical ? 0 : this.$handleOffset,
      left: this.$vertical ? this.$handleOffset : undefined,
      outline: 0,
      boxShadow: $hasOutline ? activeBoxShadow : boxShadow,
      border: 0,
      WebkitTransition: $isDragging
        ? null
        : "background-color 0.25s, transform 0.25s, box-shadow 0.15s",
      MozTransition: $isDragging
        ? null
        : "background-color 0.25s, transform 0.25s, box-shadow 0.15s",
      transition: $isDragging
        ? null
        : "background-color 0.25s, transform 0.25s, box-shadow 0.15s"
    };

    const uncheckedHandleIconStyle = {
      height: this.$handleDiameter,
      width: this.$handleDiameter,
      opacity: Math.max(
        (1 -
          ($pos - this.$uncheckedPos) /
            (this.$checkedPos - this.$uncheckedPos) -
          0.5) *
          2,
        0
      ),
      position: "absolute",
      left: 0,
      top: 0,
      pointerEvents: "none",
      WebkitTransition: $isDragging ? null : "opacity 0.25s",
      MozTransition: $isDragging ? null : "opacity 0.25s",
      transition: $isDragging ? null : "opacity 0.25s"
    };

    const checkedHandleIconStyle = {
      height: this.$handleDiameter,
      width: this.$handleDiameter,
      opacity: Math.max(
        (($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos) -
          0.5) *
          2,
        0
      ),
      position: "absolute",
      left: 0,
      top: 0,
      pointerEvents: "none",
      WebkitTransition: $isDragging ? null : "opacity 0.25s",
      MozTransition: $isDragging ? null : "opacity 0.25s",
      transition: $isDragging ? null : "opacity 0.25s"
    };

    const inputStyle = {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: 1
    };

    return (
      <div className={className} style={rootStyle}>
        <div
          className="react-switch-bg"
          style={backgroundStyle}
          onClick={disabled ? null : this.$onClick}
          onMouseDown={e => e.preventDefault()}
        >
          {checkedIcon && <div style={checkedIconStyle}>{checkedIcon}</div>}
          {uncheckedIcon && (
            <div style={uncheckedIconStyle}>{uncheckedIcon}</div>
          )}
        </div>
        <div
          className="react-switch-handle"
          style={handleStyle}
          onClick={e => e.preventDefault()}
          onMouseDown={disabled ? null : this.$onMouseDown}
          onTouchStart={disabled ? null : this.$onTouchStart}
          onTouchMove={disabled ? null : this.$onTouchMove}
          onTouchEnd={disabled ? null : this.$onTouchEnd}
          onTouchCancel={disabled ? null : this.$unsetHasOutline}
        >
          {uncheckedHandleIcon && (
            <div style={uncheckedHandleIconStyle}>{uncheckedHandleIcon}</div>
          )}
          {checkedHandleIcon && (
            <div style={checkedHandleIconStyle}>{checkedHandleIcon}</div>
          )}
        </div>
        <input
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          style={inputStyle}
          {...rest}
          /* anything below should NOT get overriden by ...rest */
          ref={this.$getInputRef}
          onFocus={this.$setHasOutline}
          onBlur={this.$unsetHasOutline}
          onKeyUp={this.$onKeyUp}
          onChange={this.$onInputChange}
        />
      </div>
    );
  }
}
ReactSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  offColor: hexColorPropType,
  onColor: hexColorPropType,
  offHandleColor: hexColorPropType,
  onHandleColor: hexColorPropType,
  handleDiameter: PropTypes.number,
  uncheckedIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  checkedIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  boxShadow: PropTypes.string,
  borderRadius: PropTypes.number,
  activeBoxShadow: PropTypes.string,
  uncheckedHandleIcon: PropTypes.element,
  checkedHandleIcon: PropTypes.element,
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
  className: PropTypes.string
};

ReactSwitch.defaultProps = {
  disabled: false,
  offColor: "#888",
  onColor: "#080",
  offHandleColor: "#fff",
  onHandleColor: "#fff",
  uncheckedIcon: defaultUncheckedIcon,
  checkedIcon: defaultCheckedIcon,
  boxShadow: null,
  activeBoxShadow: "0 0 2px 3px #3bf",
  height: 28,
  width: 56
};

export default ReactSwitch;
