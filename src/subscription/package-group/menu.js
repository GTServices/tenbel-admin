import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Package groups",
        icon: "pi pi-fw pi-table",
        command: () => router.navigate(routeUrl(routes, 'package-group.index')),
    },
]