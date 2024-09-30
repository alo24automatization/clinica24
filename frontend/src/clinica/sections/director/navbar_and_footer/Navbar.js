import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { useToast } from "@chakra-ui/react";
import AloLogo from "../../../../clinica_logo.jpg";
import { useTranslation } from "react-i18next";
import AppNavbar from "../../components/navbar/AppNavbar";

export const Navbar = ({ clinica, appearanceFields }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const notify = useCallback(
    (data) => {
      toast({
        title: data.title && data.title,
        description: data.description && data.description,
        status: data.status && data.status,
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast]
  );
  const { request } = useHttp();
  const auth = useContext(AuthContext);
  const [user, setUser] = useState(auth.user);
  const getDirector = useCallback(async () => {
    try {
      const data = await request(
        "/api/director",
        "POST",
        {
          directorId: auth.userId,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setUser(data);
    } catch (error) {
      notify({ title: error, description: "", status: "error" });
    }
  }, [request, auth, notify]);

  useEffect(() => {
    getDirector();
  }, []);

  const links = useMemo(
    () => [
      { name: t("Bosh sahifa"), to: "/alo24", index: true },
      {
        name: t("Xizmatlar"),
        to: "#",
        activeWhen: [
          "/alo24/departments",
          "/alo24/servicetypes",
          "/alo24/services",
          "/alo24/rooms",
          "/alo24/products",
          "/alo24/recieptproducts",
          "/alo24/rooms",
          "/alo24/productconnector",
        ],
        submenu: [
          {
            name: t("Xizmatlar"),
            to: "#",
            submenu: [
              { name: t("Bo'limlar"), to: "/alo24/departments" },
              { name: t("Xizmat turlari"), to: "/alo24/servicetypes" },
              { name: t("Xizmatlar"), to: "/alo24/services" },
            ],
          },
          { name: t("Xonalar"), to: "/alo24/rooms" },
          {
            name: t("Omborxona"),
            to: "#",
            submenu: [
              { name: t("Barcha mahsulotlar"), to: "/alo24/products" },
              {
                name: t("Keltirilgan mahsulotlar"),
                to: "/alo24/recieptproducts",
              },
              {
                name: t("Xizmatlarga bog'lash"),
                to: "/alo24/productconnector",
              },
              { name: t("Mahsulotlar hisoboti"), to: "/alo24/products_report" },
            ],
          },
          // { name: t("Omborxona"), to: "/alo24/cashier_expense" },
        ],
      },
      {
        name: t("Foydalanuvchilar"),
        to: "/alo24/users",
        showWhen: () => clinica?.isCreateUser,
      },
      {
        name: t("Mijozlar"),
        to: "#",
        activeWhen: ["/alo24/offlineclients", "/alo24/statsionarclients"],
        submenu: [
          { name: t("Kunduzgi"), to: "/alo24/offlineclients" },
          {
            name: t("Statsionar"),
            to: "/alo24/statsionarclients",
            showWhen: (s) => appearanceFields.showStationary === true,
          },
          // { name: t("Omborxona"), to: "/alo24/cashier_expense" },
        ],
      },
      { name: t("Marketing"), to: "/alo24/adver" },
      {
        name: t("Hisob bo'limi"),
        to: "#",
        activeWhen: [
          "/alo24/mainreport",
          "/alo24/statsionarreport",
          "/alo24/discountreport",
          "/alo24/debtreport",
          "/alo24/counteragent",
          "/alo24/doctor_procient",
          "/alo24/nurse_profit",
          "/alo24/expense",
          "/alo24/directdoctors",
        ],
        submenu: [
          { name: t("Kunduzgi"), to: "/alo24/mainreport" },
          {
            name: t("Statsionar"),
            to: "/alo24/statsionarreport",
            showWhen: () => appearanceFields.showStationary === true,
          },
          { name: t("Chegirmalar"), to: "/alo24/discountreport" },
          { name: t("Qarzlar"), to: "/alo24/debtreport" },
          { name: t("Shifokor ulushi"), to: "/alo24/doctor_procient" },
          { name: t("Xamshira ulushi"), to: "/alo24/nurse_profit" },
          { name: t("Kontragent"), to: "/alo24/counteragent" },
          { name: t("Xarajatlar"), to: "/alo24/expense" },
        ],
      },
      { name: t("Sozlamalar"), to: "/alo24/settings" },
    ],
    [t, appearanceFields]
  );

  const userType = useMemo(() => {
    return { type: "Director", appearanceFields };
  }, [appearanceFields]);

  return <AppNavbar links={links} user={user} userType={userType} />;
};
