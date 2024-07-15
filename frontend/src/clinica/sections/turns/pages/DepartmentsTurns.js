import socketIOClient from "socket.io-client";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../context/AuthContext";
import Navbar from "../components/Navbar";

const DepartmentsTurns = () => {
    const ENDPOINT =
        process.env.REACT_APP_API_ENDPOINT;
    const departments_ids =
        JSON.parse(localStorage.getItem("selected_departments")) || [];
    const auth = useContext(AuthContext);
    const [turns, setTurns] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, {
            path: '/ws',
            withCredentials: true
        })
        console.log(socket)
        socket.on("departmentsData", (data) => {
            setTurns(data);
            console.log(data)
            if (data.length === 0) {
                localStorage.removeItem("spoken");
            }
            if (
                localStorage.getItem("spoken") !==
                data[0]?.turn + data[0]?.letter + data[0]?.room
            ) {
                speakTurn(data[0]?.turn, data[0]?.room, data[0]?.letter);
            }
        });
        socket.on("error", (errorMessage) => {
            alert(errorMessage);
        });

        const fetchDepartments = () => {
            socket.emit("getDepartments", {
                clinicaId: auth?.clinica?._id,
                departments_ids,
            });
        };
        fetchDepartments();
        return () => {
            socket.disconnect();
            localStorage.removeItem("spoken");
        };
    }, [auth?.clinica?._id]);

    const speakTurn = (turn, room, letter) => {
        if (room && turn && letter) {
            const message = `клиент номер ${letter}-${turn}, приходи в Кабинет ${room}`;
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = "ru-RU";
            speechSynthesis.speak(utterance);
            localStorage.setItem("spoken", String(turn + letter + room));
        }
    };

    return (
        <div className="bg-white flex h-screen">
            <div className="w-[55%] h-screen overflow-y-auto border-r-2">
                <Navbar hasHead/>
                <ul className="">
                    {turns?.map((item, index) => (
                        <li
                            key={index}
                            className={`border-2 border-r-0 ${
                                index === 0 ? "border-t" : "border-t-0"
                            } !grid grid-cols-2`}
                        >
              <span className="text-blue-500 text-5xl p-4 text-center border-r-2 font-semibold">
                {item?.letter + "-" + item?.turn}
              </span>
                            <span className="text-orange-500 text-5xl p-4 text-center font-semibold">
                Xona-{item?.room}
              </span>
                        </li>
                    ))}
                </ul>
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
