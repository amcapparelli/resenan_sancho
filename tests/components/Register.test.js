/* eslint-disable react/react-in-jsx-scope */
import { create, act } from 'react-test-renderer';
import {
  TextField,
  Button,
  FormHelperText,
} from '@material-ui/core';
import Register from '../../src/pages/register';

describe('Register Component', () => {
  test.skip('it renders five inputs fields', () => {
    const { root } = create(<Register />);
    const formInputs = root.findAllByType(TextField);
    expect(formInputs).toHaveLength(5);
  });
  test.skip('button click without password values', () => {
    const { root } = create(<Register />);
    const button = root.findByType(Button);
    const formHelperText = root.findByType(FormHelperText);
    act(() => button.props.onClick());
    expect(formHelperText.props.children).toBe('la contraeña no es válida');
  });
});
