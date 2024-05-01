import React from "react";
import Tooltip from "react-tooltip";
import { ImInfo } from "react-icons/im";

export default ({ id, description, iconClass = "text-black", Icon }) => {
  return (
    <div className="inline align-middle p-[1px]">
      <Tooltip
        id={id}
        effect="solid"
        className="max-w-xs text-sm shadow-md keepOpacity"
        backgroundColor="#fff"
        textColor="#000"
      />
      <span data-for={id} data-tip={description}>
        {Icon ? (
          <Icon className={`${iconClass} text-base cursor-pointer`} />
        ) : (
          <ImInfo className={`${iconClass} text-base cursor-pointer`} />
        )}
      </span>
    </div>
  );
};
