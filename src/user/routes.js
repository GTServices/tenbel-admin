import UserIndex from "./Index";
import UserForms from "./Forms";

export default [
    {
        path: "/user",
        element: <UserIndex/>,
        name: "user.index"
    },
    {
        path: "/user/store",
        element: <UserForms/>,
        name: "user.store"
    },
    {
        path: "/user/:id",
        element: <UserForms/>,
        name: "user.update"
    },
];