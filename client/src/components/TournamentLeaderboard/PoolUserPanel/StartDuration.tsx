import { Text, TextExtendedProps } from 'grommet';
import { DateTime } from 'luxon';

export interface StartDurationProps extends TextExtendedProps {
  time: DateTime;
}

export function StartDuration({ time, ...textProps }: StartDurationProps) {
  const duration = time.diffNow().rescale();

  let output = `${duration.minutes}m`;

  if (duration.hours > 0) {
    output = `${duration.hours}h ${output}`;
  }

  return <Text {...textProps}>{output}</Text>;
}
