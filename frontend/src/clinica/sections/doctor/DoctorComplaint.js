import { Button, useToast } from '@chakra-ui/react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { t } from 'i18next'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { Loader } from "../../loader/Loader";

const DoctorComplaint = () => {
    const [columnsType, setColumnsType] = useState("complaint");
    const [data, setData] = useState({})
    const auth = useContext(AuthContext)
    const { request, loading } = useHttp();
    const [inputValue, setInputValue] = useState("")
    const [editingIndex, setEditingIndex] = useState(null)
    useEffect(() => {
        getData()
    }, [])
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
    const getData = async () => {
        try {
            const response = await request(`/api/doctor/complaint?clinica=${auth?.clinica?._id}&doctor=${auth?.userId}`,
                "GET",
                null, {
                Authorization: `Bearer ${auth.token}`,
            });
            setData(response)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }
    const changeColumnsType = (type) => setColumnsType(type);
    const handleCreate = async (isUpdate) => {
        try {
            await request(`/api/doctor/complaint?clinica=${auth?.clinica?._id}&doctor=${auth?.userId}`,
                "POST",
                { type: columnsType, value: inputValue, index: isUpdate ? editingIndex : undefined }, {
                Authorization: `Bearer ${auth.token}`,
            });
            getData()
            setEditingIndex(null)
            setInputValue("")
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }
    const handleUpdate = (item, index) => {
        setInputValue(item)
        setEditingIndex(index)
    }
    return (
        <div className='bg-slate-100 content-wrapper px-lg-5 px-3 '>
            <div>
                <div className='flex items-center gap-x-3'>
                    <Button onClick={() => changeColumnsType("complaint")} variant={columnsType === "complaint" ? "solid" : "outline"} colorScheme='green' className='focus:!shadow-none' >
                        {t("Shikoyat turlari")}
                    </Button>
                    <Button onClick={() => changeColumnsType("diagnostics")} variant={columnsType === "diagnostics" ? "solid" : "outline"} colorScheme='green' className='focus:!shadow-none'>
                        {t("Diagnoz turlari")}
                    </Button>
                </div>
                <div className='mt-3 w-[400px] flex items-center gap-x-3'>
                    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={columnsType === "complaint" ? t("Yangi shikoyat turi yaratish") : t("Yangi diagnoz turi yaratish")} className='form-control form-control-sm' />
                    <Button
                        disabled={editingIndex !== null}
                        onClick={() => handleCreate()}
                        colorScheme='green' className='focus:!shadow-none'
                    ><FontAwesomeIcon className='text-base font-bold' icon={faPlus} /></Button>
                </div>
            </div>
            <ul className='mt-4 h-[calc()] overflow-y-auto'>
                {
                    loading ? <Loader /> :
                        data[columnsType]?.map((item, index) => <li key={`${item}_${index}`}>
                            <div className={` flex items-center justify-between gap-x-3`}>
                                <div className={`border-2 flex items-center  ${index !== 0 ? "border-t-0" : ""} w-[70%]`}>
                                    <span className='border-r-2 !w-[60px] flex items-center justify-center h-[57px] '>{index + 1}</span>
                                    <span className='pl-2'> {item}</span>
                                </div>
                                <div className="flex justify-start w-[30%] gap-x-3">
                                    <Button
                                        onClick={() => handleUpdate(item, index)}
                                        className='focus:!shadow-none text-white !bg-[#F97316]'
                                    >{t("Tahrirlash")}</Button>
                                    {editingIndex === index ? <Button
                                        onClick={() => handleCreate("update")}
                                        colorScheme='green' className='focus:!shadow-none'
                                    >{t("Saqlash")}</Button> : null}
                                </div>
                            </div>
                        </li>)
                }
            </ul>
        </div>
    )
}

export default DoctorComplaint