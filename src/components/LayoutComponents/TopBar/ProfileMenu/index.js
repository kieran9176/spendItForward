import React from 'react'
import { connect } from 'react-redux'
import { Menu, Dropdown, Avatar } from 'antd'
import { FormattedMessage } from 'react-intl'
import styles from './style.module.scss'

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  // state = {
  //   count: 7,
  // }

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  addCount = () => {
    let { count } = this.state
    count += 1
    this.setState({
      count,
    })
  }

  render() {
    const { user } = this.props
    // const { count } = this.state
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <div>
            <strong className="mr-1">
              <FormattedMessage id="topBar.profileMenu.billingPlan" />:{' '}
            </strong>
            Professional
          </div>
          <div>
            <strong>
              <FormattedMessage id="topBar.profileMenu.role" />:{' '}
            </strong>
            {user.role}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div>
            <strong>
              <FormattedMessage id="topBar.profileMenu.email" />:{' '}
            </strong>
            {user.email}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript: void(0);">
            <i className={`${styles.menuIcon} icmn-user`} />
            <FormattedMessage id="topBar.profileMenu.editProfile" />
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="javascript: void(0);" onClick={this.logout}>
            <i className={`${styles.menuIcon} icmn-exit`} />
            <FormattedMessage id="topBar.profileMenu.logout" />
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={styles.dropdown}>
          <Avatar className={styles.avatar} shape="square" size="large" icon="user" />
        </div>
      </Dropdown>
    )
  }
}

export default ProfileMenu
