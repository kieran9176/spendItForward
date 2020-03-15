import React from 'react'
import { connect } from 'react-redux'
import { notification, Button, Input } from 'antd'
import styles from './style.module.scss'

@connect(({ profile }) => ({ profile }))
class NameForm extends React.Component {
  state = {
    dispatchEdit: null,
    firstName: null,
    lastName: null,
    disabled: true,
  }

  componentDidMount() {
    const { type } = this.props
    this.setFormState(type)
  }

  createPayloads = (type, values) => {
    const payloads = []

    switch (type) {
      case 'Name':
        payloads.push({
          first_name: values.firstName,
          last_name: values.lastName,
        })
        return payloads
      case 'FakeSecondOption':
        payloads.push({
          first_name: values.firstName,
          last_name: values.lastName,
        })
        return payloads
      default:
        notification.error({
          message: 'Could Not Create Payloads',
          description: 'Yikes.',
        })
        return 'Could not update'
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { dispatch, type } = this.props
    const { firstName, lastName, dispatchEdit } = this.state

    if (firstName.length && lastName.length) {
      this.setState({ disabled: true })
      const payload = this.createPayloads(type, { firstName, lastName })

      dispatch({
        type: dispatchEdit,
        payload,
      })
    } else {
      notification.error({
        message: 'First and last names required.',
        description: 'Enter your first and last names.',
      })
    }
  }

  setFormState = type => {
    const { profile } = this.props
    const { firstName, lastName } = profile
    switch (type) {
      case 'Name':
        this.setState({
          dispatchEdit: 'profile/EDIT_NAME',
          firstName,
          lastName,
        })
        return 'Intro Success'
      case 'FakeSecondOption':
        this.setState({
          dispatchEdit: 'profile/EDIT_EXPERIENCE',
        })
        return 'Experience Success'
      default:
        return null
    }
  }

  onChange = (e, type) => {
    if (type === 'firstName') {
      this.setState({
        firstName: e.target.value,
        disabled: false,
      })
    }
    if (type === 'lastName') {
      this.setState({
        lastName: e.target.value,
        disabled: false,
      })
    }
  }

  determineSize = context => {
    const { firstName, lastName } = this.state

    if (context === 'firstName' && firstName) {
      if (firstName.length > 6) return 100 - firstName.length * 4
    }
    if (context === 'lastName' && lastName) {
      if (lastName.length > 6) return 100 - lastName.length * 4
    }
    return 70
  }

  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880

  render() {
    const { firstName, lastName, disabled } = this.state

    return (
      <div>
        <Input
          className={styles.firstNameInput}
          value={firstName}
          placeholder="First"
          onChange={e => this.onChange(e, 'firstName')}
          style={{ fontSize: this.determineSize('firstName') }}
        />
        <Input
          className={styles.lastNameInput}
          placeholder="Last"
          value={lastName}
          onChange={e => this.onChange(e, 'lastName')}
          style={{ fontSize: this.determineSize('lastName') }}
        />
        <div className={styles.saveButton}>
          <Button
            className="mr-2"
            type="primary"
            style={{ width: 200 }}
            disabled={disabled}
            onClick={this.handleSubmit}
          >
            <i className="fa fa-send mr-2" />
            Save Name
          </Button>
        </div>
      </div>
    )
  }
}

export default NameForm
