import React from 'react';
import { shallow, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import Switch from '../src';

const noop = () => {};

describe('Props', () => {
  it('matches snapshot with default props', () => {
    const wrapper = render(<Switch onChange={noop} checked={false} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot with custom props', () => {
    const wrapper = render(
      <Switch
        onChange={noop}
        checked
        disabled
        onColor="#abc"
        handleColor="#def"
        height={13}
        width={37}
        id="foo"
        aria-label="bar"
        aria-labelledby="baz"
        className="qux"
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('onClick', () => {
  it('calls onChange when fg is clicked with !checked as argument', () => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(<Switch onChange={mockOnChange} checked={false} />);
    wrapper.find('.react-switch-fg').simulate('click');
    expect(mockOnChange.mock.calls[0][0]).toBe(true);
  });

  it('does not call onChange when disabled', () => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(<Switch onChange={mockOnChange} checked={false} disabled />);
    wrapper.find('.react-switch-fg').simulate('click');
    expect(mockOnChange.mock.calls.length).toBe(0);
  });
});

describe('handle', () => {
  it('sets a boxShadow on focus and loses it on blur', () => {
    const wrapper = shallow(<Switch onChange={noop} checked={false} />);
    wrapper.find('.react-switch-handle').simulate('focus');
    expect(wrapper.find('.react-switch-handle').get(0).props.style.boxShadow).toBe('0px 0px 1px 2px #4D90FE');
    wrapper.find('.react-switch-handle').simulate('blur');
    expect(wrapper.find('.react-switch-handle').get(0).props.style.boxShadow).toBeNull();
  });

  it('calls onChange and prevent default on spacebar but not on any other key', () => {
    const mockOnChange = jest.fn();
    const mockPreventDefault = jest.fn();
    const wrapper = shallow(<Switch onChange={mockOnChange} checked={false} />);
    wrapper.find('.react-switch-handle').simulate('focus');
    wrapper.find('.react-switch-handle').simulate('keydown', { keyCode: 32, preventDefault: mockPreventDefault });
    expect(mockPreventDefault.mock.calls.length).toBe(1);
    expect(mockOnChange.mock.calls[0][0]).toBe(true);
    wrapper.find('.react-switch-handle').simulate('keydown', { keyCode: 13, preventDefault: mockPreventDefault });
    expect(mockPreventDefault.mock.calls.length).toBe(1);
    expect(mockOnChange.mock.calls.length).toBe(1);
  });
});
