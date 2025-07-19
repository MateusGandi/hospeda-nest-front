import { useParams } from "react-router-dom";

export function SubRoutes({ children, views, dados }) {
  const { path, subPath } = useParams();
  const location = `/${path}`; //+ [path, subPath].filter((rota) => !!rota).join("/");
  if (!dados) return "Carregando...";
  return views[location] || children;
}
