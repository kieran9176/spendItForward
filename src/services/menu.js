export async function getLeftMenuData() {
  return [
    {
      divider: true,
    },
    {
      title: 'Profile',
      key: 'profile',
      url: '/apps/profile',
      icon: 'icmn icmn-database',
    },
    {
      title: 'Blog',
      key: 'blog',
      icon: 'icmn icmn-wordpress',
      children: [
        {
          title: 'Feed',
          key: 'blogFeed',
          url: '/blog/feed',
          pro: false,
        },
        {
          title: 'Add Post',
          key: 'blogAddPost',
          url: `/blog/edit-blog-post/new-post`,
          pro: true,
        },
      ],
    },
    {
      title: 'Assets',
      key: 'assets',
      url: '/apps/gallery',
      icon: 'icmn icmn-image',
    },
    {
      title: 'Settings',
      key: 'settings',
      url: '/ecommerce/cart',
      icon: 'icmn icmn-cog',
    },
    {
      divider: true,
    },
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Profile',
      key: 'profile',
      url: '/apps/profile',
      icon: 'icmn icmn-database',
    },
    {
      title: 'Blog',
      key: 'blog',
      icon: 'icmn icmn-wordpress',
      children: [
        {
          title: 'Feed',
          key: 'blogFeed',
          url: '/blog/feed',
          pro: true,
        },
        {
          title: 'Add Post',
          key: 'blogAddPost',
          url: `/blog/edit-blog-post/new-post`,
          pro: true,
        },
      ],
    },
    {
      title: 'Assets',
      key: 'assets',
      url: '/apps/gallery',
      icon: 'icmn icmn-image',
    },
    {
      title: 'Settings',
      key: 'settings',
      url: '/ecommerce/cart',
      icon: 'icmn icmn-cog',
    },
  ]
}
