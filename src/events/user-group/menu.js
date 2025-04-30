import routes from "./routes";
import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";

export default [
    {
        label: "User Group/ Group Events",
        icon: "pi pi-fw pi-user",
        command: () => {
            router.navigate(routeUrl(routes, 'user-group.index'));
        },
    },
];