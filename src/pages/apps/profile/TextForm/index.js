import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, notification } from 'antd'
import moment from 'moment'
// import style from '../style.module.scss'

// const { MonthPicker } = DatePicker;
// const { Option } = Select;

const { TextArea } = Input

@connect(({ profile }) => ({ profile }))
@Form.create({
  onFieldsChange(props, changedFields) {
    const { form } = props
    const { changed } = form.getFieldsValue()

    const fieldArr = Object.keys(changedFields)
    if (fieldArr[0] !== 'changed' && fieldArr.length === 1) {
      // makes sure we're ignoring 2 events: 1. when the 'changed' field is updated, 2. form submit (sends all fields)
      for (let i = 0; i < changedFields[fieldArr[0]].length; i += 1) {
        if (changedFields[fieldArr[0]][i]) {
          changed[i] = true
          form.setFieldsValue({ changed })
        }
      }
    }
  },
})
class TextForm extends React.Component {
  state = {
    // visible: false,
    k: null,
    index: null,
    dispatchEdit: null,
    dispatchDelete: null,
    // labels: []
  }

  componentDidMount() {
    const { type } = this.props
    this.setFormState(type)
  }

  remove = () => {
    const { form, dispatch } = this.props
    const { k, index, dispatchDelete } = this.state
    // can use data-binding to get
    const { keys, text, IDs } = form.getFieldsValue()

    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    if (IDs[index]) {
      dispatch({
        type: dispatchDelete,
        data: { id: IDs[index] },
      })
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => {
        return key !== k
      }),
      text: text.filter(textObj => {
        return textObj !== text[index]
      }),
      IDs: IDs.filter(ID => {
        return ID !== IDs[index]
      }),
    })
  }

  add = () => {
    const { form } = this.props
    // can use data-binding to get
    const { keys, checkboxes } = form.getFieldsValue()
    const nextKeys = keys.concat(keys[keys.length - 1] + 1)
    const nextCheckboxes = checkboxes.concat(false)

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
      checkboxes: nextCheckboxes,
    })
  }

  createPayloads = (type, values) => {
    const payloads = []

    switch (type) {
      case 'Intro':
        for (let i = 0; i < values.keys.length; i += 1) {
          payloads.push({
            content: values.text[i] || null,
            id: values.IDs[i] || null,
            changed: values.changed[i],
          })
        }
        return payloads
      case 'FakeSecondOption':
        for (let i = 0; i < values.keys.length; i += 1) {
          payloads.push({
            position: values.positions[i] || null,
            organization: values.organizations[i] || null,
            start_date: moment(values.startDates[i]).format('YYYY-MM') || null,
            end_date: !values.checkboxes[i]
              ? moment(values.endDates[i]).format('YYYY-MM')
              : 'Present',
            link: values.links[i] || null,
            id: values.IDs[i] || null,
            changed: values.changed[i],
          })
        }
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
    const { form, dispatch, type } = this.props
    const { dispatchEdit } = this.state

    form.validateFields((err, values) => {
      if (!err) {
        const payload = this.createPayloads(type, values)

        dispatch({
          type: dispatchEdit,
          payload,
        })

        // reset changed to false for every field
        const { changed } = form.getFieldsValue()
        for (let i = 0; i < changed.length; i += 1) {
          changed[i] = false
        }
        form.setFieldsValue({ changed })
      } else console.log('error', err)
    })
  }

  setFormState = type => {
    switch (type) {
      case 'Intro':
        this.setState({
          dispatchEdit: 'profile/EDIT_INTRO',
        })
        return 'Intro Success'
      case 'Fake Second Option':
        this.setState({
          dispatchEdit: 'profile/EDIT_REFERENCES',
          dispatchDelete: 'profile/DELETE_REFERENCES',
        })
        return 'References Success'
      default:
        return null
    }
  }

  getInitialValues = type => {
    const { profile } = this.props
    const { intro, experience } = profile
    const initialValues = []

    if (type === 'Intro') {
      return intro || []
    }
    if (type === 'Experience') {
      for (let i = 0; i < experience.length; i += 1) {
        initialValues.push({
          position: experience[i].position || null,
          organization: experience[i].company || null,
          link: experience[i].link || null,
          start_date: experience[i].start_date || null,
          end_date: experience[i].end_date || null,
          id: experience[i].id || null,
        })
      }
      return initialValues
    }
    return initialValues
  }

  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880

  render() {
    const { form, type } = this.props
    const { getFieldDecorator, getFieldsValue } = form

    // const { labels } = this.state;
    const initialValues = this.getInitialValues(type)

    getFieldDecorator('keys', { initialValue: initialValues.map((expObj, i) => i) })
    getFieldDecorator('IDs', { initialValue: initialValues.map(expObj => expObj.id) })
    getFieldDecorator('changed', { initialValue: initialValues.map(() => false) })
    // getFieldDecorator('checkboxes', { initialValue: initialValues.map ((expObj) => expObj.end_date === "Present")});

    const { keys } = getFieldsValue()

    if (!keys.length) keys.push({})

    const textFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <Form.Item>
            {getFieldDecorator(`text[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue:
                index < initialValues.length
                  ? initialValues[index].content
                  : 'Ever since I heard the howling wind ...',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input additional experience or delete this field.',
                },
              ],
            })(<TextArea rows={4} style={{ width: '60%', marginRight: 8 }} />)}
          </Form.Item>
        </div>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        {textFormItem}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default TextForm
