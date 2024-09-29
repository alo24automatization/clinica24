import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import AppNavbar from "../../components/AppNavbar";

const Navbar = () => {
  const { t } = useTranslation();

  const links = useMemo(
    () => [
      { name: t("Kunduzgi"), to: "/alo24", index: true },
      {
        name: t("Statsionar"),
        to: "/alo24/statsionar",
        showWhen: (settings) => settings.showStationary === true,
      },
      { name: t("Online"), to: "/alo24/online" },
      {
        name: t("Kassa"),
        to: "#",
        showWhen: (settings) => settings.showCashbox === true,
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
    ],
    [t]
  );

  return <AppNavbar userType="reception" links={links} />;
};

export default Navbar;
