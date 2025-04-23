import ColorThief from "colorthief";

export const match = () => window.innerWidth <= 600;

export const isMobile = match();

const timezones = {
  noronha: "America/Noronha",
  belem: "America/Belem",
  fortaleza: "America/Fortaleza",
  recife: "America/Recife",
  araguaina: "America/Araguaina",
  maceio: "America/Maceio",
  bahia: "America/Bahia",
  sao_paulo: "America/Sao_Paulo",
  campo_grande: "America/Campo_Grande",
  cuiaba: "America/Cuiaba",
  santarem: "America/Santarem",
  porto_velho: "America/Porto_Velho",
  boa_vista: "America/Boa_Vista",
  manaus: "America/Manaus",
  eirunepe: "America/Eirunepe",
  rio_branco: "America/Rio_Branco",
};

export const formatarData = (dataISO, timeZone = "rio_branco") => {
  const data = new Date(dataISO);

  // Adiciona 3 horas à data
  data.setHours(data.getHours() + 3);

  const titulo = data.toLocaleTimeString("pt-BR", {
    //timeZone: timezones[timeZone],
    hour: "2-digit",
    minute: "2-digit",
  });

  const subtitulo = data.toLocaleDateString("pt-BR", {
    // timeZone: timezones[timeZone],
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return {
    id: new Date(dataISO).getTime(),
    titulo,
    subtitulo,
  };
};

export function formatarHorario(horario) {
  const [hh, mm, ss] = horario.split(":").map(Number);
  let partes = [];

  if (hh > 0) partes.push(`${hh} hora${hh > 1 ? "s" : ""}`);
  if (mm > 0) partes.push(`${mm} minuto${mm > 1 ? "s" : ""}`);
  if (ss > 0) partes.push(`${ss} segundo${ss > 1 ? "s" : ""}`);

  if (partes.length === 0) return "0 segundos";
  if (partes.length === 1) return partes[0];

  return partes.slice(0, -1).join(", ") + " e " + partes[partes.length - 1];
}

export const formatTime = (valorant, valor) => {
  let numeros = valor.replace(/\D/g, "");

  if (numeros === "") return "";

  numeros = numeros.padStart(4, "0").slice(-4);

  if (+numeros > 2400) return valorant;

  if (+numeros.slice(-2) > 59) return valorant;

  return numeros.replace(/(\d{2})(\d{2})/, "$1:$2");
};

export const formatMoney = (valor) => {
  if (!valor) return "";

  const numeros = valor.replace(/\D/g, "");

  const numeroFormatado = (parseInt(numeros, 10) / 100).toFixed(2);

  return numeroFormatado;
};

export const formatCNPJ = (value) => {
  // Remove tudo que não for número
  let digits = value?.replace(/\D/g, "");
  if (!value) return "";

  // Limita ao formato máximo (14 dígitos para CNPJ)
  digits = digits.slice(0, 14);

  // Aplica a formatação XX.XXX.XXX/XXXX-XX
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2") // Adiciona o primeiro ponto
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // Adiciona o segundo ponto
    .replace(/\.(\d{3})(\d)/, ".$1/$2") // Adiciona a barra
    .replace(/(\d{4})(\d)/, "$1-$2"); // Adiciona o hífen
};

export const formatPhone = (value) => {
  // Remove tudo que não for número
  let digits = value?.replace(/\D/g, "");
  if (!value) return "";
  // Garante que o número tenha o código do país
  if (!digits.startsWith("5")) {
    digits = "55" + digits;
  }

  // Limita ao formato máximo (+55 99 99999 9999)
  digits = digits.slice(0, 13);

  // Aplica a formatação
  return digits
    .replace(/^(\d{2})(\d)/, "+$1 $2") // Adiciona o código do país e separa DDD
    .replace(/(\d{2}) (\d{2})(\d)/, "$1 $2 $3") // Separa o DDD
    .replace(/(\d{5})(\d{1,4})$/, "$1 $2"); // Separa os últimos dígitos
};

export const formatCardInfo = (value, campo = "numero") => {
  if (!value) return "";

  let digits = value.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (campo === "numero") {
    digits = digits.slice(0, 16); // Limita a 16 dígitos
    return digits.replace(/(\d{4})/g, "$1 ").trim(); // Formato 0000 0000 0000 0000
  }

  if (campo === "data") {
    digits = digits.slice(0, 4); // Limita a 4 dígitos (MMYY)

    // Permite apagar corretamente sem travar no "/"
    if (value.length < digits.length) return value;

    if (digits.length >= 2) {
      let month = parseInt(digits.slice(0, 2), 10);
      if (month < 1 || month > 12) return digits.slice(0, 1); // Evita meses inválidos
    }

    if (digits.length === 4) {
      let year = parseInt(digits.slice(2, 4), 10);
      const attYear = new Date().getFullYear() % 100; // Ano atual (últimos 2 dígitos)
      if (year < attYear) return value.slice(0, value.length - 1); // Evita anos passados
    }

    return digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits; // Formato MM/YY
  }

  return digits; // Retorna apenas os números caso `campo` seja inválido
};

export const Saudacao = () => {
  const hora = new Date().getHours();

  if (hora < 12) {
    return "Bom dia!";
  } else if (hora < 18) {
    return "Boa tarde!";
  } else {
    return "Boa noite!";
  }
};

export const formatNumberToWords = (num) => {
  if (num < 100) return "vários";
  if (num < 1000) return "centenas";

  if (num < 10000) {
    return `${Math.floor(num / 1000)} mil`;
  }

  if (num < 1000000) {
    return `${(num / 1000).toFixed(0)} mil`;
  }

  if (num < 1000000000) {
    return `${(num / 1000000).toFixed(0)} milhões`;
  }
};

export const setLocalItem = (key, value) => {
  if (typeof value === "object" || Array.isArray(value)) {
    value = JSON.stringify(value); // Serializa se for um objeto ou array
  } else if (typeof value === "boolean" || typeof value === "number") {
    value = String(value); // Converte booleanos e números para string
  }
  window.localStorage.setItem(key, value); // Armazena o item como uma string no localStorage
};

export const getLocalItem = (key) => {
  const item = window.localStorage.getItem(key);
  if (item === null) return null;

  try {
    const parsed = JSON.parse(item);
    return parsed; // Retorna o valor parseado se for possível
  } catch (e) {
    return item; // Retorna o item original se o parse falhar (string, número ou booleano)
  }
};

export const getStatus = (status) => {
  switch (status) {
    case "PENDING":
      return {
        color: "primary",
        valor: "Agendado",
      };
    case "NOT_ATTEND":
      return {
        color: "error",
        valor: "Não Compareceu",
      };
    case "CANCELLED":
      return {
        color: "warning",
        valor: "Cancelado",
      };
    case "OK":
      return {
        color: "success",
        valor: "Concluído",
      };
    default:
      return { color: "warning", valor: "Não atendido" };
  }
};

export function formatDataToString(dataString) {
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

  const [dia, mes, ano] = dataString.split("/");
  return `${dia} de ${meses[parseInt(mes, 10) - 1]} de ${ano}`;
}

export function gerarGradient(hex) {
  // Função auxiliar para converter HEX para RGBA
  function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const cor1 = hexToRgba("#363636", 0.4); // cor de fundo escura
  const cor2 = hexToRgba(hex, 0.4); // cor base com opacidade
  const cor3 = hexToRgba(hex, 0.3); // mesma cor com mais opacidade

  return `linear-gradient(-90deg, ${cor1} 0%, ${cor2} 85%, ${cor3} 100%)`;
}

export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

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
        resolve("#363636"); // fallback se CORS bloquear
      }
    };

    img.onerror = (err) => {
      console.warn("Erro ao carregar imagem (URL quebrada ou bloqueada)", err);
      resolve("#363636"); // fallback se imagem quebrar
    };
  });
};
