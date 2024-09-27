import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  VStack,
  Collapse,
  useDisclosure,
  MenuList,
  Menu,
  MenuItem,
  useColorModeValue,
  MenuButton,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AloLogo from "../../../../clinica_logo.jpg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Sidebar control for mobile
  const [activeMenu, setActiveMenu] = useState(null); // Control for submenu
  const { t } = useTranslation();
  const links = [
    { name: t("Kunduzgi"), to: "/alo24", index: true },
    { name: t("Statsionar"), to: "/alo24/statsionar" },
    { name: t("Online"), to: "/alo24/online" },
    {
      name: t("Kassa"),
      to: "#",
      activeWhen: [
        "/alo24/cashier",
        "/alo24/cashier_statsionar",
        "/alo24/cashier_discount",
        "/alo24/cashier_expense",
        "/alo24/cashier_debt",
      ],
      submenu: [
        { name: t("Kunduzgi"), to: "/alo24/cashier" },
        { name: t("Statsionar"), to: "/alo24/cashier_statsionar" },
        { name: t("Chegirma"), to: "/alo24/cashier_discount" },
        { name: t("Qarz"), to: "/alo24/cashier_debt" },
        { name: t("Xarajat"), to: "/alo24/cashier_expense" },
      ],
    },
  ];

  // Toggle sidebar
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Toggle submenu for mobile
  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const history = useHistory();
  const toast = useToast();

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

  const { request } = useHttp();
  const auth = useContext(AuthContext);

  const user = auth.user;
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [baseUrl, setBaseUrl] = useState();

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
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [s, setS] = useState();
  useEffect(() => {
    if (!s) {
      setS(1);
      getBaseUrl();
    }
  }, [getBaseUrl, s]);
  const loc = useLocation();
  //====================================================================
  //====================================================================
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

  return (
    <Box
      as="nav"
      className="bg-white shadow-md mt-2 max-w-[calc(100%-6rem)] mx-auto rounded-lg"
    >
      {/* <div className=""></div> */}
      <Flex
        h={14}
        alignItems="center"
        justifyContent="space-between"
        // className="max-w-7xl mx-auto"
      >
        {/* Mobile: Menu toggle button */}
        <IconButton
          size="md"
          icon={menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Menu"
          display={{ md: "none" }}
          onClick={toggleMenu}
        />

        {/* Desktop: Horizontal Navbar */}
        <Flex
          display={{ base: "none", md: "flex" }}
          alignItems={"center"}
          className="font-medium text-gray-600 space-x-1"
        >
          <div>
            <img src={AloLogo} alt="logo" className="w-[100px]" />
          </div>
          {links.map((link) => (
            <NavbarItem link={link} key={link.name} />
          ))}
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
              {/* <span className="user-name">
                {user.firstname} {user.lastname}
              </span> */}
              <span className="avatar md">
                {baseUrl ? (
                  <img
                    className="circle d-inline"
                    src={baseUrl && `${baseUrl}/api/upload/file/${user.image}`}
                    // alt={user.firstname + user.lastname}
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
        className="md:hidden fixed  top-0 left-0 w-full h-full bg-white shadow-lg z-50"
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
        <VStack as="ul" pt={8} spacing={4}>
          {links.map((link, index) => (
            <Box
              key={index}
              className={`w-full text-left ${activeMenu === index ? "" : ""}`}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                className={activeMenu === index ? "bg-alotrade text-white" : ""}
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
                <VStack mt={2} pl={6} align="start">
                  {link.submenu?.map((submenuItem) => (
                    <Box
                      onClick={() => {
                        history.push(submenuItem.to);
                        setMenuOpen(false);
                      }}
                      key={submenuItem.name}
                      className={`w-full px-4 py-2 text-left ${
                        loc.pathname === submenuItem.to
                          ? "bg-alotrade text-white"
                          : ""
                      }`}
                    >
                      {submenuItem.name}
                    </Box>
                  ))}
                </VStack>
              </Collapse>
            </Box>
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

export default Navbar;

function NavbarItem({ link }) {
  const loc = useLocation();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  let menuItemClasses = "";
  if (Array.isArray(link.activeWhen)) {
    if (link.activeWhen.includes(loc.pathname))
      menuItemClasses = `bg-alotrade text-white`;
  } else if (loc.pathname === link.to) {
    menuItemClasses += `bg-alotrade text-white`;
  } else {
    menuItemClasses += "text-black";
  }

  return (
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
        <MenuList
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          className="absolute left-0 mt-[-10px] w-48 bg-alotrade shadow-lg rounded-md z-50"
          display={{ base: "none", md: "block" }}
        >
          {link.submenu.map((submenuItem) => (
            <MenuItem
              key={submenuItem.name}
              bg="transparent"
              onClick={() => history.push(submenuItem.to)}
              className="px-4 py-2 hover:bg-alotrade hover:text-white"
              _focus={{ bg: "bg-alotrade", color: "white" }}
              _active={{ bg: "bg-alotrade", color: "white" }}
            >
              {submenuItem.name}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </Menu>
  );
}
