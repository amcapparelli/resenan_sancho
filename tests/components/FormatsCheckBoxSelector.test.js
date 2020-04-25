/* eslint-disable jest/no-disabled-tests */
/* eslint-disable react/react-in-jsx-scope */
import { fireEvent } from '@testing-library/react';
import { create } from 'react-test-renderer';
import {
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Checkbox,
} from '@material-ui/core';
import { FormatsCheckBoxSelector } from '../../src/components';

describe('FormatsCheckBoxSelector Component', () => {
  test('show options', () => {
    const options = ['option1', 'option2'];
    const formatsSelected = [];
    const { root } = create(
      <FormatsCheckBoxSelector
        options={options}
        formatsSelected={formatsSelected}
      />,
    );
    const formControlLabel = root.findAllByType(FormControlLabel);
    expect(formControlLabel).toHaveLength(options.length);
  });
  test('has title prop', () => {
    const options = ['option1', 'option2'];
    const title = 'titleTest';
    const formatsSelected = [];
    const { root } = create(
      <FormatsCheckBoxSelector
        options={options}
        title={title}
        formatsSelected={formatsSelected}
      />,
    );
    const formLabel = root.findByType(FormLabel);
    expect(formLabel.props.children).toBe('titleTest');
  });
  test('shows errors', () => {
    const options = ['option1', 'option2'];
    const errors = 'errorsTest';
    const formatsSelected = [];
    const { root } = create(
      <FormatsCheckBoxSelector
        options={options}
        errors={errors}
        formatsSelected={formatsSelected}
      />,
    );
    const formHelperText = root.findByType(FormHelperText);
    expect(formHelperText.props.children).toBe('errorsTest');
  });
  test.skip('on select funcion', () => {
    const options = ['option1', 'option2'];
    const mockFn = jest.fn();
    const { root } = create(<FormatsCheckBoxSelector options={options} onChange={mockFn} />);
    const checkBox = root.findAllByType(Checkbox);
    fireEvent.click(checkBox[0]);
    expect(mockFn).toHaveBeenCalled();
  });
});
