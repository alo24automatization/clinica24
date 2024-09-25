import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { useToast } from "@chakra-ui/react";
import AloLogo from "../../../../clinica_logo.jpg";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const history = useHistory();
  //====================================================================
  //====================================================================
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
  const [activePage, setActivePage] = useState(window.location.pathname);
  //====================================================================
  //====================================================================
  const { t } = useTranslation();
  //====================================================================
  //====================================================================

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
      console.log("Appearance settings get error");
    }
  };

  useEffect(() => {
    getAppearanceFields();
  }, []);
  return (
    <div>
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg custom-navbar">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#royalHospitalsNavbar"
            aria-controls="royalHospitalsNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i />
              <i />
              <i />
            </span>
          </button>
          <div
            className="bg-[#00c2cb] collapse navbar-collapse  justify-content-between"
            id="royalHospitalsNavbar"
          >
            <ul className="navbar-nav py-2">
              <li className="nav-item px-2">
                <img src={AloLogo} alt="logo" className="w-[100px]" />
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24" || activePage === "/"
                      ? "active-page"
                      : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24");
                  }}
                  to="/alo24"
                  style={{
                    background:
                      activePage === "/alo24" || activePage === "/"
                        ? "#F97316"
                        : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Shifokorlar")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/counter_doctors_report"
                      ? "active-page"
                      : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/counter_doctors_report");
                  }}
                  to="/alo24/counter_doctors_report"
                  style={{
                    background:
                      activePage === "/alo24/counter_doctors_report"
                        ? "#F97316"
                        : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Hisobot")}
                </Link>
              </li>
              {appearanceFields.showStationary === true && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activePage === "/alo24/statsionar_doctors_report"
                        ? "active-page"
                        : ""
                    }`}
                    onClick={() => {
                      setActivePage("/alo24/statsionar_doctors_report");
                    }}
                    to="/alo24/statsionar_doctors_report"
                    style={{
                      background:
                        activePage === "/alo24/statsionar_doctors_report"
                          ? "#F97316"
                          : "",
                    }}
                  >
                    <i className="icon-devices_other nav-icon" />
                    {t("Statsionar hisobot")}
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/visit_page" ? "active-page" : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/visit_page");
                  }}
                  to="/alo24/visit_page"
                  style={{
                    background:
                      activePage === "/alo24/visit_page" ? "#F97316" : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Tashrif")}
                </Link>
              </li>
            </ul>
            <ul className="header-actions py-1 mr-2">
              <li className="dropdown">
                <span
                  id="userSettings"
                  className="user-settings"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                >
                  <span className="user-name">
                    {user.firstname} {user.lastname}
                  </span>
                  <span className="avatar md">
                    {baseUrl ? (
                      <img
                        className="circle d-inline"
                        src={
                          baseUrl && `${baseUrl}/api/upload/file/${user.image}`
                        }
                        alt={user.firstname + user.lastname}
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
                            baseUrl &&
                            `${baseUrl}/api/upload/file/${user.image}`
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
          </div>
        </nav>
      </div>
    </div>
  );
};
