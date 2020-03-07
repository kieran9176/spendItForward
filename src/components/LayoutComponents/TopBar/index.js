import React from 'react'
import { connect } from 'react-redux'
import { Button, notification } from 'antd'
import ProjectManagement from './ProjectManagement'
import IssuesHistory from './IssuesHistory'
import ProfileMenu from './ProfileMenu'
import styles from './style.module.scss'
import {
  triggerDevelopmentBuild,
  triggerProductionBuild,
  listAmplifyJobs,
} from '../../../services/website'
// import listJobs from '../../../services/amplifyOperations'

@connect(({ profile, user }) => ({ profile, user }))
class TopBar extends React.Component {
  state = {
    staging: false,
    production: false,
  }

  setTimeout = context => {
    setTimeout(() => {
      if (context === 'staging') {
        this.setState({
          staging: false,
          production: false,
        })
        notification.success({
          message: `${context} Build Completed`,
          description: 'Go ahead and view your changes.',
        })
      }
    }, 60000)
  }

  handleClick = async (e, context) => {
    e.preventDefault()
    const { profile, user } = this.props
    const { sub, siteMetadata } = profile
    const { email } = user
    const repoName = siteMetadata[0].repoUrl
    const { appId } = siteMetadata[0]

    if (context === 'List Jobs') {
      const response = await listAmplifyJobs(appId, 'develop')
      console.log('listJobs response', response)
      notification.success({
        message: 'Logging Jobs',
        description: 'Might work?',
      })
    }
    if (context === 'Staging') {
      const response = await triggerDevelopmentBuild(sub, email)
      console.log('triggerDevBuild Response', response)
      this.setState({
        staging: true,
        production: true,
      })
      notification.success({
        message: 'Staging Build Started',
        description: 'Changes take ~1 minute to render.',
      })
      this.setTimeout(context)
    } else if (context === 'Production') {
      const response = await triggerProductionBuild(sub, repoName)
      console.log('triggerProdBuild Response', response)
      this.setState({
        staging: true,
        production: true,
      })
      notification.success({
        message: 'Public Build Started',
        description: 'Changes take ~1 minute to render.',
      })
      this.setTimeout(context)
    }
  }

  render() {
    const { staging, production } = this.state

    return (
      <div className={styles.topbar}>
        <div className="mr-4">
          <IssuesHistory />
        </div>
        <div className="mr-auto">
          <ProjectManagement />
        </div>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="success" onClick={e => this.handleClick(e, 'List Jobs')} disabled={staging}>
            List Jobs
          </Button>
        </a>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="success" onClick={e => this.handleClick(e, 'Staging')} disabled={staging}>
            Publish (Staging)
          </Button>
        </a>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button
            type="danger"
            onClick={e => this.handleClick(e, 'Production')}
            disabled={production}
          >
            Publish (Public)
          </Button>
        </a>
        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
