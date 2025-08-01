import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Ana Menü',
      separator: false,
      items: [
        // {
        //   icon: 'assets/icons/heroicons/outline/chart-pie.svg',
        //   label: 'Dashboard',
        //   route: '/dashboard',
        //   children: [{ label: 'Nfts', route: '/dashboard/nfts' }],
        // },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Restaurant',
          route: '/restaurant',
          children: [
            { label: 'Dashboard', route: '/restaurant/dashboard' },
            { label: 'Masalar', route: '/restaurant/tables' },
            { label: 'Siparişler', route: '/restaurant/orders' },
            { label: 'Ürünler', route: '/restaurant/products' },
            { label: 'Ödemeler', route: '/restaurant/payments' },
            { label: 'Çalışanlar', route: '/restaurant/employees' },
            { label: 'Çalışan Detay', route: '/restaurant/employee-profile/1' },
            { label: 'Müşteri Menüsü', route: '/restaurant/customer-menu' },
            { label: 'Raporlar', route: '/restaurant/reports' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
            { label: 'Two Steps', route: '/auth/two-steps' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Errors',
          route: '/errors',
          children: [
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        },
        // {
        //   icon: 'assets/icons/heroicons/outline/cube.svg',
        //   label: 'Components',
        //   route: '/components',
        //   children: [{ label: 'Table', route: '/components/table' }],
        // },
      ],
    },
    // {
    //   group: 'Collaboration',
    //   separator: true,
    //   items: [
    //     // {
    //     //   icon: 'assets/icons/heroicons/outline/download.svg',
    //     //   label: 'Download',
    //     //   route: '/download',
    //     // },
    //     // {
    //     //   icon: 'assets/icons/heroicons/outline/gift.svg',
    //     //   label: 'Gift Card',
    //     //   route: '/gift',
    //     // },
    //     // {
    //     //   icon: 'assets/icons/heroicons/outline/users.svg',
    //     //   label: 'Users',
    //     //   route: '/users',
    //     // },
    //   ],
    // },
    // {
    //   group: 'Config',
    //   separator: false,
    //   items: [
    //     {
    //       icon: 'assets/icons/heroicons/outline/cog.svg',
    //       label: 'Settings',
    //       route: '/settings',
    //     },
    //     {
    //       icon: 'assets/icons/heroicons/outline/bell.svg',
    //       label: 'Notifications',
    //       route: '/gift',
    //     },
    //     // {
    //     //   icon: 'assets/icons/heroicons/outline/folder.svg',
    //     //   label: 'Folders',
    //     //   route: '/folders',
    //     //   children: [
    //     //     { label: 'Current Files', route: '/folders/current-files' },
    //     //     { label: 'Downloads', route: '/folders/download' },
    //     //     { label: 'Trash', route: '/folders/trash' },
    //     //   ],
    //     // },
    //   ],
    // },
  ];
}
