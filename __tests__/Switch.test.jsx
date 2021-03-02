import React from "react";
import { shallow, render } from "enzyme";
import toJson from "enzyme-to-json";
import Switch from "../src";

const noop = () => {};

describe("Props", () => {
  it("matches snapshot with default props", () => {
    const wrapper = render(<Switch checked={false} onChange={noop} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("matches snapshot with custom props", () => {
    const wrapper = render(
      <Switch
        checked
        onChange={noop}
        disabled
        onColor="#abc"
        offHandleColor="#def"
        handleDiameter={9}
        checkedIcon={
          <div
            style={{
              color: "pink",
              paddingTop: 2,
              paddingLeft: 6,
              fontSize: 20
            }}
          >
            ❤
          </div>
        }
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        height={13}
        width={37}
        className="qux"
        id="foo"
        aria-labelledby="baz"
        aria-label="bar"
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("matches snapshot with horizontal switch", () => {
    const wrapper = render(
      <Switch
        checked
        onChange={noop}
        disabled
        onColor="#abc"
        offHandleColor="#def"
        handleDiameter={9}
        checkedIcon={
          <div
            style={{
              color: "pink",
              paddingTop: 2,
              paddingLeft: 6,
              fontSize: 20
            }}
          >
            ❤
          </div>
        }
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        height={37}
        width={13}
        className="qux"
        id="foo"
        aria-labelledby="baz"
        aria-label="bar"
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("handle", () => {
  it("sets a boxShadow on focus and loses it on blur", () => {
    const wrapper = shallow(<Switch onChange={noop} checked={false} />);
    wrapper.find("input").simulate("focus");
    expect(
      wrapper.find(".react-switch-handle").get(0).props.style.boxShadow
    ).toBe("0 0 2px 3px #3bf");
    wrapper.find("input").simulate("blur");
    expect(
      wrapper.find(".react-switch-handle").get(0).props.style.boxShadow
    ).toBeNull();
  });

  it("doesn't call onChange on some other key", () => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(<Switch onChange={mockOnChange} checked={false} />);
    wrapper.find("input").simulate("focus");
    wrapper
      .find("input")
      .simulate("keydown", { keyCode: 14, preventDefault: noop });
    expect(mockOnChange).not.toBeCalled();
  });
});

describe("checked prop", () => {
  it("affects transform style when it changes", () => {
    const wrapper = shallow(<Switch onChange={noop} checked={false} />);
    wrapper.setProps({ checked: true });
    expect(
      wrapper.find(".react-switch-handle").get(0).props.style.transform
    ).toBe("translateX(29px)");
    wrapper.setProps({ checked: false });
    expect(
      wrapper.find(".react-switch-handle").get(0).props.style.transform
    ).toBe("translateX(1px)");
  });

  it("affects background when it changes", () => {
    const wrapper = shallow(
      <Switch
        onChange={noop}
        checked={false}
        offColor="#aabbcc"
        onColor="#ddeeff"
      />
    );
    wrapper.setProps({ checked: true });
    expect(wrapper.find(".react-switch-bg").get(0).props.style.background).toBe(
      "#ddeeff"
    );
    wrapper.setProps({ checked: false });
    expect(wrapper.find(".react-switch-bg").get(0).props.style.background).toBe(
      "#aabbcc"
    );
  });
});

// Test dragging behaviour
/*
describe("drag related behaviour", () => {
  it("triggers onChange callback when isDragging is never set to true", () => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(<Switch onChange={mockOnChange} checked={false} />);
    wrapper
      .find("input")
      .simulate("touchstart", { touches: [{ clientX: 100 }] });
    wrapper.find("input").simulate("touchend", { preventDefault: noop });
    expect(mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]).toBe(
      true
    );
  });
  it("triggers onChange when handle is dragged half way or more", () => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(
      <Switch onChange={mockOnChange} checked={false} height={15} width={30} />
    );
    wrapper
      .find("input")
      .simulate("touchstart", { touches: [{ clientX: 100 }] });
    wrapper
      .find("input")
      .simulate("touchmove", { touches: [{ clientX: 107.5 }] });
    wrapper.find("input").simulate("touchend", { preventDefault: noop });
    expect(mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]).toBe(
      true
    );
  });
  it("doesn't trigger onChange when handle is dragged less than half way", () => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(
      <Switch onChange={mockOnChange} checked={false} height={15} width={30} />
    );
    wrapper
      .find("input")
      .simulate("touchstart", { touches: [{ clientX: 100 }] });
    wrapper
      .find("input")
      .simulate("touchmove", { touches: [{ clientX: 107.4 }] });
    wrapper.find("input").simulate("touchend", { preventDefault: noop });
    expect(mockOnChange).not.toBeCalled();
  });
});
*/
