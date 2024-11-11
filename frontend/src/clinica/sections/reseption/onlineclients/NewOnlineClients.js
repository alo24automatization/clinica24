import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal, Modal as Modal2 } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkClientData, checkProductsData, checkServicesData, } from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";
import { useTranslation } from "react-i18next";
import registImg from "./image.svg"
import deleteImg from "./image 29.svg"
import payImg from "./image 30.svg"
import './newOnlineClient.css'
import Select from "react-select";
import { DatePickers } from "./clientComponents/DatePickers";
import { Controller, useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
export const NewOnlineClients = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );
    //====================================================================
    //====================================================================
    // MODAL

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm()
    const onOpen = () => {
        console.log("OCHIL");
        setIsOpen(true)
    }
    const onClose = () => {
        console.log("YOPIL");
        setIsOpen(false)
    }
    const { t } = useTranslation()
    // RegisterPage
    const [visible, setVisible] = useState(false);
    const changeVisible = () => setVisible(!visible);
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;
    const [currentConnectors, setCurrentConnectors] = useState([]);
    useEffect(() => {
        if (!visible) {
            reset()
        }
    }, [visible, reset])
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
        []
    );

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);
    const [serviceOptions, setServiceOptions] = useState([]);
    const history = useHistory();
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [waitingconnectors, setWaitingConnectors] = useState([]);
    const [scheduledAppointments, setScheduledAppointments] = useState([]);
    const [doctor, setDoctor] = useState(JSON.stringify({}));
    const [searchStorage, setSearchStrorage] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);

    const [filteredCurrentConnectors, setFilteredCurrentConnectors] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterCheckBoxChecked, setFilterCheckBoxChecked] = useState({
        queue: false,
        time: false,
    });

    const getConnectors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/onlineclient/client/getdoctors`,
                    "POST",
                    { clinica: auth && auth.clinica._id, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectors(data);
                setDoctor(JSON.stringify(data[0]));
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );

    const getWaitingConnectors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/offlineclient/client/getallreseption`,
                    "POST",
                    { clinica: auth && auth.clinica._id, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setWaitingConnectors(data);
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );

    const getScheduledAppointmentsConnectors = useCallback(
        async (doctor, type) => {
            try {
                const data = await request(
                    `/api/onlineclient/client/getall`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id,
                        department: JSON.parse(doctor)?.specialty?._id,
                        beginDay: new Date().toISOString().slice(0, 10),
                        type,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setScheduledAppointments(data);
                setSearchStrorage(data);
                setCurrentConnectors(
                    data.slice(indexFirstConnector, indexLastConnector)
                );
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );

    

    useEffect(() => {
        if (doctor) {
            getScheduledAppointmentsConnectors(doctor)
        }
    }, [doctor])

    // SEARCH
    const searchFullname = (e) => {
        const searching = searchStorage.filter((item) =>
            (item.firstname + item.lastname)
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );
        setScheduledAppointments(searching);
        setScheduledAppointments(searching.slice(0, countPage));
    };

    // BASEURL
    const [baseUrl, setBaseurl] = useState();


    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request(`/api/baseurl`, "GET", null);
            setBaseurl(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, notify]);

    // CLIENT
    const [client, setClient] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
        department: auth?.user?.specialty?._id,
        bronTime: null,
        queue: null,
        serviceType: null,
        service: null
    });
    
    const [client1, setClient1] = useState({
        _id: ''
    });

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    // CLEAR

    const clearDatas = useCallback(() => {
        setClient({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
    }, [auth]);

    // CreateHandler
    const createHandler = useCallback(async (id) => {
        try {
            await request(
                `/api/onlineclient/client/register`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: t("Mijoz muvaffaqqiyatli yaratildi."),
                description: "",
                status: "success",
            });
            getConnectors(beginDay, endDay)
            getWaitingConnectors(beginDay, endDay)
            setModal(false);
            clearDatas();
            setVisible(false);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        notify,
        request,
        indexLastConnector,
        indexFirstConnector,
        connectors,
        clearDatas,
    ]);

    const updateHandler = useCallback(async () => {
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }
        try {
            const data = await request(
                `/api/onlineclient/client/update`,
                "PUT",
                {
                    client: { ...client, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay);
            getWaitingConnectors(beginDay, endDay);
            notify({
                title: `${data.lastname + " " + data.firstname
                    }  ${t("ismli mijoz ma'lumotlari muvaffaqqiyatl yangilandi.")}`,
                description: "",
                status: "success",
            });
            clearDatas();
            setVisible(false);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        notify,
        request,
        clearDatas,
        getConnectors,
        getWaitingConnectors,
        beginDay,
        endDay,
    ]);

    // ChangeDate
    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
        getWaitingConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(
            new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
                0,
                0,
                0,
                0
            )
        );

        setEndDay(date);
        getConnectors(beginDay, date);
        getWaitingConnectors(beginDay, date);
    };

    const [departments, setDepartments] = useState([]);

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
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    // useEffect
    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getConnectors(beginDay, endDay);
            getWaitingConnectors(beginDay, endDay);
            getDepartments();
            getBaseUrl();
        }
    }, [
        auth,
        getConnectors,
        getWaitingConnectors,
        s,
        getDepartments,
        getBaseUrl,
        beginDay,
        endDay,
    ]);

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date().toLocaleDateString();
        setCurrentDate(today);
    }, []);

    const carouselItems = [
        { roomName: "Kabinet-1", title: 'Item 1', description: 'Description for item 1' },
        { roomName: "Kabinet-2", title: 'Item 1', description: 'Description for item 1' },
        { roomName: "Kabinet-3", title: 'Item 1', description: 'Description for item 1' },
        { roomName: "Kabinet-4", title: 'Item 1', description: 'Description for item 1' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        const newIndex = (currentIndex - 2 + carouselItems.length) % carouselItems.length;
        setCurrentIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 2) % carouselItems.length;
        setCurrentIndex(newIndex);
    };

    const visibleItems = [
        carouselItems[currentIndex],
        carouselItems[(currentIndex + 1) % carouselItems.length]
    ];

    const changeStatus = async (status) => {
        const newArr = currentConnectors.slice(
            indexFirstConnector,
            indexLastConnector
        );
        if (status === "queue") {
            setFilterStatus(status);
            setFilteredCurrentConnectors(newArr.filter((item) => item.queue));
            setFilterCheckBoxChecked({ time: false, queue: true });
        } else if (status === "time") {
            setFilterStatus(status);
            setFilteredCurrentConnectors(newArr.filter((item) => !item.queue));
            setFilterCheckBoxChecked({ time: true, queue: false });
        } else {
            setFilterStatus(status);
            setFilteredCurrentConnectors([]);
            setFilterCheckBoxChecked({ time: false, queue: false });
        }
    };
    // Service type o'qish funksiyasi
    const getServiceType = async () => {
        try {
            const data = await request(
                `/api/services/servicetype/getalldepartment`,
                "POST",
                {
                    clinica: auth.clinica._id,
                    department: JSON.parse(doctor)?.specialty?._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );

            if (data) {
                const options = data.map((item) => ({
                    value: item._id,
                    label: item.name,
                }));
                setServiceTypes(options); // Service type options to'g'rilandi
            }
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    };

    const getService = async (id) => {
        try {
            const data = await request(
                `/api/services/servicetype/findById`,
                "POST",
                { _id: id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );

            if (data?.services) {
                const options = data.services.map((item) => ({
                    value: item._id,
                    label: item.name,
                }));

                setServiceOptions((prevOptions) => {
                    // Qo'shilayotgan yangi optionslardan faqatgina eski optionslar ichida yo'q bo'lganlarini qo'shamiz
                    const newOptions = options.filter(
                        (option) =>
                            !prevOptions.some(
                                (prevOption) => prevOption.value === option.value
                            )
                    );
                    return [...prevOptions, ...newOptions];
                });
            }
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    };

    function RegistratsiyaModal(params = {}) {
        const [disableds, setDisableds] = useState({ time: false, queue: false });

        const onSubmit = (data) => {
            const parserData = { ...data, bronDate: new Date(data.bronDate) }
            console.log(parserData);
        }

        const [client, setClient] = useState({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
            department: doctor?.specialty?._id,
            bronTime: null,
            queue: null,
            serviceType: null,
            service: null,
        });


        return (
            <>
                <div onClick={() => setVisible(false)} className={`${visible ? "d-flex" : "d-none"} fixed h-100 w-100`} style={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#000",
                    opacity: "0.8",
                    zIndex: "998"
                }}></div>
                <div className={`${visible ? "d-flex" : "d-none"}`}>
                    {/* Row start */}
                    <div className="d-flex justify-content-center align-items-center" style={{
                        minWidth: '100%',
                        minHeight: "100%",
                        backgroundColor: "#000"
                    }}>
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12" style={{
                            position: "absolute",
                            top: "70px",
                            zIndex: "999"
                        }}>
                            <div className="card">
                                {/* Forma */}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="card-header">
                                        <div className="card-title">
                                            {t("Mijozning shaxsiy ma'lumotlari")}
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row gutters">
                                            {/* Familiya */}
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="fullName">
                                                        {t("Familiyasi")}
                                                    </label>
                                                    <input

                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        id="lastname"
                                                        name="lastname"
                                                        placeholder={t("Familiyasi")}
                                                        {...register("lastname", {
                                                            required: "Last name is requiered"
                                                        })}
                                                    />
                                                    {errors.lastname && (
                                                        <span style={{ fontSize: "14px", color: "red" }}>
                                                            {errors.lastname.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="inputEmail">{t("Ismi")}</label>
                                                    <input

                                                        {...register("firstname", {
                                                            required: "Firstname is requeiered"
                                                        })}
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        id="firstname"
                                                        name="firstname"
                                                        placeholder={t("Ismi")}
                                                    />
                                                    {errors.firstname && (
                                                        <span style={{ fontSize: "14px", color: "red" }}>
                                                            {errors.firstname.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <>
                                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="education">
                                                            {t("Kelish sanasi")}
                                                        </label>
                                                        <input
                                                            type="date"
                                                            name="born"
                                                            className="form-control inp"
                                                            placeholder=""
                                                            style={{ color: "#999" }}
                                                            value={clientDate}
                                                            {...register("bronDate")}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="education">{t("Vaqt")}</label>
                                                        <input


                                                            type="time"
                                                            name="born"
                                                            className="form-control inp"
                                                            placeholder=""
                                                            style={{ color: "#999" }}
                                                            {...register("bronTime", {
                                                                required: "time is requiered"
                                                            })}
                                                        />
                                                        {errors.bronTime && (
                                                            <span style={{ fontSize: "14px", color: "red" }}>
                                                                {errors.bronTime.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="navbat">{t("Navbat")}</label>
                                                        <input


                                                            type="text"
                                                            disabled={disableds.queue}
                                                            className="form-control form-control-sm"
                                                            id="navbat"
                                                            name="navbat"
                                                            {...register("queue", {
                                                                required: "Navbat is  required"
                                                            })}
                                                        />
                                                        {errors.queue && (
                                                            <span style={{ fontSize: "14px", color: "red" }}>
                                                                {errors.queue.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </>

                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="addreSs">
                                                        {t("Telefon raqami")}
                                                    </label>
                                                    <div className="input-group input-group-sm mb-3">
                                                        <div className="input-group-prepend">
                                                            <span
                                                                className="input-group-text"
                                                                id="inputGroup-sizing-sm"
                                                            >
                                                                +998
                                                            </span>
                                                        </div>
                                                        <input


                                                            type="number"
                                                            className="form-control"
                                                            name="phone"
                                                            {...register("phone", {
                                                                required: "Phone is requiered"
                                                            })}
                                                        />
                                                        {errors.phone && (
                                                            <span style={{ fontSize: "14px", color: "red" }}>
                                                                {errors.phone.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Xizmat turi */}
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="serviceType">
                                                        {t("Xizmat turi")}
                                                    </label>
                                                    <Controller
                                                        name="serviceType"
                                                        control={control}
                                                        defaultValue=""
                                                        rules={{ required: "Xizmat turi tanlanishi shart" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                onChange={(e) => {
                                                                    field.onChange(e.value);
                                                                    setClient((prevClient) => ({
                                                                        ...prevClient,
                                                                        serviceType: e.value,
                                                                    }));
                                                                    getService(e.value)
                                                                }}
                                                                value={serviceTypes.find(
                                                                    (option) => option.value === field.value
                                                                ) || null}
                                                                options={serviceTypes} // Options serviceTypes'dan keladi
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                            />
                                                        )}
                                                    />
                                                    {errors.serviceType && (
                                                        <span className="text-danger">
                                                            {errors.serviceType.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Xizmatni tanlash */}
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="service">
                                                        {t("Xizmatni tanlang")}
                                                    </label>
                                                    <Controller
                                                        name="service"
                                                        control={control}
                                                        defaultValue={[]} // Default qiymat array
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                isMulti
                                                                options={serviceOptions} // Options serviceOptions'dan keladi
                                                                value={serviceOptions.filter((option) =>
                                                                    field.value.includes(option.value)
                                                                )}
                                                                onChange={(e) => {
                                                                    const data = e.map((item) => item.value);
                                                                    field.onChange(data);
                                                                    setClient((prevClient) => ({
                                                                        ...prevClient,
                                                                        service: data,
                                                                    }));
                                                                }}
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                            />
                                                        )}
                                                    />
                                                    {errors.service && (
                                                        <span className="text-danger">
                                                            {errors.service.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3">
                                        <div className="text-right">
                                            <button type="submit" className="bg-alotrade rounded text-white py-2 px-3">
                                                {t("Saqlash")}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Row end */}
                </div>
            </>
        );
    }

    useEffect(() => {
        if (doctor && Object.keys(JSON.parse(doctor)).length) {
            getServiceType();
        }
    }, [doctor]);


    useEffect(()=>{
        console.log(filteredCurrentConnectors);
    }, [filteredCurrentConnectors])

    const deleteHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/onlineclient/client/delete`,
                "POST",
                {
                    id: client1._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getScheduledAppointmentsConnectors(doctor)
            notify({
                title: `${data.lastname + " " + data.firstname}  ${t(
                    "ismli mijoz ma'lumotlari muvaffaqqiyatl yangilandi."
                )}`,
                description: "",
                status: "success",
            });
            clearDatas();
            // setVisible(false);
            setModal2(false);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client1,
        notify,
        request,
        clearDatas,
        getConnectors,
        beginDay,
        endDay,
    ]);

    return (
        <div>
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3 w-100" style={{
                position: "relative",
            }}>
                {(visible && Object.keys(doctor).length) && <RegistratsiyaModal doctor={doctor} />}
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            {/* register bobur */}
                            <button onClick={changeVisible} className="register-btn btn ms-2 d-flex align-items-center"><img
                                src={registImg}
                                alt="Plus Icon"
                                style={{
                                    marginRight: "5px"
                                }}
                            />Регистрация</button>

                            <input type="text"
                                style={{
                                    marginRight: "20px",
                                    marginLeft: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "2px",
                                    paddingLeft: "5px",
                                    color: "#000",
                                    width: "20%",
                                    backgroundColor: "#f0f0f0"
                                }}
                                // className="search-input form-control w-auto"
                                onChange={searchFullname}
                                placeholder="ФИО" />

                            <div style={{
                                width: "15%",
                            }}
                                className="d-flex align-items-center">
                                <label className="me-3">Vaqt
                                    <input onChange={(e) =>
                                        changeStatus(e.target.checked ? "time" : "all")
                                    } type="checkbox" checked={filterCheckBoxChecked.time} name="vaqt" />
                                </label>
                                <label>Navbat
                                    <input onChange={(e) =>
                                        changeStatus(e.target.checked ? "queue" : "all")
                                    } type="checkbox" name="navbat" checked={filterCheckBoxChecked.queue} />
                                </label>
                            </div>

                            <select style={{ width: '200px' }} onChange={e => {
                                setDoctor(e.target.value);
                            }}
                                className="options-select form-select w-auto">
                                {connectors.map((option, index) => (
                                    <option key={index} value={JSON.stringify(option)}>
                                        {option.firstname} {option.lastname}
                                    </option>
                                ))}
                            </select>
                            <div style={{
                                marginLeft: "auto"
                            }} className="current-date fw-bold"><DatePickers changeDate={changeStart} /></div>

                        </div>

                        <div className="row pt-2">
                            {/* Left Column bobur */}
                            <div className="col-12 col-md-4 pr-0">
                                <div
                                    className="content-box d-flex align-items-start"
                                    style={{
                                        border: '2px solid #10A98A',
                                        borderBottom: "0px",
                                        borderLeft: "0px",
                                        padding: '10px',
                                        minHeight: "500px"
                                    }}
                                >
                                    <div className="col-md-6">
                                        <h5 style={{ color: "#000", fontWeight: "bold", paddingBottom: "10px" }}>Кабулга ёзилганлар</h5>
                                        {(filterStatus !== "all" ? filteredCurrentConnectors : scheduledAppointments).map((appointment, idx) => (
                                            <div key={idx} className="card mb-2 shadow-sm" style={{ borderRadius: "10px", backgroundColor: "#e0f7fa" }}>
                                                <div className="d-flex justify-content-between align-items-center p-2">
                                                    <div className="w-100">
                                                        <div className="d-flex justify-content-between">
                                                            <p style={{ color: "#F47709", fontWeight: "bold" }} className="mb-1">--:--</p>
                                                            <p style={{ color: "#F47709", fontWeight: "bold" }} className="me-3">--:-- - --:--</p>
                                                        </div>
                                                        <h6 style={{ color: "#000", fontWeight: "bold" }} className="mb-1">{appointment.firstname} {appointment.lastname}</h6>
                                                        <div className="d-flex justify-content-between">
                                                            <p style={{ color: "#000", fontWeight: "bold" }} className="mb-0">{appointment.phone}</p>
                                                            <div>
                                                                <button>
                                                                    <img
                                                                        onClick={() => {
                                                                            history.push("/alo24", {
                                                                                onlineclient: appointment,
                                                                            });
                                                                        }}
                                                                        src={payImg}
                                                                        alt="Arrow Icon"
                                                                        style={{
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            marginRight: "5px"
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button onClick={() => {
                                                                    setModal2(true)
                                                                    setClient1(appointment)
                                                                }}>
                                                                    <img
                                                                        src={deleteImg}
                                                                        alt="Delete Icon"
                                                                        style={{
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            marginRight: "5px"
                                                                        }}
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Waiting list column */}
                                    <div className="col-md-6">
                                        <h5 style={{ color: "#000", fontWeight: "bold", paddingBottom: "10px" }}>Кутаётганлар</h5>
                                        {waitingconnectors.map((person, idx) => (
                                            <div key={idx} className="card mb-2 shadow-sm" style={{ borderRadius: "10px", backgroundColor: "#e0f7fa" }}>
                                                <div className="d-flex justify-content-between align-items-center p-2">
                                                    <div className="w-100">
                                                        <div className="d-flex justify-content-between">
                                                            <p style={{ color: "#F47709", fontWeight: "bold" }} className="mb-1">--:--</p>
                                                            <p style={{ color: "#F47709", fontWeight: "bold" }} className="me-3">--:-- - --:--</p>
                                                        </div>
                                                        <h6 style={{ color: "#000", fontWeight: "bold" }} className="mb-1">{person.client.fullname}</h6>
                                                        <p style={{ color: "#000", fontWeight: "bold" }} className="mb-0">{person.client.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column bobur*/}
                            <div className="col-12 col-md-8 pl-0">
                                <div className="content-box"
                                    style={{
                                        border: '2px solid #10A98A',
                                        borderBottom: "0px",
                                        borderRight: "0px",
                                        padding: '10px',
                                        minHeight: "500px"
                                    }}>
                                    <div className="ml-2">
                                        <span className="ml-2">Тасдикланган 1</span>
                                        <span className="ml-2">Кутаётган 3</span>
                                        <span className="ml-2">Онлайн 2</span>
                                    </div>
                                    <div className="row ml-2 pt-2">
                                        <div className="row w-100">
                                            <div className="col-md-6">
                                                <button className="custom-btn" onClick={handlePrev}>
                                                    <span className="arrow">&lt;</span> {/* Left arrow */}
                                                </button>
                                            </div>
                                            <div className="col-md-6 d-flex justify-end">
                                                <button className="custom-btn" onClick={handleNext}>
                                                    <span className="arrow">&gt;</span> {/* Right arrow */}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="row w-100 pt-3">
                                            {visibleItems.map((item, index) => (
                                                <div className="col-md-6" key={index}>
                                                    <CardComponent data={item} key={index} />
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                modal={modal}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={setModal}
                handler={client._id ? updateHandler : createHandler}
                basic={client.lastname + " " + client.firstname}
            />

            <Modal2
                modal={modal2}
                text={t("Malumotlarni o'chirishni tasdiqlaysizmi?")}
                setModal={setModal2}
                handler={client1._id && deleteHandler}
            />
        </div>
    );
};


function CardComponent({ data }) {
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="main-card" style={{ height: "130px" }}>
            <div
                className="d-flex  align-items-center  justify-content-between"
                style={{ paddingLeft: "50px", marginBottom: "5px" }}
            >
                <h4 className="h6 text-danger m-0">{data.roomName}</h4>
                <h5 className="h6 text-dark m-0">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</h5>
            </div>
            <div className="card-item" style={{ height: "80%" }}>
                <div
                    className="d-flex flex-column align-items-start justify-content-between"
                    style={{ width: "13%", height: "100%" }}
                >
                    <h6 className="m-0" style={{ fontSize: "12px", fontWeight: "bold" }}>
                        09:00
                    </h6>
                    <h6 className="m-0" style={{ fontSize: "12px", fontWeight: "bold" }}>
                        10:00
                    </h6>
                </div>

                <div
                    className="roomCard"
                    style={{ width: "86%", height: "90%", paddingLeft: "10px" }}>
                    <div style={{ background: "#10A98A" }} className="w-100 h-25 px-2 pt-2 item-flex">
                        <h6 className="text-font">9:00</h6>
                        <h6 className="text-font">U1</h6>
                        <h6 className="text-font fw-bold">Samoyev Jasur</h6>
                    </div>
                    <div style={{ background: "#F47709" }} className="w-100 h-25 px-2 pt-2 item-flex">
                        <h6 className="text-font">9:15</h6>
                        <h6 className="text-font">9:15</h6>
                        <h6 className="text-font fw-bold">Samoyev Jasur</h6>{" "}
                    </div>
                    <div style={{ background: "#F5F5F5" }} className="w-100 h-25 px-2 pt-2 item-flex">
                        <h6 className="text-font">9:15</h6>
                    </div>
                    <div style={{ background: "#D9D9D9" }} className="w-100 h-25 px-2 pt-2 item-flex">
                        <h6 className="text-font">9:15</h6>
                        <h6 className="text-font fw-bold">Muhinov Dilshod</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

