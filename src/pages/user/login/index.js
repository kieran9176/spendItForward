import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Divider } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { loading },
    } = this.props
    return (
      <div>
        <Helmet title="Login" />
        <div className={`${styles.title} login-heading`}>
          <h1>
            <strong>WELCOME TO HATCH - HOME OF THE DIGITAL YOU</strong>
          </h1>
          <p>
            <strong>Let&#39;s get started.</strong>
          </p>
        </div>
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>log in</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your e-mail address' }],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your password' }],
                      })(<Input size="default" type="password" />)}
                    </Form.Item>
                    <Form.Item>
                      {form.getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(<Checkbox>Remember me</Checkbox>)}
                      <Link
                        to="/user/forgot"
                        className="utils__link--blue utils__link--underlined pull-right"
                      >
                        Forgot password?
                      </Link>
                    </Form.Item>
                    <div className="form-actions">
                      <Button type="primary" htmlType="submit" loading={loading}>
                        Login
                      </Button>
                      <Divider type="vertical" />
                      <Link to="/user/signup" className="utils__link--blue utils__link--underlined">
                        Signup
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
