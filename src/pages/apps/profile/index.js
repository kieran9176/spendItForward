import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Button } from 'antd'
import { Helmet } from 'react-helmet'
// import SkillsForm from './SkillsForm'
import EducationForm from './EducationForm'
import WhatWhenWhereForm from './WhatWhereWhenForm'
import TagsForm from './TagsForm'
// import OtherForm from './OtherForm';
import ArticleForm from './ArticleForm';
import style from './style.module.scss'
import { triggerDevelopmentBuild } from "../../../services/website"

@connect(({ profile }) => ({ profile }))
class ProfileApp extends React.Component {

  handleClick = async (e) => {
    e.preventDefault();
    const { profile } = this.props
    const { sub } = profile
    const response = await triggerDevelopmentBuild(sub);
    console.log("handleClick Response", response)
  };

  render() {

    const {Panel} = Collapse;

    const text = {
      experienceText: "Input any professional experience you have. If you don't have any, no worries! This is an optional section.",
      skillsText: "You got mad skillz?",
      courseworkText: "Tell us about all that ish you done learnt.",
      educationText: "Maths? Science? MBA in Craft Beer Brewing?",
      leadershipText: "If your actions inspire others to dream more, learn more, do more and become more, you are a leader.",
      bragsText: "Brag about yourself. You deserve it.",
      articlesText: "What have you been reading lately?"
    };

    const customPanelStyle = {
      background: '#ffffff',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };

    const formAttributes = {
      leadership: {
        title: "Leadership", createMutation: "createLeadership", deleteMutation: "removeLeadership",
        labels: ["Company", "Company", "Title"]
      },
      experience: {
        title: "Experience", createMutation: "createExperience", deleteMutation: "removeExperience",
        labels: ["Organization", "Organization", "Position"]
      },
      brags: {
        title: "Brags / Above and Beyond", createMutation: "createOther", deleteMutation: "removeOther",
        labels: ["Where", "Where", "What"]
      }
    };

    return (
      <div>
        <Helmet title="Profile" />
        <div className={style.profile}>
          <Button type="primary" onClick={this.handleClick} style={{marginBottom: 24}}>
            Build Development Site
          </Button>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Experience" key="1" style={customPanelStyle}>
              <p>{text.experienceText}</p>
              <WhatWhenWhereForm type="Experience" formAttributes={formAttributes} />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['2']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Skills" key="2" style={customPanelStyle}>
              <p>{text.skillsText}</p>
              <TagsForm type="Skills" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Coursework" key="3" style={customPanelStyle}>
              <p>{text.courseworkText}</p>
              <TagsForm type="Coursework" />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Education" key="4" style={customPanelStyle}>
              <p>{text.educationText}</p>
              <EducationForm />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Leadership" key="4" style={customPanelStyle}>
              <p>{text.leadershipText}</p>
              <WhatWhenWhereForm type="Leadership" formAttributes={formAttributes} />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Above and Beyond / Brags" key="5" style={customPanelStyle}>
              <p>{text.bragsText}</p>
              <WhatWhenWhereForm type="Brags" formAttributes={formAttributes} />
            </Panel>
          </Collapse>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="Favorite Articles" key="6" style={customPanelStyle}>
              <p>{text.articlesText}</p>
              <ArticleForm />
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

export default ProfileApp
