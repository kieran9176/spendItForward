import React from 'react'
import { Button, Tabs } from 'antd'
import { Helmet } from 'react-helmet'
import Avatar from 'components/CleanUIComponents/Avatar'
import Donut from 'components/CleanUIComponents/Donut'
import SettingsForm from './SettingsForm'
import data from './data.json'
import style from './style.module.scss'
import TextForm from './TextForm'
import TagsForm from './TagsForm'
import SocialForm from './SocialsForm'
import BuildStatus from './BuildStatus'
import WhatWhereWhenForm from './WhatWhereWhenForm'
import EducationForm from './EducationForm'
import ReferencesForm from './ReferenceForm'
import ArticleForm from './ArticleForm'

const { TabPane } = Tabs

class NewProfileApp extends React.Component {
  state = {
    name: '',
    nickname: '',
    photo: '',
    background: '',
    post: '',
    postsCount: '',
    followersCount: '',
    lastActivity: '',
    status: '',
  }

  componentWillMount() {
    this.setState({
      name: data.name,
      nickname: data.nickname,
      photo: data.photo,
      background: data.background,
      post: data.post,
      postsCount: data.postsCount,
      followersCount: data.followersCount,
      lastActivity: data.lastActivity,
      status: data.status,
    })
  }

  render() {
    const {
      name,
      nickname,
      photo,
      background,
      post,
      postsCount,
      followersCount,
      lastActivity,
      status,
    } = this.state

    return (
      <div>
        <Helmet title="Profile" />
        <div className={style.profile}>
          <div className="row">
            <div className="col-xl-4">
              <div
                className={`card ${style.header}`}
                style={{ backgroundImage: `url(${background})` }}
              >
                <div>
                  <div className="card-body text-center">
                    <Avatar src={photo} size="110" border="true" borderColor="white" />
                    <br />
                    <br />
                    <Button.Group size="default">
                      <Button style={{ width: 150 }}>Follow</Button>
                      <Button style={{ width: 150 }}>Add to Friend</Button>
                    </Button.Group>
                    <br />
                    <p className="text-white mt-2">{`Last activity: ${lastActivity}`}</p>
                    <p className="text-white mt-2">
                      {status === 'Online' && <Donut type="success" name={status} />}
                      {status === 'Offline' && <Donut type="danger" name={status} />}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>Actions</strong>
                  </h5>
                  <div className={style.actions}>
                    <Button style={{ display: 'block', width: '100%' }}>Send Message</Button>
                    <Button style={{ display: 'block', width: '100%' }}>Send File</Button>
                    <Button style={{ display: 'block', width: '100%' }}>Access History</Button>
                    <Button style={{ display: 'block', width: '100%' }}>Rename User</Button>
                    <Button style={{ display: 'block', width: '100%' }}>Ban User</Button>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>Skills</strong>
                  </h5>
                  <TagsForm type="Skills" />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>Coursework</strong>
                  </h5>
                  <TagsForm type="Coursework" />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>Socials</strong>
                  </h5>
                  <SocialForm type="Socials" />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>Favorite Articles</strong>
                  </h5>
                  <ArticleForm type="Articles" />
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className={`card card-body mb-4 ${style.socialInfo}`}>
                <div>
                  <h2>
                    <span className="text-black mr-2">
                      <strong>{name}</strong>
                    </span>
                    <small className="text-muted">{nickname}</small>
                  </h2>
                  <p className="mb-1">{post}</p>
                </div>
                <div className={style.socialCounts}>
                  <div className="text-center mr-3">
                    <h2>{followersCount}</h2>
                    <p className="mb-0">Followers</p>
                  </div>
                  <div className="text-center">
                    <h2>{postsCount}</h2>
                    <p className="mb-0">Posts</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-menu" /> Wall
                        </span>
                      }
                      key="1"
                    >
                      <div className="py-3">
                        <TextForm type="Intro" />
                      </div>
                      <hr />
                      <h5>Experience</h5>
                      <WhatWhereWhenForm type="Experience" />
                      <hr />
                      <h5>Education</h5>
                      <EducationForm type="Education" />
                      <hr />
                      <h5>Leadership</h5>
                      <WhatWhereWhenForm type="Leadership" />
                      <hr />
                      <h5>References</h5>
                      <ReferencesForm type="References" />
                      <hr />
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-bubbles" /> Builds
                        </span>
                      }
                      key="2"
                    >
                      <BuildStatus />
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-cog" /> Settings
                        </span>
                      }
                      key="3"
                    >
                      <SettingsForm />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewProfileApp
