import merchantRoutes from "./user/routes";
import productRoutes from "./product/routes";

export default [
    ...merchantRoutes,
    ...productRoutes
];