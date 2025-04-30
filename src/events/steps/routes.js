import StepIndex from "./Index";
import Forms from "./Forms";


export default [
    {
        path: "/step",
        element: <StepIndex/>,
        name: "step.index"
    },
    {
        path: "/step/store",
        element: <Forms/>,
        name: "step.store"
    },
    {
        path: "/step/:id",
        element: <Forms/>,
        name: "step.update"
    },
];