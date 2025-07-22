import LocalMallIcon from "@mui/icons-material/LocalMall";
import SettingsIcon from "@mui/icons-material/Settings";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

import Sales from "./Pages/Sales";
import LeftNavigationBar from "../Componentes/NavigationBar/Drawer";

export default function Manager() {
  const pages = [
    { id: 1, titulo: "Vendas", icon: <LocalMallIcon />, page: <Sales /> },
    { id: 2, titulo: "Social", icon: <PublicIcon /> },
    { id: 3, titulo: "Configurações", icon: <SettingsIcon /> },
  ];
  const footer = [
    {
      id: 998,
      titulo: "Notificações",
      icon: <NotificationsRoundedIcon />,
      page: <div>Notificações</div>,
    },
    {
      id: 999,
      titulo: "Dúvidas Frequentes",
      icon: <FolderOpenOutlinedIcon />,
      page: <div>Dúvidas Frequentes</div>,
    },
  ];

  return <LeftNavigationBar pages={pages} footer={footer} />;
}
