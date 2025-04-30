import {router} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Product",
        icon: "pi pi-gift",
        command: () => {
            router.navigate(routeUrl(routes, 'product.index'));
        },
    },
];