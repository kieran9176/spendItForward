import React from 'react'
import { connect } from 'react-redux'
import { API, graphqlOperation } from 'aws-amplify'
import { Collapse, Icon, Button } from 'antd'
import { Helmet } from 'react-helmet'
import * as subscriptions from 'graphql/subscriptions'
import EducationForm from './EducationForm'
import WhatWhenWhereForm from './WhatWhereWhenForm'
import TagsForm from './TagsForm'
import TextForm from './TextForm'
import ArticleForm from './ArticleForm'
import style from './style.module.scss'
import { triggerDevelopmentBuild } from '../../../services/website'
// import { siteMetadataSubscription } from "../../../services/profileSubscriptions";

@connect(({ profile }) => ({ profile }))
class ProfileApp extends React.Component {
  subscription = API.graphql(
    graphqlOperation(subscriptions.onCreateSiteMetadata2, {
      account_id: 'dee652d3-30d5-460d-bea1-4e8df10101d7',
    }),
  ).subscribe({
    next: siteMetadata => console.log(siteMetadata),
  })

  componentDidMount() {
    console.log('about to subscribe')
    console.log(this.subscription)
  }

  handleClick = async e => {
    e.preventDefault()
    const { profile } = this.props
    const { sub } = profile
    const response = await triggerDevelopmentBuild(sub)
    console.log('handleClick Response', response)
  }

  render() {
    const { Panel } = Collapse

    const text = {
      experienceText:
        "Input any professional experience you have. If you don't have any, no worries! This is an optional section.",
      introText: 'The secret to getting ahead is getting started ...',
      skillsText: 'You got mad skillz?',
      courseworkText: 'Tell us about all that ish you done learnt.',
      educationText: 'Maths? Science? MBA in Craft Beer Brewing?',
      leadershipText:
        'If your actions inspire others to dream more, learn more, do more and become more, you are a leader.',
      bragsText: 'Brag about yourself. You deserve it.',
      articlesText: 'What have you been reading lately?',
    }

    const customPanelStyle = {
      background: '#ffffff',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    }

    return (
      <div>
        <Helmet title="Profile" />
        <div className={style.profile}>
          <Button type="primary" onClick={this.handleClick} style={{ marginBottom: 24 }}>
            Build Development Site
          </Button>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Intro" key="1" style={customPanelStyle}>
              <p>{text.introText}</p>
              <TextForm type="Intro" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Experience" key="1" style={customPanelStyle}>
              <p>{text.experienceText}</p>
              <WhatWhenWhereForm type="Experience" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Skills" key="2" style={customPanelStyle}>
              <p>{text.skillsText}</p>
              <TagsForm type="Skills" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['3']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Coursework" key="3" style={customPanelStyle}>
              <p>{text.courseworkText}</p>
              <TagsForm type="Coursework" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Education" key="4" style={customPanelStyle}>
              <p>{text.educationText}</p>
              <EducationForm type="Education" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Leadership" key="4" style={customPanelStyle}>
              <p>{text.leadershipText}</p>
              <WhatWhenWhereForm type="Leadership" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Above and Beyond / Brags" key="5" style={customPanelStyle}>
              <p>{text.bragsText}</p>
              <WhatWhenWhereForm type="Brags" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Favorite Articles" key="6" style={customPanelStyle}>
              <p>{text.articlesText}</p>
              <ArticleForm type="Articles" />
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

export default ProfileApp
