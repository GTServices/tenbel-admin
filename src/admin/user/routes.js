import Index from "./Index";
import AdminForm from "./Form";

export default [
    {
        path: "/admin",
        element: <Index/>,
        name: "admin.index"
    },
    {
        path: "/admin/store",
        element: <AdminForm/>,
        name: "admin.store"
    },
    {
        path: "/admin/:id",
        element: <AdminForm/>,
        name: "admin.edit"
    },
]