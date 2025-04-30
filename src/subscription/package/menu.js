import routes from "./routes";
import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";

export default [
    {
        label: "Package",
        icon: "pi pi-fw pi-box",
        command: () => {
            router.navigate(routeUrl(routes, 'package.index'));
        },
    },
];