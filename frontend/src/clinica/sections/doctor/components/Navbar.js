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
        to: "/alo24/templates",
      },
      { name: t("Xulosa berish"), to: "/alo24/conclusionclients" },
      { name: t("Shifokor ulushi"), to: "/alo24/doctor_profit" },
      { name: t("Online"), to: "/alo24/onlineclients" },
      {
        name: t("Statsionar ulushi"),
        to: "/alo24/statsionar_room",
        showWhen: (s) => s.showStationary === true,
      },
      { name: t("Sozlamalar"), to: "/alo24/settings" },
    ],
    [t]
  );

  return (
    <AppNavbar userType={{ type: "Doctor" }} user={auth.user} links={links} />
  );
};
