import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Icon, Button, DatePicker, Checkbox, Modal, notification } from 'antd'
import moment from 'moment'
import { formatUrl } from '../../../../services/profile'

const { MonthPicker } = DatePicker

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
class WhatWhereWhenForm extends React.Component {
  state = {
    visible: false,
    disabled: true,
    k: null,
    index: null,
    dispatchEdit: null,
    dispatchDelete: null,
    labels: [],
  }

  componentDidMount() {
    const { type } = this.props
    this.setFormState(type)
  }

  remove = () => {
    const { form, dispatch } = this.props
    const { k, index, dispatchDelete } = this.state
    // can use data-binding to get
    const {
      keys,
      positions,
      organizations,
      links,
      IDs,
      startDates,
      endDates,
    } = form.getFieldsValue()

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
      positions: positions.filter(position => {
        return position !== positions[index]
      }),
      organizations: organizations.filter(organization => {
        return organization !== organizations[index]
      }),
      links: links.filter(link => {
        return link !== links[index]
      }),
      IDs: IDs.filter(ID => {
        return ID !== IDs[index]
      }),
      startDates: startDates.filter(startDate => {
        return startDate !== startDates[index]
      }),
      endDates: endDates.filter(endDate => {
        return endDate !== endDates[index]
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
      case 'Experience':
        for (let i = 0; i < values.keys.length; i += 1) {
          const formattedUrl = formatUrl(values.links[i])
          payloads.push({
            position: values.positions[i] || null,
            company: values.organizations[i] || null,
            start_date: moment(values.startDates[i]).format('YYYY-MM') || null,
            end_date: !values.checkboxes[i]
              ? moment(values.endDates[i]).format('YYYY-MM')
              : 'Present' || null,
            link: formattedUrl || null,
            id: values.IDs[i] || null,
            changed: values.changed[i],
          })
        }
        return payloads
      case 'Leadership':
        for (let i = 0; i < values.keys.length; i += 1) {
          const formattedUrl = formatUrl(values.links[i])
          payloads.push({
            position: values.positions[i] || null,
            organization: values.organizations[i] || null,
            start_date: moment(values.startDates[i]).format('YYYY-MM') || null,
            end_date: !values.checkboxes[i]
              ? moment(values.endDates[i]).format('YYYY-MM')
              : 'Present',
            link: formattedUrl || null,
            id: values.IDs[i] || null,
            changed: values.changed[i],
          })
        }
        return payloads
      case 'Brags':
        for (let i = 0; i < values.keys.length; i += 1) {
          const formattedUrl = formatUrl(values.links[i])
          payloads.push({
            what: values.positions[i] || null,
            where: values.organizations[i] || null,
            url: formattedUrl || null,
            start_date: moment(values.startDates[i]).format('YYYY-MM'),
            end_date: !values.checkboxes[i]
              ? moment(values.endDates[i]).format('YYYY-MM')
              : 'Present',
            id: values.IDs[i] || null,
            changed: values.changed[i],
          })
        }
        return payloads
      case 'Articles':
        for (let i = 0; i < values.keys.length; i += 1) {
          const formattedUrl = formatUrl(values.links[i])
          payloads.push({
            caption: values.captions[i] || null,
            title: values.titles[i] || null,
            url: formattedUrl || null,
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

  toggleDisabled = (e, index) => {
    const { form } = this.props
    const { checkboxes } = form.getFieldsValue()

    form.setFieldsValue({
      checkboxes: checkboxes.map((checked, i) => {
        if (i === index) return !checked
        return checked
      }),
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, type } = this.props
    const { dispatchEdit } = this.state

    form.validateFields((err, values) => {
      if (!err) {
        console.log('handleSubmit values', values)

        this.setState({ disabled: true })
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

  showModal = (k, index) => {
    this.setState({
      visible: true,
      k,
      index,
    })
  }

  handleOk = e => {
    e.preventDefault()
    this.setState({
      visible: false,
    })
    this.remove()
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  onChange = () => {
    this.setState({ disabled: false })
  }

  setFormState = type => {
    switch (type) {
      case 'Leadership':
        this.setState({
          dispatchEdit: 'profile/EDIT_LEADERSHIP',
          dispatchDelete: 'profile/DELETE_LEADERSHIP',
          labels: ['Organization', 'Organization', 'Position'],
        })
        return 'Leadership Success'
      case 'Experience':
        this.setState({
          dispatchEdit: 'profile/EDIT_EXPERIENCE',
          dispatchDelete: 'profile/DELETE_EXPERIENCE',
          labels: ['Company', 'Company', 'Title'],
        })
        return 'Experience Success'
      case 'Brags':
        this.setState({
          dispatchEdit: 'profile/EDIT_BRAGS',
          dispatchDelete: 'profile/DELETE_BRAGS',
          labels: ['What', 'Link', 'Where'],
        })
        return 'Brags Success'
      default:
        return null
    }
  }

  getInitialValues = type => {
    const { profile } = this.props
    const { leadership, experience, brags } = profile
    const initialValues = []

    if (type === 'Leadership') {
      return leadership || []
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
    if (type === 'Brags') {
      if (brags) {
        for (let i = 0; i < brags.length; i += 1) {
          initialValues.push({
            position: brags[i].what || null,
            organization: brags[i].where || null,
            link: brags[i].url || null,
            start_date: brags[i].start_date || null,
            end_date: brags[i].end_date || null,
            id: brags[i].id || null,
          })
        }
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

    const { visible, labels, disabled } = this.state
    const initialValues = this.getInitialValues(type)

    getFieldDecorator('keys', { initialValue: initialValues.map((expObj, i) => i) })
    getFieldDecorator('IDs', { initialValue: initialValues.map(expObj => expObj.id) })
    getFieldDecorator('changed', { initialValue: initialValues.map(() => false) })
    getFieldDecorator('checkboxes', {
      initialValue: initialValues.map(expObj => expObj.end_date === 'Present'),
    })

    const { keys, checkboxes } = getFieldsValue()

    const companyFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <h5>
            <strong style={{ marginRight: 8 }}>
              {type} {index + 1}
            </strong>
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.showModal(k, index)}
              />
            ) : null}
          </h5>
          <Form.Item label={`${labels[0]} ${index + 1}`} required={false}>
            {getFieldDecorator(`organizations[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].organization : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input additional experience or delete this field.',
                },
              ],
            })(
              <Input
                placeholder="e.g. EY"
                style={{ width: '100%', marginRight: 8 }}
                onChange={this.onChange}
              />,
            )}
          </Form.Item>
          <Form.Item label={`${labels[1]} ${index + 1} Hyperlink`} required={false}>
            {getFieldDecorator(`links[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].link : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Not a valid URL. Sample URL: https://chunesupply.com',
                  // type: 'url',
                },
              ],
            })(
              <Input
                placeholder="consulting.ey"
                style={{ width: '100%', marginRight: 8 }}
                onChange={this.onChange}
              />,
            )}
          </Form.Item>
          <Form.Item label={`${labels[2]} ${index + 1}`} required={false}>
            {getFieldDecorator(`positions[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].position : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input additional experience or delete this field.',
                },
              ],
            })(
              <Input
                placeholder="e.g. Senior Consultant"
                style={{ width: '100%', marginRight: 8 }}
                onChange={this.onChange}
              />,
            )}
          </Form.Item>
          <Form.Item label={`Start Date ${index + 1}`} required={false}>
            {getFieldDecorator(`startDates[${index}]`, {
              rules: [
                {
                  type: 'object',
                  required: true,
                  message: 'Please select start date.',
                },
              ],
              initialValue:
                index < initialValues.length ? moment(initialValues[index].start_date) : null,
            })(<MonthPicker onChange={this.onChange} />)}
          </Form.Item>
          <Form.Item>
            <Checkbox
              onClick={e => this.toggleDisabled(e, index)}
              checked={checkboxes[index]}
              onChange={this.onChange}
            >
              I currently work here.
            </Checkbox>
          </Form.Item>
          <Form.Item label={`End Date ${index + 1}`} required={false}>
            {getFieldDecorator(`endDates[${index}]`, {
              rules: [
                {
                  type: 'object',
                  required: false,
                  message: 'Please select end date.',
                },
              ],
              initialValue:
                index < initialValues.length && initialValues[index].end_date !== 'Present'
                  ? moment(initialValues[index].end_date)
                  : null,
            })(<MonthPicker disabled={checkboxes[index]} onChange={this.onChange} />)}
          </Form.Item>
        </div>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        {companyFormItem}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{ width: '100%', marginRight: 8 }}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Button type="primary" htmlType="submit" disabled={disabled}>
          Save
        </Button>
        <Modal
          title="Remove Entry?"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Are you sure you want to remove this item? It will be deleted from your profile.</p>
          <p>If yes, click OK. Otherwise you can cancel.</p>
        </Modal>
      </Form>
    )
  }
}

export default WhatWhereWhenForm
