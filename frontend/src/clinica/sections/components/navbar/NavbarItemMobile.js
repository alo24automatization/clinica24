import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Collapse, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

export function NavbarItemMobile({
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
