import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setUser } from "../redux/auth/actions";
import api from "../services/api";
import { Menu, Transition } from "@headlessui/react";

const Header = ({}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  const handleLogout = async () => {
    try {
      const res = await api.post(`/user/logout`);
      if (!res.ok) throw new Error("Something went wrong");
      dispatch(setUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-6 py-2 bg-white border-b flex justify-between items-center w-full">
      <h1 className="font-bold m-0 text-3xl text-primary">
        <Link to="/">
          Kolab
          <small className="block text-base">Administration</small>
        </Link>
      </h1>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-x-2">
          <img className="w-9 h-9 bg-gray-700 rounded-full cursor-pointer object-cover" src={user.avatar} />
          <p className="capitalize text-black-100">{user.name}</p>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-sidebar ring-1 ring-gray-900/5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <Link to="/account" className={`${active ? "bg-gray-50" : ""} block px-3 py-1 text-sm leading-6 text-gray-900`}>
                  My Account
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={handleLogout}
                  className={`${active ? "bg-gray-50" : ""} cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900 w-full`}
                >
                  Sign Out
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Header;
