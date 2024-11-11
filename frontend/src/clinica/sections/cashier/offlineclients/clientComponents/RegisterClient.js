import {
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
// import { DatePickers } from "./DatePickers";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export const RegisterClient = ({
  IsPayFromReseptionAndMonoblok,
  inputPayment,
  setOpenPayModal,
  openPayModal,
  totalpayment,
  checkPayment,
  createHandler,
  debtComment,
  changeDebt,
  serviceComment,
  productComment,
  discountComment,
  discount,
  changeDiscount,
  setPayment,
  changeProduct,
  changeService,
  payments,
  payment,
  client,
  index,
  services,
  products,
  setSetvices,
  setProducts,
  loading,
  connector,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [payModaVisible, setPayModalVisible] = useState(false);

  useEffect(() => {
    const isMonoBlok =
      sessionStorage.getItem("modeMonoblok") === "modeMonoblok";
    const timer = setTimeout(() => {
      if (isMonoBlok) {
        setPayModalVisible(IsPayFromReseptionAndMonoblok);
      }
    }, 300);
    // Clean up thetimer when the component unmounts
    return () => clearTimeout(timer);
  }, [openPayModal]);

  const calcServicesNDS =
    services &&
    services
      .filter((service) => !service.refuse)
      .reduce(
        (sum, { service }) =>
          sum + (service.price * (service?.priceNDS || 0)) / 100,
        0
      );
  const handlePay = () => {
    const isChecked = checkPayment();
    if (isChecked) {
      createHandler();
      toogleClosePayModal();
    }
  };
  const toogleClosePayModal = () => {
    setPayModalVisible(false);
    setOpenPayModal(false)
    sessionStorage.removeItem("modeMonoblok");
    sessionStorage.removeItem("client_id");
  };

  return (
    <>
      {/* Row start */}
      <div className="row gutters">
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                {t("Mijozning shaxsiy ma'lumotlari")}
              </div>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border py-1 bg-alotrade"></th>
                    <th scope="col" className="border py-1 bg-alotrade"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 border">{t("Familiyasi")}</td>
                    <td className="py-1 border">{client.lastname}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Ismi")}</td>
                    <td className="py-1 border">{client.firstname}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Otasining ismi")}</td>
                    <td className="py-1 border">{client.fathername}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Tug'ilgan sanasi")}</td>
                    <td className="py-1 border">
                      {client.born &&
                        new Date(client.born).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Telefon raqami")}</td>
                    <td className="py-1 border">+998{client.phone}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("ID")}</td>
                    <td className="py-1 border">{client.id}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Probirka")}</td>
                    <td className="py-1 border">{connector.probirka}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                {t("Xizmat va tolovlar bilan ishlash bo'limi")}
              </div>
            </div>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-12">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th className="border py-1 bg-alotrade">№</th>
                        <th className="border py-1 bg-alotrade">{t("Nomi")}</th>
                        <th className="border py-1 bg-alotrade">
                          {t("Narxi")}
                        </th>
                        <th className="border py-1 bg-alotrade">{t("QQS")}</th>
                        <th className="border py-1 bg-alotrade">{t("Soni")}</th>
                        <th className="border py-1 bg-alotrade">
                          {t("To'lov")}
                        </th>
                        <th className="border py-1 bg-alotrade">{t("Izoh")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services &&
                        services.map((service, index) => {
                          return (
                            <tr key={index}>
                              <td
                                className={`${
                                  service?.isPayment
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                } py-1 border`}
                              >
                                {index + 1}
                              </td>
                              <td className="py-1 border">
                                {service.service.name}
                              </td>
                              <td className="text-right py-1 border">
                                {service.service.price * service.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                {(service.service.price *
                                  (service?.service?.priceNDS || 0)) /
                                  100}
                              </td>
                              <td className="text-right py-1 border">
                                {service.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                <div className="custom-control custom-checkbox text-center">
                                  <input
                                    defaultChecked={!service.refuse}
                                    type="checkbox"
                                    className="custom-control-input border border-dager"
                                    id={`service${index}`}
                                    onChange={(e) => changeService(e, index)}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`service${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td className="text-right py-1 border">
                                {/* {service.refuse ? (
                                  <input
                                    onChange={(e) => serviceComment(e, index)}
                                    defaultValue={service.comment}
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="comment"
                                    name="comment"
                                    placeholder={t("Izoh")}
                                  />
                                ) : ( */}
                                {service?.addUser}
                                {/* )} */}
                              </td>
                            </tr>
                          );
                        })}
                      <tr></tr>
                      {products &&
                        products.map((product, index) => {
                          return (
                            <tr key={index}>
                              <td className="py-1 border">{index + 1}</td>
                              <td className="py-1 border">
                                {product.product.name}
                              </td>
                              <td className="text-right py-1 border">
                                {product.product.price * product.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                {product.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                <div className="custom-control custom-checkbox text-center">
                                  <input
                                    defaultChecked={!product.refuse}
                                    type="checkbox"
                                    className="custom-control-input border border-dager"
                                    id={`product${index}`}
                                    onChange={(e) => changeProduct(e, index)}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`product${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td className="text-right py-1 border">
                                {product.refuse && (
                                  <input
                                    onChange={(e) => productComment(e, index)}
                                    defaultValue={product.comment}
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="comment"
                                    name="comment"
                                    placeholder={t("Izoh")}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="bg-white">
                        <td
                          className="border py-1 font-bold text-right text-teal-600 text-sm "
                          colSpan={2}
                        >
                          {" "}
                          {t("Jami")}
                        </td>
                        <td
                          className="border py-1 font-bold  text-teal-600 text-sm"
                          colSpan={1}
                        >
                          {" "}
                          {totalpayment}
                        </td>
                        <td
                          className="border py-1 font-bold text-right text-teal-600 text-sm "
                          colSpan={""}
                        >
                          {" "}
                          QQS: {calcServicesNDS}
                        </td>
                        <td
                          className="border py-1 font-bold text-right  text-teal-600 text-sm"
                          colSpan={3}
                        >
                          {" "}
                          To'lovga: {totalpayment + calcServicesNDS}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t("Hisobot")}</div>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tfoot>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("Jami to'lov")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {totalpayment + calcServicesNDS}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("Chegirma")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {discount.discount}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("To'langan")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {payments}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("Qarz")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {payment.debt}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("To'lanayotgan")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {totalpayment -
                        payments -
                        discount.discount -
                        payment.debt +
                        calcServicesNDS}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
          <Modal
            isOpen={payModaVisible}
            onClose={toogleClosePayModal}
            closeOnEsc
            size="2xl"
          >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
            <ModalContent>
              <ModalHeader>
                <div className="flex items-center justify-between">
                  <h1>{t("To'lov qabul qilish")}</h1>
                  <CloseButton onClick={toogleClosePayModal} />
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <div className="w-full">
                        <div
                          className="btn-group mb-3 w-100"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            onClick={() => {
                              setPayment({
                                ...payment,
                                type: "cash",
                                payment:
                                  totalpayment -
                                  payments -
                                  discount.discount -
                                  payment.debt +
                                  calcServicesNDS,
                                cash:
                                  totalpayment -
                                  payments -
                                  discount.discount -
                                  payment.debt +
                                  calcServicesNDS,
                                card: 0,
                                transfer: 0,
                              });
                            }}
                            type="button"
                            className={`btn text-[12pt] btn-sm py-4 text-white  ${
                              payment.type === "cash"
                                ? "bg-amber-500"
                                : "bg-alotrade"
                            }`}
                          >
                            {t("Naqt")}
                          </button>
                          <button
                            onClick={() => {
                              setPayment({
                                ...payment,
                                type: "card",
                                payment:
                                  totalpayment -
                                  payments -
                                  discount.discount -
                                  payment.debt +
                                  calcServicesNDS,
                                cash: 0,
                                card:
                                  totalpayment -
                                  payments -
                                  discount.discount -
                                  payment.debt +
                                  calcServicesNDS,
                                transfer: 0,
                              });
                            }}
                            type="button"
                            className={`btn btn-sm text-[12pt] py-4 text-white ${
                              payment.type === "card"
                                ? "bg-amber-500"
                                : "bg-alotrade"
                            }`}
                          >
                            {t("Plastik")}
                          </button>
                          <button
                            onClick={() => {
                              setPayment({
                                ...payment,
                                type: "transfer",
                                payment:
                                  totalpayment -
                                  payments -
                                  discount.discount -
                                  payment.debt +
                                  calcServicesNDS,
                                cash: 0,
                                card: 0,
                                transfer:
                                  totalpayment -
                                  payments -
                                  discount.discount -
                                  payment.debt +
                                  calcServicesNDS,
                              });
                            }}
                            type="button"
                            className={`btn text-[12pt] btn-sm py-4 text-white ${
                              payment.type === "transfer"
                                ? "bg-amber-500"
                                : "bg-alotrade"
                            }`}
                          >
                            {t("O'tkazma")}
                          </button>
                          <button
                            onClick={() => {
                              setPayment({
                                ...payment,
                                type: "mixed",
                                cash: 0,
                                card: 0,
                                transfer: 0,
                              });
                            }}
                            type="button"
                            className={`btn text-[12pt] btn-sm py-4 text-white ${
                              payment.type === "mixed"
                                ? "bg-amber-500"
                                : "bg-alotrade"
                            }`}
                          >
                            {t("Aralash")}
                          </button>
                        </div>
                        {(payment.type === "cash" ||
                          payment.type === "mixed") && (
                          <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend w-25">
                              <span
                                className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                id="inputGroup-sizing-sm"
                                style={{ fontSize: "12pt" }}
                              >
                                {t("Naqt")}
                              </span>
                            </div>
                            <input
                              type="number"
                              className="form-control py-4"
                              placeholder={t("Naqt to'lov")}
                              value={payment.cash || ""}
                              name="cash"
                              onChange={(e) => inputPayment(e)}
                            />
                          </div>
                        )}
                        {(payment.type === "card" ||
                          payment.type === "mixed") && (
                          <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend w-25">
                              <span
                                className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                id="inputGroup-sizing-sm"
                                style={{ fontSize: "12pt" }}
                              >
                                {t("Plastik")}
                              </span>
                            </div>
                            <input
                              type="number"
                              className="form-control py-4"
                              placeholder={t("Karta orqali to'lov")}
                              value={payment.card || ""}
                              name="card"
                              onChange={(e) => inputPayment(e)}
                            />
                          </div>
                        )}
                        {(payment.type === "transfer" ||
                          payment.type === "mixed") && (
                          <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend w-25">
                              <span
                                className="w-100 input-group-text bg-primary text-white font-weight-bold"
                                id="inputGroup-sizing-sm"
                                style={{ fontSize: "12pt" }}
                              >
                                {t("O'tkazma")}
                              </span>
                            </div>
                            <input
                              type="number"
                              className="form-control py-4"
                              placeholder={t("O'tkazma to'lov")}
                              value={payment.transfer || ""}
                              name="transfer"
                              onChange={(e) => inputPayment(e)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend w-25">
                          <span
                            className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                            id="inputGroup-sizing-sm"
                            style={{ fontSize: "12pt" }}
                          >
                            {t("Chegirma")}
                          </span>
                        </div>
                        {discount.procient ? (
                          <input
                            onChange={changeDiscount}
                            type="number"
                            className="form-control py-4"
                            placeholder={t(
                              "Chegirma foizi yoki summasini kiriting"
                            )}
                            defaultValue={discount.discount}
                          />
                        ) : (
                          <input
                            onChange={changeDiscount}
                            type="number"
                            className="form-control py-4"
                            placeholder={t(
                              "Chegirma foizi yoki summasini kiriting"
                            )}
                            value={discount.discount || ""}
                          />
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-sm">
                        <div className="input-group-prepend w-25">
                          <label
                            className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                            htmlFor="inputGroupSelect01"
                            style={{ fontSize: "12pt" }}
                          >
                            {t("Izoh")}
                          </label>
                        </div>
                        <select
                          onChange={discountComment}
                          className="custom-select py-4"
                          id="inputGroupSelect01"
                        >
                          <option value="delete">{t("Tanlang...")}</option>
                          <option value="Kam ta'minlangan">
                            {t("Kam ta'minlangan")}
                          </option>
                          <option value="Direktor tanishi">
                            {t("Direktor tanishi")}
                          </option>
                          <option value="Nogironligi mavjud">
                            {t("Nogironligi mavjud")}
                          </option>
                          <option value="Doimiy mijoz">
                            {t("Doimiy mijoz")}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend w-25">
                          <span
                            className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                            id="inputGroup-sizing-sm"
                            style={{ fontSize: "12pt" }}
                          >
                            {t("Qarz")}
                          </span>
                        </div>
                        <input
                          onChange={(e) => changeDebt(e, calcServicesNDS)}
                          type="number"
                          className="form-control py-4"
                          placeholder={t("Qarz summasini kiriting")}
                          value={payment.debt || ""}
                        />
                      </div>
                    </div>
                    <div className="form-group m-0 mb-3">
                      <div className="input-group input-group-sm">
                        <div className="input-group-prepend w-25">
                          <span
                            className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                            id="inputGroup-sizing-sm"
                            style={{ fontSize: "12pt" }}
                          >
                            {t("Izoh")}
                          </span>
                        </div>
                        <input
                          onChange={debtComment}
                          type="text"
                          className="form-control py-4"
                          placeholder={t("Qarz izohini kiriting")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="text-right w-full">
                  {loading ? (
                    <button className="btn btn-warning" disabled>
                      <span className="spinner-border spinner-border-sm"></span>
                      Loading...
                    </button>
                  ) : (
                    <button
                      onClick={handlePay}
                      className="btn py-4 btn-warning w-100"
                    >
                      {t("Qabul qilish")}
                    </button>
                  )}
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t("To'lov qabul qilish")}</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Chegirma")}
                        </span>
                      </div>
                      {discount.procient ? (
                        <input
                          onChange={changeDiscount}
                          type="number"
                          className="form-control"
                          placeholder={t(
                            "Chegirma foizi yoki summasini kiriting"
                          )}
                          defaultValue={discount.discount}
                        />
                      ) : (
                        <input
                          onChange={changeDiscount}
                          type="number"
                          className="form-control"
                          placeholder={t(
                            "Chegirma foizi yoki summasini kiriting"
                          )}
                          value={discount.discount || ""}
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend w-25">
                        <label
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          htmlFor="inputGroupSelect01"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Izoh")}
                        </label>
                      </div>
                      <select
                        onChange={discountComment}
                        className="custom-select"
                        id="inputGroupSelect01"
                      >
                        <option value="delete">{t("Tanlang...")}</option>
                        <option value="Kam ta'minlangan">
                          {t("Kam ta'minlangan")}
                        </option>
                        <option value="Direktor tanishi">
                          {t("Direktor tanishi")}
                        </option>
                        <option value="Nogironligi mavjud">
                          {t("Nogironligi mavjud")}
                        </option>
                        <option value="Doimiy mijoz">
                          {t("Doimiy mijoz")}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Qarz")}
                        </span>
                      </div>
                      <input
                        onChange={(e) => changeDebt(e, calcServicesNDS)}
                        type="number"
                        className="form-control"
                        placeholder={t("Qarz summasini kiriting")}
                        value={payment.debt || ""}
                      />
                    </div>
                  </div>
                  <div className="form-group m-0 mb-3">
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Izoh")}
                        </span>
                      </div>
                      <input
                        onChange={debtComment}
                        type="text"
                        className="form-control"
                        placeholder={t("Qarz izohini kiriting")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 ">
                  <div
                    className="btn-group mb-3 w-100"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "cash",
                          payment:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt +
                            calcServicesNDS,
                          cash:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt +
                            calcServicesNDS,
                          card: 0,
                          transfer: 0,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white  ${
                        payment.type === "cash" ? "bg-amber-500" : "bg-alotrade"
                      }`}
                    >
                      {t("Naqt")}
                    </button>
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "card",
                          payment:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt +
                            calcServicesNDS,
                          cash: 0,
                          card:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt +
                            calcServicesNDS,
                          transfer: 0,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white ${
                        payment.type === "card" ? "bg-amber-500" : "bg-alotrade"
                      }`}
                    >
                      {t("Plastik")}
                    </button>
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "transfer",
                          payment:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt +
                            calcServicesNDS,
                          cash: 0,
                          card: 0,
                          transfer:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt +
                            calcServicesNDS,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white ${
                        payment.type === "transfer"
                          ? "bg-amber-500"
                          : "bg-alotrade"
                      }`}
                    >
                      {t("O'tkazma")}
                    </button>
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "mixed",
                          cash: 0,
                          card: 0,
                          transfer: 0,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white ${
                        payment.type === "mixed"
                          ? "bg-amber-500"
                          : "bg-alotrade"
                      }`}
                    >
                      {t("Aralash")}
                    </button>
                  </div>
                  {(payment.type === "cash" || payment.type === "mixed") && (
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-primary text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Naqt")}
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={t("Naqt to'lov")}
                        value={payment.cash || ""}
                        name="cash"
                        onChange={(e) => inputPayment(e)}
                      />
                    </div>
                  )}
                  {(payment.type === "card" || payment.type === "mixed") && (
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-primary text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Plastik")}
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={t("Karta orqali to'lov")}
                        value={payment.card || ""}
                        name="card"
                        onChange={(e) => inputPayment(e)}
                      />
                    </div>
                  )}
                  {(payment.type === "transfer" ||
                    payment.type === "mixed") && (
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-primary text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("O'tkazma")}
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={t("O'tkazma to'lov")}
                        value={payment.transfer || ""}
                        name="transfer"
                        onChange={(e) => inputPayment(e)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3">
              <div className="text-right">
                {loading ? (
                  <button className="btn btn-warning" disabled>
                    <span className="spinner-border spinner-border-sm"></span>
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={checkPayment}
                    className="btn btn-warning w-100"
                  >
                    {t("Qabul qilish")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Row end */}
    </>
  );
};
