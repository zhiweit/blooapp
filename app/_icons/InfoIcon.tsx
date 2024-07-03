import React from "react";

type InfoIconProps = {
  onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onMouseEnter: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onMouseLeave: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
};
export const InfoIcon = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
}: InfoIconProps) => (
  <svg
    data-name="Layer 1"
    onClick={onClick}
    className="inline"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    stroke="#1e81b0"
    strokeWidth={0.1}
  >
    <path
      d="M12,2A10,10,0,1,0,22,12,10.01114,10.01114,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20Zm0-8.5a1,1,0,0,0-1,1v3a1,1,0,0,0,2,0v-3A1,1,0,0,0,12,11.5Zm0-4a1.25,1.25,0,1,0,1.25,1.25A1.25,1.25,0,0,0,12,7.5Z"
      fill="#1e81b0"
    />
  </svg>
);
