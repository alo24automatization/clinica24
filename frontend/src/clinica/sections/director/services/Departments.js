import React, { useCallback, useContext, useEffect, useState } from "react";
import { Loader } from "../../../loader/Loader";
import { Button, useToast } from "@chakra-ui/react";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { checkDepartment } from "./checkData";
import { Modal } from "./modal/Modal";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DepartmentsModal } from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const Departments = () => {
  //====================================================================
  //====================================================================

  const { t } = useTranslation();

  const history = useHistory();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [remove, setRemove] = useState();

  const clearInputs = useCallback(() => {
    const inputs = document.getElementsByTagName("input");
    for (const input of inputs) {
      input.value = "";
    }
  }, []);
  //====================================================================
  //====================================================================

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
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  const [department, setDepartment] = useState({
    probirka: false,
    clinica: auth.clinica && auth.clinica._id,
  });
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [departments, setDepartments] = useState();

  const getDepartments = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department/getall`,
        "POST",
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDepartments(data);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify]);
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [departmentRooms, setDepartmentRooms] = useState([]);
  const [departmentModal, setDepartmentModal] = useState(false);

  const createHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department/register`,
        "POST",
        {
          ...department,
          departmentRooms: departmentRooms.map((d) => ({
            number: d.number,
            type: d.type,
          })),
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: `${data.name} ${t("bo'limi yaratildi")}!`,
        description: "",
        status: "success",
      });
      getDepartments();
      setDepartment({
        probirka: false,
        clinica: auth.clinica && auth.clinica._id,
      });
      clearInputs();
      setDepartmentModal(false);
      setDepartmentRooms([]);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [
    request,
    auth,
    notify,
    setDepartmentModal,
    getDepartments,
    department,
    clearInputs,
    departmentRooms,
  ]);

  const updateHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department`,
        "PUT",
        {
          ...department,
          departmentRooms: departmentRooms.map((d) => ({
            number: d.number,
            type: d.type,
          })),
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: `${data.name} ${t("bo'limi yangilandi")}!`,
        description: "",
        status: "success",
      });
      getDepartments();
      setDepartmentRooms([]);
      setDepartmentModal(false);
      setDepartment({
        probirka: false,
        clinica: auth.clinica && auth.clinica._id,
      });
      clearInputs();
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [
    request,
    auth,
    setDepartmentModal,
    notify,
    getDepartments,
    department,
    clearInputs,
    departmentRooms,
  ]);

  const saveHandler = () => {
    if (checkDepartment(department, t)) {
      return notify(checkDepartment(department, t));
    }
    if (department._id) {
      return updateHandler();
    } else {
      return createHandler();
    }
  };

  const keyPressed = (e) => {
    if (e.key === "Enter") {
      return saveHandler();
    }
  };

  const deleteHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department`,
        "DELETE",
        { ...remove },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: `${data.name} ${t("bo'limi o'chirildi")}!`,
        description: "",
        status: "success",
      });
      getDepartments();
      setModal(false);
      setDepartment({
        probirka: false,
        clinica: auth.clinica && auth.clinica._id,
      });
      clearInputs();
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [auth, request, remove, notify, getDepartments, clearInputs]);

  const deleteAll = useCallback(async () => {
    if (departments && departments.length === 0) {
      return notify({
        title: t(`Bo'limlar mavjud emas`),
        description: "",
        status: "warning",
      });
    }
    try {
      const data = await request(
        `/api/services/department/deleteall`,
        "DELETE",
        { ...department },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      localStorage.setItem("delete", data);
      notify({
        title: t(`Barcha bo'limlar o'chirildi!`),
        description: "",
        status: "success",
      });
      getDepartments();
      setModal1(false);
      setDepartment({
        probirka: false,
        clinica: auth.clinica && auth.clinica._id,
      });
      clearInputs();
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [
    auth,
    request,
    notify,
    getDepartments,
    clearInputs,
    department,
    departments,
  ]);
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const checkHandler = (e) => {
    setDepartment({ ...department, probirka: e.target.checked });
  };

  const inputHandler = (e) => {
    setDepartment({
      ...department,
      name: e.target.value,
      letter: e.target.value.substring(0, 1).toUpperCase(),
    });
  };

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const [s, setS] = useState();
  useEffect(() => {
    if (!s) {
      setS(1);
      getDepartments();
    }
  }, [getDepartments, s]);
  //====================================================================
  //====================================================================

  const handleAddRoom = () => {
    setDepartmentRooms((p) => [...p, { id: Date.now(), type: "", number: "" }]);
  };

  const departmentRoomsChange = (id, field, val) => {
    setDepartmentRooms((p) =>
      p.map((dep) => (dep.id === id ? { ...dep, [field]: val } : dep))
    );
  };

  return (
    <>
      {loading ? <Loader /> : ""}
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <DepartmentsModal
            closeHandler={() => {
              setDepartment({
                probirka: false,
                clinica: auth.clinica && auth.clinica._id,
              });
              setDepartmentModal(false);
              setDepartmentRooms([]);
            }}
            confirm={t("Saqlash")}
            modal={departmentModal}
            setModal={setDepartmentModal}
            handler={saveHandler}
          >
            <div className="md:flex flex-wrap">
              <div className="flex-none md:w-1/2">
                <div className="text-[16px]">
                  <label>{t("Bo'lim nomi")}</label>
                  <input
                    style={{ minWidth: "25%" }}
                    value={department.name || ""}
                    onKeyUp={keyPressed}
                    onChange={inputHandler}
                    type="text"
                    className="form-control w-80"
                    id="inputName2"
                    // placeholder={t("Bo'lim nomini kiriting")}
                  />
                </div>
              </div>
              <div className="flex-none md:w-1/2">
                <div className="text-[16px]">
                  <label>{t("Bo'lim qavati")}</label>
                  <input
                    style={{ minWidth: "25%" }}
                    value={department?.floor || ""}
                    onKeyUp={keyPressed}
                    onChange={(e) =>
                      setDepartment({
                        ...department,
                        floor: e.target.value,
                      })
                    }
                    type="text"
                    className="form-control w-80"
                    id="inputName3"
                    // placeholder={t("Bo'lim qavatin kiriting")}
                  />
                </div>
              </div>

              <div className="flex-none md:w-1/2">
                <div className="text-[16px]">
                  <label>{t("Asosiy xona")}</label>
                  <input
                    style={{ minWidth: "25%" }}
                    value={department?.room || ""}
                    type="number"
                    onKeyUp={keyPressed}
                    onChange={(e) =>
                      setDepartment({
                        ...department,
                        room: e.target.value,
                      })
                    }
                    className="form-control w-80"
                    id="inputName4"
                    // placeholder={t("Bo'lim xonasini kiriting")}
                  />
                </div>
              </div>
              <div className="flex-none md:w-1/2">
                <div className="text-[16px]">
                  <label>{t("Harf")}</label>
                  <input
                    style={{ minWidth: "25%" }}
                    value={department?.letter || ""}
                    onKeyUp={keyPressed}
                    onChange={(e) =>
                      setDepartment({
                        ...department,
                        letter: e.target.value,
                      })
                    }
                    type="text"
                    className="form-control w-80"
                    id="inputName5"
                    // placeholder={t("Bo'lim xonasini kiriting")}
                  />
                </div>
              </div>
            </div>

            <div className="text-[16px]">
              <label>{t("Probirka")}</label>
              <div className="custom-control custom-switch pl-0">
                <input
                  onKeyUp={keyPressed}
                  type="checkbox"
                  className="custom-control-input"
                  id="customSwitch1"
                  checked={department.probirka && department.probirka}
                  onChange={checkHandler}
                />
                <label className="custom-control-label" htmlFor="customSwitch1">
                  {department.probirka ? t("Probirkali") : t("Probirkasiz")}
                </label>
              </div>
            </div>

            <div className="mt-8">
              {t("Qo'shimcha xona")}{" "}
              <Button
                // disabled={editingID !== null}
                onClick={handleAddRoom}
                size="sm"
                colorScheme="green"
                className="focus:!shadow-none"
              >
                <FontAwesomeIcon
                  className="text-base font-bold"
                  icon={faPlus}
                />
              </Button>
              {departmentRooms.map((dep) => {
                return (
                  <div key={dep.id} className="md:flex flex-wrap">
                    <div className="flex-none md:w-1/2">
                      <div className="text-[16px]">
                        <label>Xona nomeri</label>
                        <input
                          style={{ minWidth: "25%" }}
                          value={dep.number}
                          type="number"
                          onChange={(e) =>
                            departmentRoomsChange(
                              dep.id,
                              "number",
                              e.target.value
                            )
                          }
                          className="form-control w-80"
                        />
                      </div>
                    </div>
                    <div className="flex-none md:w-1/2">
                      <div className="text-[16px]">
                        <label>Xona turi</label>
                        <input
                          style={{ minWidth: "25%" }}
                          value={dep.type}
                          onChange={(e) =>
                            departmentRoomsChange(
                              dep.id,
                              "type",
                              e.target.value
                            )
                          }
                          type="text"
                          className="form-control w-80"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DepartmentsModal>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="border-0 shadow-lg table-container">
              <div className="p-4">
                <Button
                  // disabled={editingID !== null}
                  onClick={() => {
                    setDepartmentModal(true);
                    setDepartmentRooms([]);
                  }}
                  size="sm"
                  colorScheme="green"
                  className="focus:!shadow-none"
                >
                  <FontAwesomeIcon
                    className="text-base font-bold"
                    icon={faPlus}
                  />
                </Button>{" "}
                {t("Xona qo'shish")}
              </div>
              <div className="table-responsive">
                <table className="table m-0">
                  <thead>
                    <tr>
                      <th className="bg-alotrade text-[16px]">№</th>
                      <th className=" bg-alotrade text-[16px]">{t("Nomi")}</th>
                      <th className=" bg-alotrade text-[16px]">{t("Qavat")}</th>
                      <th className=" bg-alotrade text-[16px]">
                        {t("Xonasi")}
                      </th>
                      <th className=" bg-alotrade text-[16px]">{t("Harf")}</th>
                      <th className=" bg-alotrade text-[16px]">
                        {t("Barcha xizmat turlari")}
                      </th>
                      <th className=" bg-alotrade text-[16px]">
                        {t("Probirka")}
                      </th>
                      <th className=" bg-alotrade text-[16px]">
                        {t("Tahrirlash")}
                      </th>
                      <th className=" bg-alotrade text-[16px]">
                        {t("O'chirish")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments &&
                      departments.map((d, key) => {
                        return (
                          <tr key={key}>
                            <td className="font-weight-bold text-[16px]">
                              {key + 1}
                            </td>
                            <td className="text-[16px]">{d.name}</td>
                            <td className="text-[16px]">{d?.floor}</td>
                            <td className="text-[16px]">{d?.room}</td>
                            <td className="text-[16px]">{d?.letter}</td>
                            <td>
                              <button
                                onClick={() =>
                                  history.push("/alo24/servicetypes", {
                                    department: d._id,
                                  })
                                }
                                className="text-[16px] bg-green-400 text-white font-semibold py-1 px-2"
                              >
                                {t("Xizmat turlari")}
                              </button>
                            </td>
                            <td className="text-[16px]">
                              {d.probirka ? "Probirka" : ""}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setDepartment(d);
                                  setDepartmentModal(true);
                                  setDepartmentRooms(d.departmentRooms || []);
                                }}
                                type="button"
                                className="text-[16px] bg-alotrade text-white font-semibold py-1 px-2"
                                style={{ fontSize: "75%" }}
                              >
                                {t("Tahrirlash")}
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setRemove(d);
                                  setModal(true);
                                }}
                                type="button"
                                className="text-[16px] text-white font-semibold bg-red-400 py-1 px-2"
                                style={{ fontSize: "75%" }}
                              >
                                {t("O'chirish")}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        modal={modal}
        setModal={setModal}
        basic={remove && remove.name}
        text={t("bo'limini o'chirishni tasdiqlaysizmi?")}
        handler={deleteHandler}
      />

      <Modal
        modal={modal1}
        setModal={setModal1}
        basic={""}
        text={t("Barcha bo'limlarni o'chirishni tasdiqlaysizmi?")}
        handler={deleteAll}
      />
    </>
  );
};
