import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import { Pagination } from '../../../reseption/components/Pagination'
import { DatePickers } from '../../../reseption/offlineclients/clientComponents/DatePickers'
import { Sort } from '../../../reseption/offlineclients/clientComponents/Sort'

const Table = ({
    changeStart,
    changeEnd,
    searchClientName,
    connectors,
    setCurrentPage,
    countPage,
    currentConnectors,
    setCurrentConnectors,
    currentPage,
    setPageSize,
    counterDoctorsList,
    changeCounterDoctor
}) => {
    const {t} = useTranslation()
    const [selected, setSelected] = useState(null)

    return (
        <div className="border-0 table-container mt-6">
            <div className="border-0 table-container">
                <div className="bg-white flex gap-6 items-center py-2 px-2">
                    <div>
                        <select
                            className="form-control form-control-sm selectpicker"
                            placeholder="Bo'limni tanlang"
                            onChange={setPageSize}
                            style={{ minWidth: '50px' }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={'all'}>{t("Barchasi")}</option>
                        </select>
                    </div>
                    <div className='w-[300px]'>
                        <Select
                            value={selected}
                            options={[
                                {
                                    label: t('Hammasi'),
                                    value: "none"
                                },
                                ...[...counterDoctorsList].map(item => ({
                                    ...item,
                                    value: item._id,
                                    label: item.firstname + ' ' + item.lastname
                                }))
                            ]}
                            onChange={(e) => {
                                setSelected(e);
                                changeCounterDoctor(e)
                            }}
                            placeholder={t("Tanlang...")}
                        />
                    </div>
                    <div>
                        <input
                            onChange={searchClientName}
                            style={{ maxWidth: '200px', minWidth: '200px' }}
                            type="search"
                            className="w-100 form-control form-control-sm selectpicker"
                            placeholder={t("Mijozning F.I.SH")}
                        />
                    </div>
                    <div className="text-center ml-auto ">
                        <Pagination
                            setCurrentDatas={setCurrentConnectors}
                            datas={connectors}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            totalDatas={connectors.length}
                        />
                    </div>
                    <div
                        className="text-center ml-auto flex gap-2"
                        style={{ overflow: 'hidden' }}
                    >
                        <DatePickers changeDate={changeStart} />
                        <DatePickers changeDate={changeEnd} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table m-0">
                        <thead>
                            <tr>
                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Yunaltiruvchi shifokor")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Yunaltiruvchini klinikasi")}
                                </th>
                                <th className='border py-1 bg-alotrade text-[16px]'>{t("Mijoz")}</th>
                                <th className='border py-1 bg-alotrade text-[16px]'>{t("Kelgan vaqti")}</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Xizmat nomi")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Umumiy narxi")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Kounteragent ulushi")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Shifokor ulushi")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConnectors.map((connector, key) => {
                                return (
                                    <tr key={key}>
                                        <td
                                            className="border py-1 font-weight-bold text-right"
                                            style={{ maxWidth: '30px !important' }}
                                        >
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border py-1 font-weight-bold text-[16px]">
                                            {connector?.counterdoctor?.lastname +
                                                ' ' +
                                                connector?.counterdoctor?.firstname}
                                        </td>
                                        <td className="border py-1 font-weight-bold text-[16px]">
                                            {connector?.counterdoctor?.clinica_name}
                                        </td>
                                        <td className="border py-1 text-left text-[16px]">
                                            {connector?.client?.lastname +
                                                ' ' +
                                                connector?.client?.firstname}
                                        </td>
                                        <td className="border py-1 text-left text-[16px]">
                                            {new Date(connector?.client?.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="border py-1 text-left text-[16px]">
                                            {connector?.service?.name}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector.totalprice}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector?.counteragent_profit}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector.counterdoctor_profit}
                                        </td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td
                                    className="border py-1 font-weight-bold text-right"
                                    style={{ maxWidth: '30px !important' }}
                                ></td>
                                <td className="border py-1 font-weight-bold text-[16px]"> </td>
                                <td className="border py-1 font-weight-bold text-[16px]"></td>
                                <td className="border py-1 text-left text-[16px]"></td>
                                <td className="border py-1 text-left text-[16px]"></td>
                                <td className="border py-1 text-left text-[16px]"></td>
                                <td className="border py-1 text-right text-[16px] font-bold">
                                    {connectors.reduce((prev, el) => prev + (el?.totalprice || 0), 0)}
                                </td>
                                <td className="border py-1 text-right text-[16px] font-bold">
                                    {connectors.reduce((prev, el) => prev + (el?.counteragent_profit || 0), 0)}
                                </td>
                                <td className="border py-1 text-right text-[16px] font-bold">
                                    {connectors.reduce((prev, el) => prev + (el?.counterdoctor_profit || 0), 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Table