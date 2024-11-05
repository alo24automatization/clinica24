import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/AuthContext";
import AppNavbar from "../../components/navbar/AppNavbar";

export const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const links = useMemo(
    () => [
      { name: t("Kunduzgi"), to: "/alo24", index: true },
      {
        name: t("Statsionar"),
        to: "/alo24/statsionar",
        showWhen: (settings) => settings.showStationary === true,
      },
      { name: t("Chegirmalar"), to: "/alo24/discount" },
      { name: t("Qarzlar"), to: "/alo24/debt" },
      { name: t("Xarajatlar"), to: "/alo24/expense" },
    ],
    [t]
  );
  return (
    <AppNavbar links={links} user={auth.user} userType={{ type: "Cashier" }} />
  );
};
