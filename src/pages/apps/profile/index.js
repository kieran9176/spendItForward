import React from 'react'
import { Row, Col, Tabs, Collapse } from 'antd'
import { Helmet } from 'react-helmet'
import Avatar from 'components/ImageUpload/Avatar'
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
import Cart from '../../ecommerce/cart'
import WrappedCartCheckoutForm from '../../ecommerce/cart/CheckoutForm'
import NameForm from './NameForm'

const { TabPane } = Tabs
const { Panel } = Collapse

class NewProfileApp extends React.Component {
  state = {
    background: '',
  }

  componentWillMount() {
    this.setState({
      background: data.background,
    })
  }

  render() {
    const { background } = this.state

    return (
      <div>
        <Helmet title="Profile" />
        <div className={style.profile}>
          <div className="row">
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body">
                  <NameForm type="Name" />
                </div>
              </div>
              <div
                className={`card ${style.header}`}
                style={{ backgroundImage: `url(${background})` }}
              >
                <div className="card-body">
                  <Row gutter={24} className={style.imageRow}>
                    <Col span={12}>
                      <div className={style.imageLabel}>Primary</div>
                    </Col>
                    <Col span={12}>
                      <Avatar type="Primary" />
                    </Col>
                  </Row>
                  <Row gutter={24} className={style.imageRow}>
                    <Col span={12}>
                      <div className={style.imageLabel}>Secondary</div>
                    </Col>
                    <Col span={12}>
                      <Avatar type="Secondary" />
                    </Col>
                  </Row>
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
            </div>
            <div className="col-xl-8">
              <div className="card">
                <div className="card-body">
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-profile" /> Profile
                        </span>
                      }
                      key="1"
                    >
                      <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header="Intro" key="1">
                          <TextForm type="Intro" />
                        </Panel>
                        <Panel header="Experience" key="2">
                          <WhatWhereWhenForm type="Experience" />
                        </Panel>
                        <Panel header="Education" key="3">
                          <EducationForm type="Education" />
                        </Panel>
                        <Panel header="Leadership" key="4">
                          <WhatWhereWhenForm type="Leadership" />
                        </Panel>
                        <Panel header="References" key="5">
                          <ReferencesForm type="References" />
                        </Panel>
                        <Panel header="Favorite Articles" key="6">
                          <ArticleForm type="Articles" />
                        </Panel>
                      </Collapse>
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-checkbox-checked" /> Builds
                        </span>
                      }
                      key="2"
                    >
                      <BuildStatus />
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-info" /> Site Details
                        </span>
                      }
                      key="3"
                    >
                      <Cart />
                      <hr />
                      <WrappedCartCheckoutForm />
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
