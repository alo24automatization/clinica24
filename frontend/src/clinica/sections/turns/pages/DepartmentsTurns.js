import socketIOClient from "socket.io-client";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../context/AuthContext";
import Navbar from "../components/Navbar";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

const DepartmentsTurns = () => {
    const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
    const departments_ids = JSON.parse(localStorage.getItem("selected_departments")) || [];
    const auth = useContext(AuthContext);
    const [turns, setTurns] = useState([]);
    const [onlineClients, setOnlineClients] = useState([])
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('_id');
    const {t} = useTranslation()
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, {
            path: '/ws',
            withCredentials: true
        });
        socket.on("departmentsData", (data) => {
            setTurns((prevTurns) => {
                // Create a map for easy lookup of updated departments
                const dataMap = new Map(data.map(dep => [dep._id, dep]));
                // Merge the new data with existing state
                const updatedTurns = prevTurns.map(dep => dataMap.get(dep._id) || dep).concat(
                    data.filter(dep => !prevTurns.some(prevDep => prevDep._id === dep._id))
                );

                // If `id` is defined, filter the turns to only include the one matching this `id`
                const id = queryParams.get('_id');
                if (id) {
                    return updatedTurns.filter(dep => dep._id === id);
                }

                return updatedTurns;
            });
            if (data.length === 0) {
                localStorage.removeItem("spoken");
            }
            if (localStorage.getItem("spoken") !== data[0]?.turn + data[0]?.letter + data[0]?.room) {
                speakTurn(data[0]?.turn, data[0]?.room, data[0]?.letter);
            }
        });
        if (id) {
            socket.on("departmentsOnlineClientsData", (data) => {
                setOnlineClients(data)
            })
        }
        socket.on("error", (errorMessage) => {
            alert(errorMessage);
        });

        const fetchDepartments = () => {
            socket.emit("getDepartments", {
                clinicaId: auth?.clinica?._id,
                departments_ids,
            });
        };
        const fetchDepartmentsOnlineClients = () => {
            socket.emit("getDepartmentsOnline", {
                clinicaId: auth?.clinica?._id,
                departments_id: id,
            });
        };
        if (id) {
            fetchDepartmentsOnlineClients()
        }
        fetchDepartments();
        return () => {
            socket.disconnect();
            localStorage.removeItem("spoken");
        };
    }, [auth?.clinica?._id]);
    const speakTurn = (turn, room, letter) => {
        if (room && turn && letter) {
            const message = `Пациент ${letter} ${turn} прайдите в кабинет номер ${room}`;
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = "ru-RU";
            utterance.rate = 0.80;
            speechSynthesis.speak(utterance);
            localStorage.setItem("spoken", String(turn + letter + room));
        }
    };

    return (
        <div className="bg-white flex h-screen">
            <div className="w-[55%] h-screen overflow-y-auto border-r-2">
                <Navbar hasHead/>
                <ul>
                    {turns.length>0?turns?.map((item, index) => (
                        <li
                            key={index}
                            className={`border-2 border-r-0 ${
                                index === 0 ? "border-t" : "border-t-0"
                            } !grid grid-cols-3`}
                        >
                            <span className="text-blue-500 text-5xl p-4 text-center border-r-2 font-semibold">
                                {item?.letter + "-" + item?.turn}
                            </span>
                            <span className="text-orange-500 text-5xl p-4 border-r-2 text-center font-semibold">
                                Xona-{item?.room}
                            </span>
                            <span className="text-orange-500 text-5xl py-4 text-center font-semibold">
                                {item?.waiting}
                            </span>
                        </li>
                    )):<li className={"text-xl text-center font-semibold p-2"}>{t("Mijozlar mavjud emas")}</li>}
                </ul>
                {
                    id ?
                        <div className={"border-t"}>
                            <div className={"bg-[#3b82f6]"}>
                                <h1 className={"text-3xl text-center text-white font-semibold py-2"}>
                                    {t("Online navbatga yozilgan mijozlar ro'yxati")}
                                </h1>
                            </div>
                            <table className={"table border !border-x-0"}>
                                <thead>
                                <tr className={"text-xl bg-white text-black border"}>
                                    <th className={"border"}>FIO</th>
                                    <th className={"border"}>Navbat</th>
                                    <th className={"border"}>Vaqt</th>
                                </tr>
                                </thead>
                                <tbody>
                                {onlineClients.length==0?<tr className={"text-xl text-center text-black font-semibold p-2"}>
                                    <td colSpan={3}>{t("Mijozlar mavjud emas")}</td>
                                </tr>:null }
                                {onlineClients?.map(client => <tr key={client?._id} className={"text-xl font-semibold"}>
                                    <td className={"border"}>{client?.firstname + " " + client?.lastname}</td>
                                    <td className={"border"}>{client?.queue}</td>
                                    <td className={"border"}>{client.bronTime}</td>
                                </tr>)
                                }
                                </tbody>
                            </table>
                        </div>
                        : null
                }
            </div>
            {turns.length > 0 ? (
                <div className="w-[45%] flex flex-col justify-center gap-y-3 items-center">
                    <div className="border-4 border-blue-500 w-[340px] py-2">
                        <h1 className="text-9xl font-semibold text-center text-blue-500">
                            {turns[0]?.letter + "-" + turns[0]?.turn}
                        </h1>
                    </div>
                    <h1 className="text-7xl font-semibold text-orange-500">
                        Xona-{turns[0]?.room}
                    </h1>
                </div>
            ) : null}
        </div>
    );
};

export default DepartmentsTurns;
