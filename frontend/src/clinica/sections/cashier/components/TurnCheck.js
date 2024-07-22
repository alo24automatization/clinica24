import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const TurnCheck = (props) => {
    const {clinica, connector} = props;
    const {t} = useTranslation();
    const [departments, setDeparmtents] = useState([]);
    useEffect(() => {
        if (connector && connector.services && connector.services.length > 0) {
            let all = [];
            for (const service of connector?.services) {
                let isExist = [...all].findIndex(
                    (item) => item?.department === service?.department?._id
                );
                if (isExist >= 0) {
                    all[isExist].turn = service.turn;
                } else {
                    all.push({
                        department: service?.department?._id,
                        name: service?.department?.name,
                        turn: service?.turn,
                        letter: service?.department?.letter,
                        room: service?.department?.room,
                        floor: service?.department?.floor,
                        probirka: service?.department?.probirka,
                        brondate: connector.client.was_online
                            ? connector.client.brondate
                            : null,
                        bronTime: connector.client.was_online
                            ? connector.client.bronTime
                            : null,
                    });
                }
            }
            setDeparmtents(all);
        }
    }, [connector]);
    // Check if services is defined and log its contents
    return (
        departments.map((item,index) => <div key={item._id}
                                             className={`w-full ${index === 0 ? "mt-2" : "mt-10"} border-b-4 p-2 pb-5 border-black`}>
            <div
                className={"w-full gap-y-2 flex flex-col justify-center items-center"}
            >
                <h1 className={"text-xl font-semibold text-center"}>
                    {clinica?.name}
                </h1>
                <h1 className={"border-b-2 text-2xl  border-black font-semibold text-center"}>
                    {item.name}
                </h1>
                <span
                    className={"border-2 mt-3 border-black font-semibold text-center text-6xl px-4 py-2"}>
                    {item?.letter + "-" + item?.turn}
                                                        </span>
                <div className={"grid grid-cols-2 mt-1"}>
                   <span
                       className={"border-r-2  px-2 border-black text-3xl font-semibold text-right mr-1"}>{item?.floor}</span>
                    <span
                        className={" text-3xl px-2 font-semibold"}>{item?.room}-Xona</span>
                </div>
            </div>
            <div className={"mt-3"}>
                {connector.services.length > 0 &&
                    connector?.services
                        .filter(service => service?.department?._id === item.department)
                        .map((service, index) => (
                            <div key={service._id} className="text-left text-[18px] font-bold">
                                {index + 1}. {service.service.name}
                            </div>
                        ))}
            </div>
        </div>)
    );
};

export default TurnCheck;
