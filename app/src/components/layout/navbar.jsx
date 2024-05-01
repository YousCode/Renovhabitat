import { Fragment, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { VscMenu } from "react-icons/vsc";
import { AiOutlineClose } from "react-icons/ai";

import { setUser } from "src/redux/auth/actions";
import api from "src/services/api";

export const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navMenu = [
    {
      name: t("menu.dashboard"),
      path: "/",
    },
    // {
    //   name: t("projects"),
    //   path: "/projects",
    // },
    // {
    // //   name: t("menu.team"),
    // //   path: "/equipe",
    // // },
  ];

  async function logout() {
    await api.post(`/user/logout`);
    dispatch(setUser(null));
  }

  return (
    <nav className="bg-app-navbar">
      <div className="container flex items-center justify-between py-4">
        <DesktopMenu navMenu={navMenu} />
        <MobileMenu navMenu={navMenu} />

        <Menu as="div" className="relative inline-block text-left z-50">
          <div>
            <Menu.Button className="lg:w-12 w-9 lg:h-12 h-9 rounded-full bg-app flex items-center justify-center">
              <img
                src={require("src/assets/avatar.png")}
                className="w-9 h-9"
                alt="Avatar"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-app-accent">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/account"
                      className={`${
                        active && "bg-[#231156]"
                      } group flex w-full items-center rounded-md px-2 py-1 text-white transition-colors text-sm font-semibold`}
                    >
                      {t("menu.account")}
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && "bg-[#231156]"
                      } group flex w-full items-center rounded-md px-2 py-1 text-white transition-colors text-sm font-semibold`}
                      onClick={logout}
                    >
                      {t("menu.sign_out")}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

const DesktopMenu = ({ navMenu }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* <Link to="/" className="hidden lg:block">
      <img src={require("src/assets/LogoRenove.png")} alt="Neo renov" />
       </Link> */}

      <ul className="lg:flex hidden items-center gap-6">
        {navMenu.map((item, index) => (
          <li key={index}>
            <NavLink
              exact={item.path === "/"}
              to={item.path}
              className="text-white font-bold relative px-7 py-5"
              activeClassName="[&>div]:opacity-100"
            >
              {item.name}
              <div className="w-full h-0.5 bg-details-secondary absolute -bottom-[10px] opacity-0 transition-colors" />
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to="/explorer"
            className="text-gradient font-bold flex items-center gap-x-1 relative"
            activeClassName="[&>div]:opacity-100"
          >
            {t("menu.explorer")}
            <span className="align-super text-[#C2A6FF] text-[7px] mb-2">
              {" "}
              {t("menu.beta")}
            </span>
            <div className="w-full h-0.5 bg-details-secondary absolute -bottom-[30px] opacity-0 transition-colors" />
          </NavLink>
        </li>
      </ul>
    </>
  );
};

const MobileMenu = ({ navMenu }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <button
        className="text-white block lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <VscMenu size={20} />
      </button>
      <Transition.Root show={isSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setIsSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <AiOutlineClose
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-app-navbar px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                      {/*
                    <img
                      src={require("src/assets/LogoRenove.png")}
                      alt="Neo renov"
                      />
                      */}

                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navMenu.map((item, i) => (
                            <li key={i}>
                              <NavLink
                                to={item.path}
                                exact={item.path === "/"}
                                className="w-full py-2 text-white block px-4 rounded-md font-bold bg-app-accent transition-colors relative overflow-hidden"
                                activeClassName="!bg-app [&>span]:opacity-100"
                              >
                                <span className="w-0.5 h-full absolute left-0 top-1/2 -translate-y-1/2 bg-details-secondary opacity-0 transition-opacity" />
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};