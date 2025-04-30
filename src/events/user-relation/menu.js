import routes from "./routes";
import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";

export default [
    {
        label: "User Relation",
        icon: "pi pi-fw pi-user-plus",
        command: () => {
            router.navigate(routeUrl(routes, 'user-relation.index'));
        },
    },
];