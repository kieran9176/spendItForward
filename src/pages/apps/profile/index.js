import React from 'react'
import { connect } from 'react-redux'
// import { API, graphqlOperation } from 'aws-amplify'
import { Collapse, Icon } from 'antd'
import { Helmet } from 'react-helmet'
// import * as subscriptions from 'graphql/subscriptions'
import Avatar from '../../../components/ImageUpload/Avatar'
import NameForm from './NameForm'
import EducationForm from './EducationForm'
import WhatWhenWhereForm from './WhatWhereWhenForm'
import TagsForm from './TagsForm'
import TextForm from './TextForm'
import ArticleForm from './ArticleForm'
import ReferencesForm from './ReferenceForm'
import SocialForm from './SocialsForm'
import style from './style.module.scss'

@connect(({ profile }) => ({ profile }))
class ProfileApp extends React.Component {
  render() {
    const { Panel } = Collapse

    const text = {
      nameText: 'First name, last name?',
      experienceText:
        "Input any professional experience you have. If you don't have any, no worries! This is an optional section.",
      introText: 'The secret to getting ahead is getting started ...',
      skillsText: 'You got mad skillz?',
      courseworkText: 'Tell us about all that ish you done learnt.',
      educationText: 'Maths? Science? MBA in Craft Beer Brewing?',
      leadershipText:
        'If your actions inspire others to dream more, learn more, do more and become more, you are a leader.',
      referencesText: "I've got some people who carry me.",
      bragsText: 'Brag about yourself. You deserve it.',
      articlesText: 'What have you been reading lately?',
      socialsText: 'Where can people find you?',
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
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Name" key="1" style={customPanelStyle}>
              <p>{text.nameText}</p>
              <NameForm type="Name" />
            </Panel>
          </Collapse>
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
            <Collapse
              bordered={false}
              defaultActiveKey={['2']}
              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Primary Image" key="1" style={customPanelStyle}>
                <Avatar type="Primary" />
              </Panel>
            </Collapse>
            <Collapse
              bordered={false}
              defaultActiveKey={['2']}
              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Secondary Image" key="1" style={customPanelStyle}>
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
            <Panel header="Experience" key="1" style={customPanelStyle}>
              <p>{text.experienceText}</p>
              <WhatWhenWhereForm type="Experience" />
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
            <Panel header="References" key="6" style={customPanelStyle}>
              <p>{text.referencesText}</p>
              <ReferencesForm type="References" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Favorite Articles" key="7" style={customPanelStyle}>
              <p>{text.articlesText}</p>
              <ArticleForm type="Articles" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Socials" key="8" style={customPanelStyle}>
              <p>{text.socialsText}</p>
              <SocialForm type="Socials" />
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

export default ProfileApp
