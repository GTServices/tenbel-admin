import packageGroupRoutes from "./package-group/routes";
import packageRoutes from "./package/routes";

export default [
    ...packageGroupRoutes,
    ...packageRoutes
];