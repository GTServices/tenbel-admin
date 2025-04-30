import AdminUserMenu from './user/menu';
import RoleMenu from './roles/menu';

export default [
    {
        label: "Admins",
        icon: "pi pi-fw pi-user",
        items: [
            ...AdminUserMenu,
            ...RoleMenu
        ],
    },
];