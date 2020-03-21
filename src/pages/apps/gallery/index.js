import React from 'react'
import { Icon, Collapse } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Avatar from 'components/ImageUpload/Avatar'
import styles from './style.module.scss'

@connect(({ profile }) => ({ profile }))
class GalleryList extends React.Component {
  render() {
    const { Panel } = Collapse

    const customPanelStyle = {
      background: '#ffffff',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    }

    return (
      <div>
        <Helmet title="Images" />
        <div className={styles.profile}>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Primary" key="1" style={customPanelStyle}>
              <Avatar type="Primary" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Secondary" key="1" style={customPanelStyle}>
              <Avatar type="Secondary" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Resume" key="1" style={customPanelStyle}>
              <Avatar type="Resume" />
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

export default GalleryList
