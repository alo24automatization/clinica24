import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/AuthContext";
import AppNavbar from "../../components/navbar/AppNavbar";

export const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  const links = useMemo(
    () => [
      { name: t("Mijozlar"), to: "/alo24", index: true },
      {
        name: t("Shablonlar"),
        to: "/alo24/tables",
      },
      { name: t("Jadvallar"), to: "/alo24/conclusion" },
      { name: t("Qon olish"), to: "/alo24/bloodtest" },
    ],
    [t]
  );

  return (
    <AppNavbar
      userType={{ type: "Laboratory" }}
      user={auth.user}
      links={links}
    />
  );
};
