import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/AuthContext";
import AppNavbar from "../../components/navbar/AppNavbar";

export const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  const links = useMemo(
    () => [
      { name: t("Shifokorlar"), to: "/alo24", index: true },
      {
        name: t("Hisobot"),
        to: "/alo24/counter_doctors_report",
      },
      {
        name: t("Statsionar hisobot"),
        to: "/alo24/statsionar_doctors_report",
        showWhen: (s) => s.showStationary === true,
      },
      { name: t("Tashrif"), to: "/alo24/visit_page" },
    ],
    [t]
  );

  return (
    <AppNavbar
      links={links}
      user={auth.user}
      userType={{ type: "Counteragent" }}
    />
  );
};
