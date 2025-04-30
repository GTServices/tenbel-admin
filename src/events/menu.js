import UserGroupMenu from './user-group/menu';
import CategoryMenu from './category/menu';
import StepMenu from './steps/menu';
import UserRelationMenu from "./user-relation/menu";

export default [
    {
        label: "Events",
        icon: "pi pi-fw pi-megaphone",
        items: [
            ...UserGroupMenu,
            ...CategoryMenu,
            ...StepMenu,
            ...UserRelationMenu,
        ],
    },
];