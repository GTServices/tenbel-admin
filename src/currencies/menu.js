import {router} from "../routes";
import {routeUrl} from "../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Currencies",
        icon: "pi pi-fw pi-bitcoin",
        command: () => router.navigate(routeUrl(routes, "currency.index")),
    }
];