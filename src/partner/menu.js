import {router} from "../routes";
import {routeUrl} from "../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Partner",
        icon: "pi pi-users",
        command: () => {
            router.navigate(routeUrl(routes, 'partner.index'));
        },
    },
];