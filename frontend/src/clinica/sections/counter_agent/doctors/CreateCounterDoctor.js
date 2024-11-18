import {
  Button,
  CloseButton,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import {
  faDeleteLeft,
  faPenAlt,
  faPlus,
  faRemove,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Pagination } from "../../director/components/Pagination";
import RegisterDoctor from "./components/RegisterDoctor";
import { Modal } from "./components/Modal";
import { Modal as ChakraModal } from "@chakra-ui/react";
import makeAnimated from "react-select/animated";
import Select from "react-select";
const animatedComponents = makeAnimated();

const CreateCounterDoctor = () => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [countPage, setCountPage] = useState(10);

  const indexLastConnector = (currentPage + 1) * countPage;
  const indexFirstConnector = indexLastConnector - countPage;

  //====================================================
  //====================================================

  const { t } = useTranslation();

  //====================================================
  //====================================================

  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);
  //====================================================
  //====================================================

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

  //====================================================
  //====================================================

  const [visible, setVisible] = useState(false);

  const changeVisible = () => setVisible(!visible);

  //====================================================
  //====================================================

  //====================================================
  //====================================================
  const [doctor, setDoctor] = useState({
    lastname: "",
    firstname: "",
    clinica_name: "",
    clinica: null,
    counter_agent: null,
    phone: "",
    statsionar_profit: "",
  });

  const changeDoctorData = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  //==============================================================
  //==============================================================

  const setPageSize = (e) => {
    setCurrentPage(0);
    setCountPage(e.target.value);
    setCounterdoctors(searchStorage.slice(0, e.target.value));
  };

  //==============================================================
  //==============================================================

  const createHandler = async () => {
    try {
      const data = await request(
        `/api/counter_agent/doctor/create`,
        "POST",
        {
          ...doctor,
          counter_agent: auth?.user?._id,
          clinica: auth?.clinica?._id,
          statsionar_profit: Number(doctor?.statsionar_profit) || 0,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: `${data.firstname} ${data.lastname} ${t(
          "yunaltiruvchi shifokor yaratildi!"
        )}`,
        description: "",
        status: "success",
      });
      setDoctor({
        lastname: "",
        firstname: "",
        clinica_name: "",
        phone: "",
        clinica: auth?.clinica?._id,
        counter_agent: auth?.user?._id,
        statsionar_profit: "",
      });
      getDoctorsList();
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };

  const checkData = () => {
    if (!doctor.firstname) {
      return notify({
        title: t("Shifokorni nomi terilmagan!"),
        description: "",
        status: "error",
      });
    }
    if (!doctor.lastname) {
      return notify({
        title: t("Shifokorni familiyasi terilmagan!"),
        description: "",
        status: "error",
      });
    }
    // if (!doctor.clinica_name) {
    //     return notify({
    //         title: t("Shifokorni klinikasi terilmagan!"),
    //         description: "",
    //         status: "error"
    //     })
    // }
    // if (!doctor.phone) {
    //     return notify({
    //         title: t("Shifokorni telefon raqami terilmagan!"),
    //         description: "",
    //         status: "error"
    //     })
    // }
    createHandler();
  };

  //==============================================================
  //==============================================================

  const [counterdoctors, setCounterdoctors] = useState([]);
  const [searchStorage, setSearchStorage] = useState([]);

  const getDoctorsList = useCallback(async () => {
    try {
      const data = await request(
        `/api/counter_agent/counterdoctorall/get`,
        "POST",
        {
          clinica: auth && auth.clinica._id,
          counter_agent: auth.user._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setSearchStorage(data);
      setCounterdoctors(data.slice(indexFirstConnector, indexLastConnector));
    } catch (error) {
      notify({
        title: t(error),
        description: "",
        status: "error",
      });
    }
  }, [auth, request, notify]);

  const [s, setS] = useState(0);

  useEffect(() => {
    if (auth.clinica && !s) {
      setS(1);
      getDoctorsList();
    }
  }, [getDoctorsList, auth, s]);

  const [deleteModal, setDeleteModal] = useState(null);

  //==============================================================
  //==============================================================

  const deleteCounterDoctor = async () => {
    try {
      await request(
        `/api/counter_agent/doctor/remove/${deleteModal?._id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: `${deleteModal?.firstname} ${deleteModal?.lastname} ${t(
          "yunaltiruvchi shifokor o'chirildi!"
        )}`,
        description: "",
        status: "success",
      });
      setDeleteModal(null);
      getDoctorsList();
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };
  const [servicesModalVisible, setServicesModalVisible] = useState(false);
  const [serviceProfitInputValue, setServiceProfitInputValue] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartament, setSelectedDepartament] = useState(null);

  const toogleServicesModal = useCallback(() => {
    setServicesModalVisible((prev) => !prev);
  }, []);
  const getServices = useCallback(
    (e) => {
      var s = [];
      if (e === "all") {
        departments.map((department) => {
          return department.services.map((service) => {
            return s.push({
              label: (
                <div className="w-full flex justify-between items-center gap-x-2">
                  <span>{service.name}</span>
                  <span className="p-1 rounded-sm !bg-green-500 font-medium  text-white">
                    {service.price} so'm
                  </span>
                </div>
              ),
              price: service.price,
              name: service.name,
              value: service._id,
              service: service,
              department: department,
              turn: service.turn,
            });
          });
        });
      } else {
        departments.map((department) => {
          if (e === department._id) {
            department.services.map((service) => {
              s.push({
                label: (
                  <div className="w-full flex justify-between  items-center gap-x-2">
                    <span>{service.name}</span>
                    <span className="p-1 rounded-sm !bg-green-500 font-medium text-white">
                      {service.price} so'm
                    </span>
                  </div>
                ),
                value: service._id,
                price: service.price,
                name: service.name,
                service: service,
                department: department,
                turn: service.turn,
              });
              return "";
            });
          }
          return "";
        });
      }
      setServices(s);
    },
    [departments]
  );

  const getDepartments = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department/reseption`,
        "POST",
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDepartments(data);
      getServices("all");
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify]);

  useEffect(() => {
    // getDepartments();
  }, []);

  const filterOption = (option, rawInput) => {
    const input = rawInput.toLowerCase();
    if (!isNaN(input.charAt(0))) {
      return option.data.price.toString().includes(input);
    }
    return option.data.name.toLowerCase().includes(input);
  };

  const changeService = useCallback((services) => {
    const updatedServices = Array.isArray(services) ? services : [];
    setSelectedServices(updatedServices);
  }, []);

  const changeServiceProfit = (inputValue) => {
    const regex = /^(?!.*%.*%).*[0-9%]*$/;

    if (inputValue === "%" || !regex.test(inputValue)) {
      return;
    }
    setServiceProfitInputValue(inputValue);
  };

  const checkIsProtsent = (value) => {
    return value?.substring(value.length - 1) === "%";
  };
  const clearProfitInput = (code) => {
    if (code === "Backspace") {
      setServiceProfitInputValue((prev) => {
        const newValue = prev.slice(0, prev.length);
        return newValue;
      });
    }
  };
  const handleAddServicesProfit = () => {
    const isProtsent = checkIsProtsent(serviceProfitInputValue);
  };
  return (
    <div className="min-h-full">
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="row">
              <div className="col-12 text-end">
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100 ${
                    visible ? "d-none" : ""
                  }`}
                  onClick={changeVisible}
                >
                  {t("Registratsiya")}
                </button>
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100 ${
                    visible ? "" : "d-none"
                  }`}
                  onClick={changeVisible}
                >
                  {t("Registratsiya")}
                </button>
              </div>
            </div>
            <div className={` ${visible ? "" : "d-none"}`}>
              <RegisterDoctor
                loading={loading}
                changeDoctorData={changeDoctorData}
                doctor={doctor}
                checkData={checkData}
              />
            </div>
            <div className="border-0 table-container mt-6">
              <div className="border-0 table-container">
                <div className="table-responsive">
                  <div className="bg-white flex gap-6 items-center py-2 px-2">
                    <div>
                      <select
                        className="form-control form-control-sm selectpicker"
                        placeholder="Bo'limni tanlang"
                        onChange={setPageSize}
                        style={{ minWidth: "50px" }}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="text-center ml-auto ">
                      <Pagination
                        setCurrentDatas={setCounterdoctors}
                        datas={searchStorage}
                        setCurrentPage={setCurrentPage}
                        countPage={countPage}
                        totalDatas={searchStorage.length}
                      />
                    </div>
                  </div>
                  <table className="table m-0">
                    <thead>
                      <tr>
                        <th className="border py-1 bg-alotrade text-[16px]">
                          №
                        </th>
                        <th className="border py-1 bg-alotrade text-[16px]">
                          {t("Shifokor")}
                        </th>
                        <th className="border py-1 bg-alotrade text-[16px]">
                          {t("Ish joy")}
                        </th>
                        <th className="border py-1 bg-alotrade text-[16px]">
                          {t("Telefon raqami")}
                        </th>
                        <th className="border py-1 bg-alotrade text-[16px]">
                          {t("Statsionar ulushi")}
                        </th>
                        <th hidden className="border py-1 bg-alotrade text-[16px]">
                          {t("Xizmmat ulushi")}
                        </th>
                        <th className="border py-1 bg-alotrade text-[16px]">
                          {t("Tahrirlash")}
                        </th>
                        <th className="border py-1 bg-alotrade text-[16px]">
                          {t("O'chirish")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {counterdoctors.map((connector, key) => {
                        return (
                          <tr key={key}>
                            <td
                              className="border py-1 font-weight-bold text-right"
                              style={{ maxWidth: "30px !important" }}
                            >
                              {currentPage * countPage + key + 1}
                            </td>
                            <td className="border py-1 font-weight-bold text-[16px]">
                              {connector?.lastname + " " + connector?.firstname}
                            </td>
                            <td className="border py-1 font-weight-bold text-[16px]">
                              {connector?.clinica_name}
                            </td>
                            <td className="border py-1 text-left text-[16px]">
                              {connector?.phone && "+998" + connector?.phone}
                            </td>
                            <td className="border py-1 text-left text-[16px]">
                              {connector?.statsionar_profit || 0}
                            </td>
                            <td hidden className="border py-1 text-center text-[16px]">
                              {loading ? (
                                <button className="btn btn-success" disabled>
                                  <span className="spinner-border spinner-border-sm"></span>
                                  Loading...
                                </button>
                              ) : (
                                <button
                                  className="btn btn-warning py-0"
                                  onClick={() => {
                                    setDoctor(connector);
                                    toogleServicesModal();
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </button>
                              )}
                            </td>
                            <td className="border py-1 text-center text-[16px]">
                              {loading ? (
                                <button className="btn btn-success" disabled>
                                  <span className="spinner-border spinner-border-sm"></span>
                                  Loading...
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success py-0"
                                  onClick={() => {
                                    setDoctor(connector);
                                    setVisible(true);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPenAlt} />
                                </button>
                              )}
                            </td>
                            <td className="border py-1 text-center text-[16px]">
                              {loading ? (
                                <button className="btn btn-success" disabled>
                                  <span className="spinner-border spinner-border-sm"></span>
                                  Loading...
                                </button>
                              ) : (
                                <button
                                  className="btn btn-danger py-0"
                                  onClick={() => {
                                    setDeleteModal(connector);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Modal
              modal={deleteModal}
              text={t("kontrdoktor o'chirishni tasdiqlaysizmi?")}
              setModal={setDeleteModal}
              handler={deleteCounterDoctor}
              basic={deleteModal?.firstname + " " + deleteModal?.lastname}
            />
          </div>
        </div>
      </div>

      <ChakraModal
        closeOnEsc
        size="4xl"
        isOpen={servicesModalVisible}
        onClose={toogleServicesModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="flex items-center justify-between">
            Shifokor ulushi
            <CloseButton onClick={toogleServicesModal} />
          </ModalHeader>
          <ModalBody>
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="fullName">{t("Bo'limlar")}</label>
                <select
                  className="form-control form-control-sm selectpicker"
                  placeholder="Reklamalarni tanlash"
                  onChange={(event) => {
                    getServices(event.target.value);
                    setSelectedDepartament(event.target.value);
                  }}
                  value={selectedDepartament}
                >
                  <option value="all">{t("Barcha bo'limlar")}</option>
                  {departments.map((department, index) => {
                    return (
                      <option key={index} value={department._id}>
                        {department.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="inputEmail">{t("Xizmatlar")}</label>
                  <Select
                    value={selectedServices}
                    onChange={changeService}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    placeholder={t("Tanlang...")}
                    filterOption={filterOption}
                    options={services}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      padding: 0,
                      height: 0,
                    })}
                    isMulti
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="inputEmail">{t("Ulushi % yoki narx")}</label>
                  <Input
                    value={serviceProfitInputValue}
                    onKeyDown={(e) => clearProfitInput(e.code)}
                    onChange={(e) => changeServiceProfit(e.target.value)}
                    placeholder="ulushi % yoki narx"
                    className="is-valid !rounded-sm"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={toogleServicesModal} colorScheme="red">
              {t("Bekor qilish")}
            </Button>
            <Button
              className=" !bg-alotrade py-1.5 ml-3 text-white rounded-sm px-5 font-semibold text-base flex items-center justify-center"
              onClick={handleAddServicesProfit}
            >
              {t("Saqlash")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    </div>
  );
};

export default CreateCounterDoctor;
