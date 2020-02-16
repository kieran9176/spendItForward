import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import ProjectManagement from './ProjectManagement'
import IssuesHistory from './IssuesHistory'
import LiveSearch from './LiveSearch'
import ProfileMenu from './ProfileMenu'
import styles from './style.module.scss'
import { triggerDevelopmentBuild } from '../../../services/website'

@connect(({ profile }) => ({ profile }))
class TopBar extends React.Component {
  handleClick = async e => {
    e.preventDefault()
    const { profile } = this.props
    const { sub } = profile
    const response = await triggerDevelopmentBuild(sub)
    console.log('handleClick Response', response)
  }

  render() {
    return (
      <div className={styles.topbar}>
        <div className="mr-4">
          <IssuesHistory />
        </div>
        <div className="mr-4">
          <ProjectManagement />
        </div>
        <div className="mr-auto">
          <LiveSearch />
        </div>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="success" onClick={this.handleClick}>
            <FormattedMessage id="Publish (Staging)" />
          </Button>
        </a>
        <a
          href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 d-none d-sm-inline"
        >
          <Button type="danger" onClick={this.handleClick}>
            <FormattedMessage id="Publish" />
          </Button>
        </a>
        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
