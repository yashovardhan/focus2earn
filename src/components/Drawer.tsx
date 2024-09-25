import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

import UserProfile from "../components/UserProfile";

interface DrawerProps {
  isOpen: boolean;
  setOpen: any;
}
const Drawer = ({ isOpen, setOpen }: DrawerProps) => {
  const { logout } = useWeb3Auth();

  if (isOpen) {
    return (
      <div className="fixed flex w-full h-full  lg:hidden">
        <div onClick={() => setOpen(false)} className="w-full h-full bg-black/[.4]"></div>
        <div className="flex right-0 flex-col justify-between h-screen p-5 bg-white w-80">
          <div className="py-2">
            <strong className="px-4 block p-1 text-xs font-medium text-gray-400 uppercase">MENU</strong>
            <div
              onClick={() => {
                setOpen(false);
                logout({ cleanup: true });
              }}
              className="flex items-center px-4 py-2 mb-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary  cursor-pointer"
            >
              <span className="text-sm font-normal">Disconnect</span>
            </div>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return null;
};

export default Drawer;
