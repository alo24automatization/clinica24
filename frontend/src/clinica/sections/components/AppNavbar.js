import { ChevronDownIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  toast,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import AloLogo from "../../../clinica_logo.jpg";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";

const AppNavbar = ({ links, user, userType }) => {
  const [menuOpen, setMenuOpen] = useState(false); // Sidebar control for mobile
  const [activeMenu, setActiveMenu] = useState(null); // Control for submenu
  const { t } = useTranslation();
  const [baseUrl, setBaseUrl] = useState();
  const { request } = useHttp();
  const history = useHistory();

  const notify = useCallback((data) => {
    toast({
      title: data.title && data.title,
      description: data.description && data.description,
      status: data.status && data.status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  }, []);

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request("/api/baseurl", "GET", null);
      setBaseUrl(data.baseUrl);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  const [s, setS] = useState();
  useEffect(() => {
    if (!s) {
      setS(1);
      getBaseUrl();
    }
  }, [getBaseUrl, s]);

  // Toggle sidebar
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [menuOpen]);

  // Toggle submenu for mobile
  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const auth = useContext(AuthContext);
  const { request: appearanceRequest } = useHttp();
  const [appearanceFields, setAppearanceFields] = useState({});
  const getAppearanceFields = async () => {
    try {
      const data = await appearanceRequest(
        `/api/clinica/appearanceFields/${auth.clinica._id}`,
        "GET",
        null
      );
      setAppearanceFields(data.appearanceFields);
    } catch (error) {
      console.log("Appearance settings get error", error);
    }
  };

  useEffect(() => {
    if (auth?.clinica?._id) {
      getAppearanceFields();
    }
  }, [auth?.clinica?._id]);

  const mobileIconClass = useBreakpointValue({
    base: "block",
    md: "hidden",
  });
  // console.log(
  //   userType.type === "director" ? userType.appearanceFields : appearanceFields
  // );
  return (
    <Box
      as="nav"
      className="bg-white shadow-md mt-2 cashier_navbar mx-auto rounded-lg"
    >
      <Flex h={14} alignItems="center" justifyContent="space-between">
        {/* Mobile: Menu toggle button */}
        <div className={`pl-2 ${mobileIconClass}`}>
          <IconButton
            size="md"
            icon={menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            display={{ md: "none" }}
            onClick={toggleMenu}
          />
        </div>

        {/* Desktop: Horizontal Navbar */}
        <Flex
          display={{ base: "none", md: "flex" }}
          alignItems={"center"}
          className="font-medium text-gray-600 space-x-1 pl-2"
        >
          <div>
            <img src={AloLogo} alt="logo" className="w-[100px]" />
          </div>
          {links.map((link) => {
            return (
              <NavbarItemDesktop
                key={link.name}
                link={link}
                allowedToShow={(link) =>
                  link.showWhen ? link.showWhen(appearanceFields) : true
                }
              />
            );
          })}
        </Flex>

        {/* User profile */}
        <ul className="header-actions py-1 pr-2">
          <li className="dropdown">
            <span
              id="userSettings"
              className="user-settings"
              data-toggle="dropdown"
              aria-haspopup="true"
            >
              <span className="avatar md">
                {baseUrl ? (
                  <img
                    className="circle d-inline"
                    src={baseUrl && `${baseUrl}/api/upload/file/${user.image}`}
                    alt={user?.firstname + user?.lastname}
                  />
                ) : (
                  user.firstname + user.lastname
                )}

                <span className="status busy" />
              </span>
            </span>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="userSettings"
            >
              <div className="header-profile-actions">
                <div className="header-user-profile">
                  <div className="header-user">
                    <img
                      src={
                        baseUrl && `${baseUrl}/api/upload/file/${user.image}`
                      }
                      alt={user.firstname + user.lastname}
                    />
                  </div>
                  {user.firstname} {user.lastname}
                  <p>Reseption</p>
                </div>
                <button
                  onClick={() => {
                    auth.logout();
                    history.push("/");
                  }}
                >
                  <i className="icon-log-out1" /> {t("Chiqish")}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </Flex>

      {/* Mobile: Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: menuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="md:hidden fixed overflow-y-auto top-0 left-0 w-full h-full bg-white shadow-lg z-50"
      >
        <div className="text-right pt-6 pr-4">
          <IconButton
            size="md"
            icon={menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            display={{ md: "none" }}
            onClick={toggleMenu}
          />
        </div>
        <VStack as="ul" pt={8} px={1} spacing={4}>
          {links.map((link, index) => (
            <NavbarItemMobile
              setMenuOpen={setMenuOpen}
              toggleSubMenu={toggleSubMenu}
              activeMenu={activeMenu}
              key={link.name}
              allowedToShow={(a) =>
                a.showWhen ? a.showWhen(appearanceFields) : true
              }
              link={link}
              index={index}
            />
          ))}
        </VStack>
      </motion.div>

      {/* Backdrop to close sidebar */}
      {menuOpen && (
        <Box
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
    </Box>
  );
};

function NavbarItemDesktop({ link, allowedToShow }) {
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

// {link.submenu?.length > 0 && <ChevronDownIcon fontSize={20} />}
function NavbarItemMobile({
  link,
  index,
  toggleSubMenu,
  setMenuOpen,
  activeMenu,
  allowedToShow,
}) {
  const history = useHistory();
  const loc = useLocation();
  const show = allowedToShow(link);

  return show ? (
    <Box className={`w-full text-left`}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={
          activeMenu === index ? "bg-alotrade text-white rounded-lg" : ""
        }
        px={4}
        py={2}
        onClick={() => {
          toggleSubMenu(index);
          if (!link.submenu) {
            history.push(link.to);
            setMenuOpen(false);
          }
        }}
      >
        <span className="text-lg">{link.name}</span>
        {link.submenu?.length > 0 && <ChevronDownIcon fontSize={20} />}
      </Box>

      <Collapse
        in={activeMenu === index && link.submenu?.length > 0}
        animateOpacity
      >
        {link.submenu &&
          link.submenu.length > 0 &&
          link.submenu.map((l, i) => (
            <NavbarItemMobileSub
              allowedToShow={allowedToShow}
              setMenuOpen={setMenuOpen}
              key={l.name}
              link={l}
              index={i}
            />
          ))}
      </Collapse>
    </Box>
  ) : null;
}

function NavbarItemMobileSub({ link, setMenuOpen, index, allowedToShow }) {
  const [activeMenuSub, setActiveMenuSub] = useState(false);
  const history = useHistory();
  const loc = useLocation();
  const show = allowedToShow(link);

  const toggleSubMenu = (index) => {
    setActiveMenuSub(activeMenuSub === index ? null : index);
  };

  return show ? (
    <VStack mt={2} pl={6} align="start">
      <Box className={`w-full text-left`}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          // className={`w-full px-4 py-2 text-left rounded-lg ${
          //   loc.pathname === subSub.to ? "bg-alotrade text-white" : ""
          // }`}
          className={
            !link.submenu && loc.pathname === link.to
              ? "bg-alotrade text-white rounded-lg"
              : ""
          }
          px={4}
          py={2}
          onClick={() => {
            toggleSubMenu(activeMenuSub === index ? null : index);
            if (!link.submenu) {
              history.push(link.to);
              setMenuOpen(false);
            }
          }}
        >
          <span className="text-lg">{link.name}</span>
          {link.submenu?.length > 0 && <ChevronDownIcon fontSize={20} />}
        </Box>

        <Collapse
          in={activeMenuSub === index && link.submenu?.length > 0}
          animateOpacity
        >
          {link.submenu &&
            link.submenu.length > 0 &&
            link.submenu.map((subSub) => {
              const show = allowedToShow(subSub);
              return show ? (
                <VStack key={subSub.name} mt={2} pl={6} align="start">
                  <Box
                    onClick={() => {
                      history.push(subSub.to);
                      setMenuOpen(false);
                    }}
                    key={subSub.name}
                    className={`w-full px-4 py-2 text-left rounded-lg ${
                      loc.pathname === subSub.to ? "bg-alotrade text-white" : ""
                    }`}
                  >
                    {subSub.name}
                  </Box>
                </VStack>
              ) : null;
            })}
        </Collapse>
      </Box>
    </VStack>
  ) : null;
}

export default AppNavbar;
