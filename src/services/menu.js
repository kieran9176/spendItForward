export async function getLeftMenuData() {
  return [
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      divider: true,
    },
    {
      title: 'Dashboard Alpha',
      key: 'dashboardAlpha',
      url: '/dashboard/alpha',
      icon: 'icmn icmn-home',
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
          pro: true,
        },
        {
          title: 'Post',
          key: 'blogPost',
          url: '/blog/post',
          pro: true,
        },
        {
          title: 'Add Post',
          key: 'blogAddPost',
          url: '/blog/add-blog-post',
          pro: true,
        },
      ],
    },
    {
      divider: true,
    },
   ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Dashboard Alpha',
      key: 'dashboardAlpha',
      url: '/dashboard/alpha',
      icon: 'icmn icmn-home',
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
          pro: true,
        },
        {
          title: 'Post',
          key: 'blogPost',
          url: '/blog/post',
          pro: true,
        },
        {
          title: 'Add Post',
          key: 'blogAddPost',
          url: '/blog/add-blog-post',
          pro: true,
        },
      ],
    }
  ]
}
