import Forms from "./Forms";
import Index from "./Index";

export default [
    {
        path: "/merchant",
        element: <Index/>,
        name: "merchant.index"
    },
    {
        path: "/merchant/store",
        element: <Forms/>,
        name: "merchant.store"

    },
    {
        path: "/merchant/:id",
        element: <Forms/>,
        name: "merchant.edit"
    },
]