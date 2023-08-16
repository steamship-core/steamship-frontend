import { useId } from 'react';

import { InstallationIcon } from '@/components/markdown/icons/InstallationIcon';
import { LightbulbIcon } from '@/components/markdown/icons/LightbulbIcon';
import { PluginsIcon } from '@/components/markdown/icons/PluginsIcon';
import { PresetsIcon } from '@/components/markdown/icons/PresetsIcon';
import { ThemingIcon } from '@/components/markdown/icons/ThemingIcon';
import { WarningIcon } from '@/components/markdown/icons/WarningIcon';

const icons = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon
};

const iconStyles = {
  blue: '[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]',
  amber: '[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]'
};

export function Icon({ color = 'blue', icon, className, ...props }) {
  let id = useId();
  let IconComponent = icons[icon];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={`${className} ${iconStyles[color]}`}
      {...props}
    >
      <IconComponent id={id} color={color} />
    </svg>
  );
}