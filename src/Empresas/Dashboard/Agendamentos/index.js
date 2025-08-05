import { useMediaQuery, useTheme } from "@mui/material";
import Agendamentos from "./Rows";
import AgendamentosByCalendario from "./Columns";

export default function AgendamentosView({ alertCustom }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <>
      {isDesktop ? (
        <AgendamentosByCalendario alertCustom={alertCustom} />
      ) : (
        <Agendamentos alertCustom={alertCustom} />
      )}
    </>
  );
}
