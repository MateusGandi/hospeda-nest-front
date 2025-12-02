import apiService from "../Axios";
import heic2any from "heic2any";
import validator from "validator";

export const match = () => window.innerWidth <= 600;

export const isMobile = match();

export const uploadImage = async (e, url) => {
  const file = e.target.files?.[0];
  if (!file) throw new Error("Nenhum arquivo selecionado.");

  try {
    let processedFile = file;

    if (
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      const blob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      });
      processedFile = new File([blob], "convertido.jpg", {
        type: "image/jpeg",
      });
    }

    const compressToJpeg = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const maxWidth = 1920;
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compress = (quality) => {
              canvas.toBlob(
                (blob) => {
                  if (!blob)
                    return reject(new Error("Falha ao gerar blob JPEG."));
                  if (blob.size > 10 * 1024 * 1024 && quality > 0.3) {
                    compress(quality - 0.1);
                  } else {
                    resolve(
                      new File([blob], ".jpg", {
                        type: "image/jpeg",
                      })
                    );
                  }
                },
                "image/jpeg",
                quality
              );
            };

            compress(0.8);
          };
          img.onerror = () => reject(new Error("Erro ao carregar imagem."));
          img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const finalFile = await compressToJpeg(processedFile);

    const formData = new FormData();
    formData.append("fotos", finalFile);

    await apiService.query("POST", url, formData);

    return "Foto adicionada com sucesso!";
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    throw new Error("Erro ao adicionar foto!");
  }
};

export const toUTC = ({
  data: dataISO,
  onlyDate = false,
  onlyHours = false,
  offsetHoras = 0,
  format = "pt",
}) => {
  try {
    if (!dataISO) return "Data inválida";

    const data = new Date(dataISO);

    if (!isNaN(offsetHoras) && offsetHoras !== 0) {
      data.setHours(data.getHours() + offsetHoras);
    }

    const dataLocal = data.toISOString();
    if (format === "en") return dataLocal.split("T")[0];

    return dataLocal
      .split("T")
      .map((item, i) =>
        i === 0
          ? item.split("-").reverse().join("/")
          : item.split(":").slice(0, 2).join(":")
      )
      .filter((_, index) => (onlyHours ? index === 1 : true))
      .filter((_, index) => (onlyDate ? index === 0 : true))
      .join(" ");
  } catch (error) {
    return "Data inválida";
  }
};

export const orderBy = (array, campo, ordem = "asc") => {
  return array.sort((a, b) => {
    if (a[campo] < b[campo]) return ordem === "asc" ? -1 : 1;
    if (a[campo] > b[campo]) return ordem === "asc" ? 1 : -1;
    return 0;
  });
};

export const colorByName = (letra) => {
  const cores = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#607D8B",
  ];

  if (!letra || typeof letra !== "string") return "#999";

  const index = letra.toUpperCase().charCodeAt(0) % cores.length;
  return cores[index];
};

export const parseHoursToString = (horario) => {
  const [hh, mm, ss] = horario.split(":").map(Number);
  let partes = [];

  if (hh > 0) partes.push(`${hh} hora${hh > 1 ? "s" : ""}`);
  if (mm > 0) partes.push(`${mm} minuto${mm > 1 ? "s" : ""}`);
  if (ss > 0) partes.push(`${ss} segundo${ss > 1 ? "s" : ""}`);

  if (partes.length === 0) return "0 segundos";
  if (partes.length === 1) return partes[0];

  return partes.slice(0, -1).join(", ") + " e " + partes[partes.length - 1];
};

export const formatTime = (valor) => {
  let numeros = valor.replace(/\D/g, "");

  if (numeros === "") return "";
  numeros = numeros.slice(0, 4);

  if (
    numeros.slice(0, 2).padEnd(2, "0") === 24 &&
    +numeros.slice(2, 4).padEnd(2, "0") > 0
  )
    return valor.slice(0, -1);
  if (numeros.slice(0, 2).padEnd(2, "0") > 24) return valor.slice(0, -1);
  if (numeros.slice(2, 4).padEnd(2, "0") > 59) return valor.slice(0, -1);
  return numeros
    .replace(/(\d{2})(\d{1})/, "$1:$2")
    .replace(/(\d{2})(\d{2})/, "$1:$2");
};

export const formatDate = (valor) => {
  if (!valor) return "";
  if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d)/g, "$1/$2");
  }
  if (valor.length > 5) {
    valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/g, "$1/$2/$3");
  }
  return valor.substring(0, 10);
};

export const formatMoney = (valor, type = "normal") => {
  if (!valor) return "0.00";

  const numeros = valor.toString().replace(/\D/g, "");

  const numeroFormatado = (parseInt(numeros, 10) / 100).toFixed(2);

  return type === "normal"
    ? numeroFormatado
    : `R$ ${numeroFormatado}`.replace(".", ",");
};

export const formatCNPJ = (value) => {
  let digits = value?.replace(/\D/g, "");
  if (!value) return "";

  digits = digits.slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const formatCEP = (value) => {
  let digits = value?.replace(/\D/g, "");
  if (!value) return "";

  digits = digits.slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
};

export const formatCPF = (value) => {
  let digits = value?.replace(/\D/g, "");
  if (!value) return "";

  digits = digits.slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

export const formatPhone = (value) => {
  let digits = value?.replace(/\D/g, "");
  if (!value) return "";
  if (!digits.startsWith("5")) {
    digits = "55" + digits;
  }

  digits = digits.slice(0, 13);

  return digits
    .replace(/^(\d{2})(\d)/, "+$1 $2")
    .replace(/(\d{2}) (\d{2})(\d)/, "$1 $2 $3")
    .replace(/(\d{5})(\d{1,4})$/, "$1 $2");
};

export const setLocalItem = (key, value) => {
  if (typeof value === "object" || Array.isArray(value)) {
    value = JSON.stringify(value);
  } else if (typeof value === "boolean" || typeof value === "number") {
    value = String(value);
  }
  window.localStorage.setItem(key, value);
};

export const getLocalItem = (key) => {
  const item = window.localStorage.getItem(key);
  if (item === null || item === "/login") return null;

  try {
    const parsed = JSON.parse(item);
    return parsed;
  } catch (e) {
    return item;
  }
};

export const removeLocalItem = (key) => {
  window.localStorage.removeItem(key);
};

export const firstUpper = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const normalizeHour = (horario, direcao = "up") => {
  const [horaStr, minutoStr] = horario.split(":");
  const hora = parseInt(horaStr, 10);
  const minuto = parseInt(minutoStr, 10);

  if (direcao === "up") {
    return minuto > 0 ? hora + 1 : hora;
  } else if (direcao === "down") {
    return hora;
  }

  throw new Error('Parâmetro "direcao" deve ser "up" ou "down"');
};

export const parsetDateToString = (dataISO, allow) => {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const data = new Date(dataISO);

  data.setHours(data.getHours() - 3);
  const [ano, mes, dia] = data.toISOString().split("T")[0].split("-");
  const temp = {
    ano,
    mes: meses[parseInt(mes, 10) - 1],
    dia,
  };
  if (!allow)
    return `${dia} de ${meses[parseInt(mes, 10) - 1].slice(0, 3)}. de ${ano}`;
  return allow.map((item) => temp[item]).join(" de ");
};

export const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

export const getDominantColorFromURL = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;

        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let i = 0; i < imageData.length; i += 40) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        const hex = `#${[r, g, b]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")}`;
        resolve(hex);
      } catch (err) {
        console.warn("Erro ao acessar pixels (possível CORS)", err);
        resolve("#363636");
      }
    };

    img.onerror = (err) => {
      console.warn("Erro ao carregar imagem (URL quebrada ou bloqueada)", err);
      resolve("#363636");
    };
  });
};

export const validateFields = async (type, data, componentValidations) => {
  const rules = componentValidations[type];

  if (!rules) throw new Error("Invalid type");

  for (const { field, validations, label } of rules) {
    const value = data[field];
    const validationList = validations.split(",").map((v) => v.trim());

    for (const validation of validationList) {
      if (
        validation === "required" &&
        (value === undefined || value === "" || value === null)
      ) {
        throw new Error(`${label || firstUpper(field)} is required.`);
      }

      if (validation.startsWith("minLength(")) {
        const min = parseInt(validation.match(/\d+/)[0], 10);
        if (!value || value.length < min) {
          throw new Error(
            `${
              label || firstUpper(field)
            } must have at least ${min} characters.`
          );
        }
      }
      if (validation === "email" && value && !validator.isEmail(value)) {
        throw new Error(`${label || firstUpper(field)} is invalid`);
      }

      if (
        validation === "phone" &&
        value &&
        !validator.isMobilePhone(value.replace(/\D/g, ""), "pt-BR")
      ) {
        throw new Error(`${label || firstUpper(field)} is invalid`);
      }

      if (validation.startsWith("equal(")) {
        const otherField = validation.match(/\(([^)]+)\)/)[1];
        if (value !== data[otherField]) {
          throw new Error(
            `${firstUpper(label || field)} must be equal to ${(
              rules.find((r) => r.field === otherField)?.label || otherField
            ).toLowerCase()}.`
          );
        }
      }
    }
  }
};
