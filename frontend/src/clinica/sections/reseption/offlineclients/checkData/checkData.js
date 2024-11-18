export const checkClientData = (client, t) => {
  if (!client.firstname) {
    return {
      title: t("Diqqat! Mijoz ismi kiritilmagan."),
      description: "",
      status: "error",
    };
  }

  if (!client.lastname) {
    return {
      title: t("Diqqat! Mijoz familiyasi kiritilmagan."),
      description: "",
      status: "error",
    };
  }

  if (client.phone && client.phone.length !== 9) {
    return {
      title: t(
        "Diqqat! Mijoz telefon raqami 9 raqamdan iborat bo'lishi kerak."
      ),
      description: "",
      status: "error",
    };
  }

  return false;
};
export const checkServicesAndTurn = (departments, services, t, notify) => {
  if (!Array.isArray(departments) || !Array.isArray(services)) {
    throw new Error(
      "Invalid input: 'departments' and 'services' must be arrays."
    );
  }
  if (services.length == 0)
    return notify({
      title: `${t("Diqqat!")} ${t("xizmatlar mavjud emas")}`,
      status: "error",
      description: "",
    });

  for (const department of departments) {
    for (const service of services) {
      if (
        department._id === service.department &&
        department.dayMaxTurns !== 0 &&
        service.turn === undefined
      ) {
        
        return notify({
          title:
            t("Diqqat!") +
            " " +
            department.name +
            " " +
            t("navbat ko'rsatilmagan!"),
          description: "",
          status: "error",
        });
      }
    }
  }

  return false;
};
export const checkServicesData = (services, t) => {
  if (services.length == 0)
    return {
      title: `${t("Diqqat!")} ${t("xizmatlar mavjud emas")}`,
      status: "error",
      description: "",
    };

  for (const service of services) {
    if (service.pieces === "0") {
      return {
        title: `${t("Diqqat!")} ${service.service.name} ${t(
          "xizmati soni 0 ko'rsatilgan."
        )}`,
        description: ``,
        status: "error",
      };
    }
  }
  return false;
};

export const checkProductsData = (products) => {
  for (const product of products) {
    if (product.pieces === "0") {
      return {
        title: `Diqqat! ${product.product.name} mahsuloti soni 0 ko'rsatilgan.`,
        description: `Iltimos mahsulot qo'shilmasa uni ro'yxatdan o'chiring yoki mahsulot sonini kiriting.`,
        status: "error",
      };
    }
  }
  return false;
};
