import userRoutes from "./user/routes";
import roleRoutes from "./roles/routes";

export default [
    ...userRoutes,
    ...roleRoutes
];