import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal, Modal as Modal2 } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkClientData, checkProductsData, checkServicesData, } from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";
import { useTranslation } from "react-i18next";
import registImg from "./image.svg"
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
    //====================================================================
    //====================================================================
    const {t} = useTranslation()
    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false);

    const changeVisible = () => setVisible(!visible);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;
    const [currentConnectors, setCurrentConnectors] = useState([]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
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
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    console.log(connectors);
    const [searchStorage, setSearchStrorage] = useState([]);

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
    //====================================================================
    //====================================================================+

    //====================================================================
    //====================================================================
    // SEARCH
    const searchFullname = (e) => {
            const searching = searchStorage.filter((item) =>
                (item.firstname + item.lastname)
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, countPage));
        },
        [countPage, connectors]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
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

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
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

    const changeClientData = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    const changeClientBorn = (e) => {
        setClientDate(e.target.value)
        setClient({ ...client, brondate: new Date(e.target.value) });
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CLEAR

    const clearDatas = useCallback(() => {
        setClient({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
    }, [auth]);

    const checkData = () => {
        if (checkClientData(client, t)) {
            return notify(checkClientData(client, t));
        }
        setModal(true);
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
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
        beginDay,
        endDay,
    ]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
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
    };

    //====================================================================
    //====================================================================

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

    //====================================================================
    //====================================================================
    // useEffect
    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getConnectors(beginDay, endDay);
            getDepartments();
            getBaseUrl();
        }
    }, [
        auth,
        getConnectors, 
        s,
        getDepartments,
        getBaseUrl,
        beginDay,
        endDay,
    ]);

    //====================================================================
    //====================================================================

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date().toLocaleDateString();
        setCurrentDate(today);
    }, []);

    const appointments = [
        { date: "27.09.2024", name: "Муминов Дилшод", time: "09:45", phone: "+998999232444" },
    ];

    const scheduledAppointments = [
  {
    date: "27.06.2024",
    name: "Муминов Дилшод",
    time: "09:45",
    phone: "+998999232444",
  },
  {
    date: "27.06.2024",
    name: "Алижонов Одил",
    phone: "+998999232444",
  },
];

const waitingList = [
  {
    timeSlot: "12:00-12:30",
    name: "Алижонов Одил",
    phone: "+998999232444",
  },
  {
    timeSlot: "12:30-13:00",
    room: "Г12",
    name: "Алижонов Одил",
    phone: "+998999232444",
  },
  {
    timeSlot: "13:00-13:30",
    room: "Г13",
    name: "Алижонов Одил",
    phone: "+998999232444",
  },
];



    return (
        <div>
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <button className="register-btn btn ms-2 d-flex align-items-center"><img
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
                                placeholder="ФИО" />

                            <div style={{
                                width: "15%",
                            }}
                                className="d-flex align-items-center">
                                <label className="me-3">Vaqt
                                    <input type="checkbox" name="vaqt" />
                                </label>
                                <label>Navbat
                                    <input type="checkbox" name="navbat" />
                                </label>
                            </div>

                            <select style={{ width: '200px' }}
                                className="options-select form-select w-auto">
                                {connectors.map((option, index) => (
                                    <option key={index} value={option._id}>
                                        {option.firstname} {option.lastname}
                                    </option>
                                ))}
                            </select>
                            <div style={{
                                marginLeft: "auto"
                            }} className="current-date fw-bold">{currentDate}</div>
                        </div>

                        <div className="row pt-2">
                            {/* Left Column */}
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
                                        <h5>Кабулга ёзилганлар</h5>
                                        {scheduledAppointments.map((appointment, idx) => (
                                            <div key={idx} className="card mb-2 shadow-sm" style={{ borderRadius: "10px", backgroundColor: "#e0f7fa" }}>
                                                <div className="card-body d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <p className="text-muted mb-1">{appointment.date}</p>
                                                        <h6 className="mb-1">{appointment.name}</h6>
                                                        <p className="text-muted mb-0">{appointment.phone}</p>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <p className="me-3 text-primary" style={{ fontWeight: "bold" }}>{appointment.time}</p>
                                                        <i className="bi bi-telephone-fill text-success me-3" style={{ fontSize: "1.5rem" }}></i>
                                                        <i className="bi bi-trash-fill text-danger" style={{ fontSize: "1.5rem" }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Waiting list column */}
                                    <div className="col-md-6">
                                        <h5>Кутатянлар</h5>
                                        {waitingList.map((person, idx) => (
                                            <div key={idx} className="card mb-2 shadow-sm" style={{ borderRadius: "10px", backgroundColor: "#e0f7fa" }}>
                                                <div className="card-body d-flex justify-content-between align-items-center">
                                                    <div>
                                                        {person.room && <p className="text-muted mb-1">{person.room}</p>}
                                                        <h6 className="mb-1">{person.name}</h6>
                                                        <p className="text-muted mb-0">{person.phone}</p>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <p className="me-3 text-primary" style={{ fontWeight: "bold" }}>{person.timeSlot}</p>
                                                        <i className="bi bi-arrow-right-circle-fill text-success me-3" style={{ fontSize: "1.5rem" }}></i>
                                                        <i className="bi bi-trash-fill text-danger" style={{ fontSize: "1.5rem" }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-12 col-md-8 pl-0">
                                <div
                                    className="content-box"
                                    style={{
                                        border: '2px solid #10A98A',
                                        borderBottom: "0px",
                                        borderRight: "0px",
                                        padding: '10px',
                                        minHeight: "500px"
                                    }}
                                >
                                    <h5>Кабинет-1 & Кабинет-2</h5>
                                    <div className="row">
                                        {/* Rooms and Time Slots */}
                                        {[].map((room, idx) => (
                                            <div key={idx} className="col-6">
                                                <h6>{room.room}</h6>
                                                {room.slots.map((slot, sidx) => (
                                                    <div key={sidx} className="border-bottom py-2">
                                                        <strong>{slot.time}</strong> - {slot.person}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
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
        </div>
    );
};
