import PackageGroupMenu from './package-group/menu';
import PackageMenu from './package/menu';

export default [
    {
        label: "Subscription",
        icon: "pi pi-fw pi-star-fill",
        items: [
            ...PackageGroupMenu,
            ...PackageMenu
        ],
    },
];