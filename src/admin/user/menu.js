import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Lists",
        icon: "pi pi-fw pi-user-plus",
        command: () => {
            router.navigate(routeUrl(routes,'admin.index'));
        },
    },
];