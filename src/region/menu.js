import {router} from "../routes";
import {routeUrl} from "../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Region",
        icon: "pi pi-fw pi-map-marker",
        command: () => {
            router.navigate(routeUrl(routes, 'region.index'));
        },
    },
];