import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/forgot',
    component: loadable(() => import('pages/user/forgot')),
    exact: true,
  },
  {
    path: '/user/signup',
    component: loadable(() => import('pages/user/signup')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard/alpha',
    component: loadable(() => import('pages/dashboard/alpha')),
    exact: true,
  },

  // Profile
  {
    path: '/apps/profile',
    component: loadable(() => import('pages/apps/profile')),
    exact: true,
  },

  // Assets
  {
    path: '/apps/gallery',
    component: loadable(() => import('pages/apps/gallery')),
    exact: true,
  },

  // // Ecommerce
  {
    path: '/ecommerce/products-catalog',
    component: loadable(() => import('pages/ecommerce/products-catalog')),
    exact: true,
  },
  {
    path: '/ecommerce/cart',
    component: loadable(() => import('pages/ecommerce/cart')),
    exact: true,
  },

  // Blog
  {
    path: '/blog/feed',
    component: loadable(() => import('pages/blog/feed')),
    exact: true,
  },
  {
    path: '/blog/post',
    component: loadable(() => import('pages/blog/post')),
    exact: true,
  },
  {
    path: `/blog/edit-blog-post/:status/:id`,
    component: loadable(() => import('pages/blog/add-blog-post')),
    exact: true,
  },
  {
    path: `/blog/edit-blog-post/new-post`,
    component: loadable(() => import('pages/blog/add-blog-post')),
    exact: true,
  },
]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/apps/profile" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
