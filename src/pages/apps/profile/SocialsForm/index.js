import React from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Button, Modal, notification, Select, Input } from 'antd'
import socialTypes from './socials.json'

const { Option } = Select

@connect(({ profile, settings }) => ({ profile, settings }))
@Form.create({
  onFieldsChange(props, changedFields) {
    const { form } = props
    const { changed } = form.getFieldsValue()

    const fieldArr = Object.keys(changedFields)
    if (fieldArr[0] !== 'changed' && fieldArr.length === 1) {
      // makes sure we're ignoring 2 events: 1. when the 'changed' field is updated, 2. form submit (changes all fields)
      for (let i = 0; i < changedFields[fieldArr[0]].length; i += 1) {
        if (changedFields[fieldArr[0]][i]) {
          changed[i] = true
          form.setFieldsValue({ changed })
        }
      }
    }
  },
})
class SocialsForm extends React.Component {
  state = {
    visible: false,
    disabled: true,
    k: null,
    index: null,
  }

  remove = () => {
    const { form, dispatch } = this.props
    const { k, index } = this.state

    // can use data-binding to get
    const { keys, types, urls, changed, IDs } = form.getFieldsValue()

    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    console.log('delete Socials')

    if (IDs[index]) {
      dispatch({
        type: 'profile/DELETE_SOCIALS',
        data: { id: IDs[index] },
      })
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => {
        return key !== k
      }),
      types: types.filter(type => {
        return type !== types[index]
      }),
      urls: urls.filter(url => {
        return url !== urls[index]
      }),
      changed: changed.filter(changedObj => {
        return changedObj !== changed[index]
      }),
      IDs: IDs.filter(ID => {
        return ID !== IDs[index]
      }),
    })
  }

  add = () => {
    const { form } = this.props
    // can use data-binding to get
    let { keys } = form.getFieldsValue()
    let nextKeys = null

    console.log('keys', keys)

    if (!keys.length) {
      keys = [0]
      form.setFieldsValue({
        keys,
      })
    } else {
      nextKeys = keys.concat(keys[keys.length - 1] + 1)
      form.setFieldsValue({
        keys: nextKeys,
      })
    }
  }

  formatUrl = url => {
    console.log('url substr', url.substr(0, 8))
    if (!url) return null
    if (url.substr(0, 8) === 'https://') return url
    return `https://${url}`
  }

  createPayloads = (type, values) => {
    const socials = []
    switch (type) {
      case 'Socials':
        for (let i = 0; i < values.keys.length; i += 1) {
          const formattedUrl = this.formatUrl(values.urls[i])
          socials.push({
            type: values.types[i] || null,
            url: formattedUrl || null,
            id: values.IDs[i] || null,
          })
        }
        return socials
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
    const { form, type, dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ disabled: true })
        const payload = this.createPayloads(type, values)

        dispatch({
          type: 'profile/EDIT_SOCIALS',
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

  getFormAttributes = type => {
    switch (type) {
      case 'Socials':
        return {
          title: 'Social',
          createMutation: 'createSocial',
          deleteMutation: 'removeSocial',
          dispatchType: 'profile/EDIT_SOCIALS',
          labels: ['Type', 'URL'],
        }
      default:
        notification.error({
          message: 'Could not get form attributes.',
          description: 'Attributes of specified type not found.',
        })
        return null
    }
  }

  getInitialValues = type => {
    const { profile } = this.props
    const { socials } = profile

    switch (type) {
      case 'Socials':
        return socials || []
      default:
        notification.error({
          message: 'Could not get initial values.',
          description: 'Values of specified type not found.',
        })
        return null
    }
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

  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880

  render() {
    const { form, type } = this.props
    const { getFieldDecorator, getFieldsValue } = form
    const { visible, disabled } = this.state

    const initialValues = this.getInitialValues(type)
    const { title } = this.getFormAttributes(type)

    getFieldDecorator('keys', { initialValue: initialValues.map((articleObj, i) => i) })
    getFieldDecorator('IDs', { initialValue: initialValues.map(articleObj => articleObj.id) })
    getFieldDecorator('changed', { initialValue: initialValues.map(() => false) })

    const { keys } = getFieldsValue()

    const articleFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <p>
            {title} {index + 1}{' '}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.showModal(k, index)}
              />
            ) : null}
          </p>
          <Form.Item>
            {getFieldDecorator(`types[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].type : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input social.',
                },
              ],
            })(
              <Select style={{ width: '100%', marginRight: 8 }} onChange={this.onChange}>
                {socialTypes.map(value => {
                  // eslint-disable-next-line react/no-array-index-key
                  return (
                    <Option key={Math.random()} value={value.type}>
                      {value.type}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator(`urls[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].url : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input social.',
                },
              ],
            })(
              <Input
                placeholder="e.g. https://facebook.com/kieran.derfus"
                style={{ width: '100%', marginRight: 8 }}
                onChange={this.onChange}
              />,
            )}
          </Form.Item>
          <hr />
        </div>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        {articleFormItem}
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

export default SocialsForm
