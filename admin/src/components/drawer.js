import React from "react";
import { NavLink } from "react-router-dom";
import { BiSolidCog } from "react-icons/bi";
import { BsBuildings, BsPeopleFill } from "react-icons/bs";

const Drawer = ({ open }) => {
  return (
    <div className="sticky flex flex-col flex-shrink-0 overflow-y-auto inset-y-0 bg-black-10 py-8 px-3 w-48">
      <ul className="list-none z-10 space-y-5 translate-x-0 w-full">
        <Link to="/workspace" title="Workspaces" Icon={BsBuildings} />
        <Link to="/user" title="Utilisateurs" Icon={BsPeopleFill} />
      </ul>
      <NavLink
        to="/administration"
        className="mt-auto inline-flex text-sm text-black-90 hover:text-primary space-x-3 items-center"
        activeClassName="!text-primary !fill-primary hover:text-primary"
      >
        <BiSolidCog className="text-xl" />
        <span className="font-bold">Administration</span>
      </NavLink>
    </div>
  );
};

const Link = ({ Icon, title, to, onClick = () => {}, ...rest }) => {
  return (
    <li>
      <NavLink
        onClick={onClick}
        {...rest}
        className="flex items-center gap-x-4 font-bold transition-colors text-gray-400"
        to={to}
        activeClassName="!text-primary !fill-primary hover:text-primary"
      >
        {Icon && <Icon />}
        <span className="text-sm">{title}</span>
      </NavLink>
    </li>
  );
};

export default Drawer;
