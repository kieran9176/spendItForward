import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon } from 'antd'
import { Helmet } from 'react-helmet'
import ExperienceForm from './ExperienceForm'
import SkillsForm from './SkillsForm'
import CourseworkForm from './CourseworkForm'
import EducationForm from './EducationForm'
import LeadershipForm from './LeadershipForm';
import style from './style.module.scss'

@connect(({ profile }) => ({ profile }))
class ProfileApp extends React.Component {

  render() {

    const {Panel} = Collapse;

    const experienceText = `
    Input any professional experience you have. If you don't have any, no worries! This is an optional section.
    `;

    const skillsText = `
    You got mad skillz?
    `;

    const courseworkText = `
    Tell us about all that ish you done learnt.
    `;

    const educationText = `
    Maths? Science? MBA in Craft Beer Brewing?
    `;

    const leadershipText = `
    If your actions inspire others to dream more, learn more, do more and become more, you are a leader.
    `;

    const customPanelStyle = {
      background: '#ffffff',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };

    return (
      <div>
        <Helmet title="Profile" />
        <div className={style.profile}>
          <div className={style.profile}>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Experience" key="1" style={customPanelStyle}>
                <p>{experienceText}</p>
                <ExperienceForm />
              </Panel>
            </Collapse>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Skills" key="2" style={customPanelStyle}>
                <p>{skillsText}</p>
                <SkillsForm />
              </Panel>
            </Collapse>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Coursework" key="3" style={customPanelStyle}>
                <p>{courseworkText}</p>
                <CourseworkForm />
              </Panel>
            </Collapse>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Education" key="4" style={customPanelStyle}>
                <p>{educationText}</p>
                <EducationForm />
              </Panel>
            </Collapse>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="Leadership" key="4" style={customPanelStyle}>
                <p>{leadershipText}</p>
                <LeadershipForm />
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileApp
