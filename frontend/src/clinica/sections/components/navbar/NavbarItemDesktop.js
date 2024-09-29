import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

export function NavbarItemDesktop({ link, allowedToShow }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const loc = useLocation();
  const show = allowedToShow(link);

  let menuItemClasses = "";
  if (Array.isArray(link.activeWhen)) {
    if (link.activeWhen.includes(loc.pathname))
      menuItemClasses = `bg-alotrade text-white`;
  } else if (loc.pathname === link.to) {
    menuItemClasses += `bg-alotrade text-white`;
  } else {
    menuItemClasses += "text-black";
  }

  return show ? (
    <Menu isOpen={isOpen}>
      <MenuButton
        variant="ghost"
        mx={1}
        className={`${menuItemClasses} hover:bg-alotrade hover:text-white`}
        py={[1, 2, 2]}
        px={4}
        borderRadius={5}
        aria-label="Submenus"
        fontWeight="normal"
        onClick={() => history.push(link.to)}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        <Link className="flex items-center" to={link.to}>
          <i className="icon-devices_other nav-icon mr-2 text-[16px]" />
          {link.name}
        </Link>
      </MenuButton>

      {/* Submenu on larger devices */}
      {link.submenu && link.submenu.length > 0 && (
        <div className="z-10">
          <MenuList
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            className="absolute left-0 mt-[-10px] w-48 bg-alotrade shadow-lg rounded-md"
            display={{ base: "none", md: "block" }}
          >
            {link.submenu.map((subMenu) => {
              const showSubMenu = allowedToShow(subMenu);

              return showSubMenu ? (
                subMenu.submenu ? (
                  <NavbarItemDesktopSub
                    key={subMenu.name}
                    item={subMenu}
                    allowedToShow={allowedToShow}
                  />
                ) : (
                  <MenuItem
                    key={subMenu.name}
                    bg="transparent"
                    onClick={() => history.push(subMenu.to)}
                    className="px-4 py-2 hover:bg-alotrade"
                    _focus={{ bg: "bg-alotrade" }}
                    _active={{ bg: "bg-alotrade" }}
                  >
                    {subMenu.name}
                  </MenuItem>
                )
              ) : null;
            })}
          </MenuList>
        </div>
      )}
    </Menu>
  ) : null;
}

function NavbarItemDesktopSub({ item, allowedToShow }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const history = useHistory();

  return (
    <Menu placement="right-start" isOpen={isOpen}>
      <MenuButton
        key={item.name}
        bg="transparent"
        onClick={() => history.push(item.to)}
        className={`px-4 py-2 hover:bg-alotrade w-full text-black`}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        _focus={{ bg: "bg-alotrade" }}
        _active={{ bg: "bg-alotrade" }}
      >
        <Link className="flex items-center text-black" to={item.to}>
          {item.name}
        </Link>
      </MenuButton>

      <MenuList
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        className="absolute left-[-10px] mt-[-10px] w-48 bg-alotrade shadow-lg rounded-md"
        display={{ base: "none", md: "block" }}
      >
        {item.submenu.map((subSubMenu) => {
          const showSubMenu = allowedToShow(subSubMenu);
          return showSubMenu ? (
            <MenuItem
              key={subSubMenu.name}
              bg="transparent"
              onClick={() => history.push(subSubMenu.to)}
              className="px-4 py-2 hover:bg-alotrade text-black"
              _focus={{ bg: "bg-alotrade" }}
              _active={{ bg: "bg-alotrade" }}
            >
              {subSubMenu.name}
            </MenuItem>
          ) : null;
        })}
      </MenuList>
    </Menu>
  );
}
