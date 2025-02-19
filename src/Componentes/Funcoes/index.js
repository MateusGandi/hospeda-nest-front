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

export const formatarData = (dataISO, timeZone = "sao_paulo") => {
  const data = new Date(dataISO);

  const titulo = data.toLocaleTimeString("pt-BR", {
    timeZone: timezones[timeZone],
    hour: "2-digit",
    minute: "2-digit",
  });

  const subtitulo = data.toLocaleDateString("pt-BR", {
    timeZone: timezones[timeZone],
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return {
    id: data.getTime(),
    titulo,
    subtitulo,
  };
};

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

  return `R$ ${numeroFormatado.replace(".", ",")}`;
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
