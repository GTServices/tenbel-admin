import Forms from "./Forms";
import Index from "./Index";

export default [
    {
        path: "/partner",
        element: <Index/>,
        name: "partner.index"
    },
    {
        path: "/partner/store",
        element: <Forms/>,
        name: "partner.store"

    },
    {
        path: "/partner/:id",
        element: <Forms/>,
        name: "partner.edit"
    },
]