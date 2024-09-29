import {  useToast } from "@chakra-ui/react";
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
import deleteImg from "./image 29.svg"
import payImg from "./image 30.svg"
import './newOnlineClient.css'

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
    const [visible, setVisible] = useState(true);
    const changeVisible = () => setVisible(!visible);
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;
    const [currentConnectors, setCurrentConnectors] = useState([]);

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
    
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [waitingconnectors, setWaitingConnectors] = useState([]);
    const [scheduledAppointments, setScheduledAppointments] = useState([]);
    const [doctor, setDoctor] = useState("{}");
    const [searchStorage, setSearchStrorage] = useState([]);

    const [filteredCurrentConnectors, setFilteredCurrentConnectors] = useState([]);
    const [_, setFilterStatus] = useState("all");
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
                setSearchStrorage(data);
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

    useEffect(()=>{
        if (doctor) {
            getScheduledAppointmentsConnectors(doctor)
        }
    }, [doctor])
    
    // SEARCH
    const searchFullname = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setWaitingConnectors(searching);
        },
        [searchStorage, countPage]
    );
    
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, countPage));
        },
        [countPage, connectors]
    );
    
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

    const changeClientData = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    const changeClientBorn = (e) => {
        setClientDate(e.target.value)
        setClient({ ...client, brondate: new Date(e.target.value) });
    };
    
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

    return (
        <div>
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
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
                            }} className="current-date fw-bold">{currentDate}</div>
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
                                        {(filteredCurrentConnectors.length ? filteredCurrentConnectors : scheduledAppointments).map((appointment, idx) => (
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
                                                                        src={payImg}
                                                                        alt="Plus Icon"
                                                                        style={{
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            marginRight: "5px"
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button>
                                                                    <img
                                                                        src={deleteImg}
                                                                        alt="Plus Icon"
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