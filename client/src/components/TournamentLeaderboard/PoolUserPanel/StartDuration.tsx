import { Text, TextExtendedProps } from 'grommet';
import { DateTime } from 'luxon';

export interface StartDurationProps extends TextExtendedProps {
  time: DateTime | null;
}

export function StartDuration({ time, ...textProps }: StartDurationProps) {
  if (!time) {
    return <Text {...textProps}>Not Started</Text>;
  }

  const duration = time.diffNow().rescale();

  let output = '';

  if (duration.minutes <= 0) {
    output = 'Teeing off';
  } else {
    output = `${duration.minutes}m`;
    if (duration.hours > 0) {
      output = `${duration.hours}h ${output}`;
    }
    output = `Tees off in ${output}`;
  }

  return <Text {...textProps}>{output}</Text>;
}
