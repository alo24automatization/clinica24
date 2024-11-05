import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  VStack,
  toast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import AloLogo from "../../../../clinica_logo.jpg";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { NavbarItemDesktop } from "./NavbarItemDesktop";
import { NavbarItemMobile } from "./NavbarItemMobile";

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
                    src={
                      userType.type === "Admin"
                        ? userType.baseUrl &&
                          `${userType.baseUrl}/api/upload/file/${user.image}`
                        : baseUrl && `${baseUrl}/api/upload/file/${user.image}`
                    }
                    alt={'#404'}

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
                        userType.type === "Admin"
                          ? userType.baseUrl &&
                            `${userType.baseUrl}/api/upload/file/${user.image}`
                          : baseUrl &&
                            `${baseUrl}/api/upload/file/${user.image}`
                      }
                      alt={'404'}
                    />
                  </div>
                  {user.firstname} {user.lastname}
                  <p>{userType.type}</p>
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

export default AppNavbar;
