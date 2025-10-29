import React from 'react';
import { ICONS } from './icons';

export type IconName = keyof typeof ICONS;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: IconName;
}

export const Icon: React.FC<IconProps> = ({ icon, ...props }) => {
  const iconData = ICONS[icon];
  if (!iconData) {
    console.warn(`Icon "${icon}" not found.`);
    return null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {iconData}
    </svg>
  );
};
