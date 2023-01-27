import { CheckBox, CheckBoxExtendedProps } from 'grommet';

export type ToggleProps = Omit<CheckBoxExtendedProps, 'toggle'>;

export function Toggle(props: ToggleProps) {
  return <CheckBox {...props} toggle />;
}
