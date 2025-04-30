import {router} from "../routes";
import {routeUrl} from "../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Users",
        icon: "pi pi-fw pi-user",
        command: () => {
            router.navigate(routeUrl(routes,'user.index'));
        },
    },
];