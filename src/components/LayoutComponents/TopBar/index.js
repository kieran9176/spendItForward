import React from 'react'
import { connect } from 'react-redux'
import { Button, notification } from 'antd'
import ProjectManagement from './ProjectManagement'
import IssuesHistory from './IssuesHistory'
import ProfileMenu from './ProfileMenu'
import styles from './style.module.scss'
import { triggerDevelopmentBuild, triggerProductionBuild } from '../../../services/website'

@connect(({ profile, user, builds }) => ({ profile, user, builds }))
class TopBar extends React.Component {
  setBuildState = context => {
    const { builds, dispatch } = this.props
    const { appId } = builds

    if (context === 'Staging') {
      dispatch({
        type: 'builds/EDIT_BUILDS',
        payload: {
          appId,
          developResponse: { status: 'START' },
          masterResponse: { status: 'SUCCEED' },
        },
      })
    }

    if (context === 'Production') {
      dispatch({
        type: 'builds/EDIT_BUILDS',
        payload: {
          appId,
          developResponse: { status: 'SUCCEED' },
          masterResponse: { status: 'START' },
        },
      })
    }
  }

  handleClick = async (e, context) => {
    e.preventDefault()
    const { profile, user } = this.props
    const { sub, siteMetadata } = profile
    const { email } = user
    const repoName = siteMetadata[0].repoUrl

    if (context === 'Staging') {
      triggerDevelopmentBuild(sub, email).then(data => {
        console.log('trigger build response', data)
      })

      this.setBuildState(context)

      notification.success({
        message: 'Build Started',
        description: 'Changes take ~1 minute to render.',
      })
    } else if (context === 'Production') {
      triggerProductionBuild(sub, repoName).then(data => {
        console.log(data)
      })

      this.setBuildState(context)

      notification.success({
        message: 'Build Started',
        description: 'Changes take ~1 minute to render.',
      })
    }
  }

  enabled = () => {
    return (
      <div>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="success" onClick={e => this.handleClick(e, 'Staging')}>
            Publish (Staging)
          </Button>
        </a>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="danger" onClick={e => this.handleClick(e, 'Production')}>
            Publish (Public)
          </Button>
        </a>
      </div>
    )
  }

  disabled = () => {
    return (
      <div>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="success" onClick={e => this.handleClick(e, 'Staging')} disabled>
            Publish (Staging)
          </Button>
        </a>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="danger" onClick={e => this.handleClick(e, 'Production')} disabled>
            Publish (Public)
          </Button>
        </a>
      </div>
    )
  }

  render() {
    const { builds } = this.props
    const { developResponse, masterResponse } = builds
    const developStatus = developResponse.status
    const masterStatus = masterResponse.status

    const determineStatus = () => {
      if (developStatus === 'SUCCEED' && masterStatus === 'SUCCEED') {
        return this.enabled()
      }
      return this.disabled()
    }

    return (
      <div className={styles.topbar}>
        <div className="mr-4">
          <IssuesHistory />
        </div>
        <div className="mr-auto">
          <ProjectManagement />
        </div>
        {determineStatus()}
        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
