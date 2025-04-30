import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Categories",
        icon: "pi pi-fw pi-align-center",
        command: () => router.navigate(routeUrl(routes, 'category.index')),
    },
]