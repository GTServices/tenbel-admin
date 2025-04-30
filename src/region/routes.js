import RegionIndex from "./Index";
import Forms from "./Forms";

export default [
    {
        path: "/region",
        element: <RegionIndex/>,
        name: "region.index"
    },
    {
        path: "/region/store",
        element: <Forms/>,
        name: "region.store"
    },
    {
        path: "/region/:id",
        element: <Forms/>,
        name: "region.update"
    },
]