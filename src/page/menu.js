import {router} from "../routes";
import {routeUrl} from "../common/utils/helpers";
import routes from "./routes";

export default [
    {
        label: "Pages",
        icon: "pi pi-book",
        command: () => {
            router.navigate(routeUrl(routes, 'page.index'));
        },
    },
];