import uuidv4 from 'uuid/v4'

const id = uuidv4();

export async function getLeftMenuData() {
  return [
    {
      divider: true,
    },
    {
      title: 'Dashboard',
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
          pro: false,
        },
        {
          title: 'Add Post',
          key: 'blogAddPost',
          url: `/blog/edit-blog-post/true/${id}`,
          pro: true
        }
      ],
    },
    {
      title: 'Assets',
      key: 'assets',
      url: '/apps/gallery',
      icon: 'icmn icmn-image',
    },
    {
      divider: true,
    },
   ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Dashboard',
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
          pro: true
        },
        {
          title: 'Add Post',
          key: 'blogAddPost',
          url: `/blog/edit-blog-post/true/${id}`,
          pro: true
        }
      ],
    },
    {
      title: 'Assets',
      key: 'assets',
      url: '/apps/gallery',
      icon: 'icmn icmn-image',
    }
  ]
}
