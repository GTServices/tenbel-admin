import userGroupRoutes from "./user-group/routes";
import categoryRoutes from "./category/routes";
import stepRoutes from "./steps/routes";
import userRelationRoutes from "./user-relation/routes";

export default [
    ...userGroupRoutes,
    ...categoryRoutes,
    ...stepRoutes,
    ...userRelationRoutes,
];