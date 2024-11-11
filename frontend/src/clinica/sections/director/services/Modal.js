import React from "react";
import { useTranslation } from "react-i18next";

export const DepartmentsModal = ({
  modal,
  setModal,
  handler,
  children,
  closeHandler,
  confirm,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`modal fade show ${modal ? "" : "d-none"}`}
      id="customModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="customModalLabel"
      style={{ display: "block" }}
      aria-modal="true"
    >
      <div
        className="modal-dialog max-w-[800px] min-h-[90%] h-[90%] overflow-y-auto"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ fontSize: "16pt" }}
              className="modal-title font-weight-bold text-uppercase text-center  w-100"
              id="customModalLabel"
            >
              {t("Diqqat!")}
            </h5>
          </div>
          <div className="modal-body">
            <div className="">{children}</div>
          </div>
          <div className="modal-footer custom">
            <div className="left-side">
              <button
                className="btn btn-link danger w-100"
                data-dismiss="modal"
                onClick={() => closeHandler()}
              >
                {t("Bekor qilish")}
              </button>
            </div>
            <div className="divider" />
            <div className="right-side">
              <button onClick={handler} className="btn btn-link success w-100">
                {confirm || t("Tasdiqlash")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
