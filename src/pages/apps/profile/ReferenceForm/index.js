import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Icon, Button, Modal, notification } from 'antd'

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
class ReferenceForm extends React.Component {
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
    const { keys, text, authors, authorPositions, authorCompanies, IDs } = form.getFieldsValue()

    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    if (IDs[index]) {
      console.log('dispatch deleteReferences')
      dispatch({
        type: 'profile/DELETE_REFERENCES',
        data: { id: IDs[index] },
      })
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => {
        return key !== k
      }),
      text: text.filter(textIndex => {
        return textIndex !== text[index]
      }),
      authors: authors.filter(author => {
        return author !== authors[index]
      }),
      authorPositions: authorPositions.filter(authorPosition => {
        return authorPosition !== authorPositions[index]
      }),
      authorCompanies: authorCompanies.filter(authorCompany => {
        return authorCompany !== authorCompanies[index]
      }),
      IDs: IDs.filter(ID => {
        return ID !== IDs[index]
      }),
    })
  }

  add = () => {
    const { form } = this.props
    // can use data-binding to get
    const { keys } = form.getFieldsValue()
    const nextKeys = keys.concat(keys[keys.length - 1] + 1)

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  createPayloads = (type, values) => {
    const references = []
    switch (type) {
      case 'References':
        console.log('values', values)
        for (let i = 0; i < values.keys.length; i += 1) {
          if (values.changed[i] === true) {
            references.push({
              content: values.text[i] || null,
              author_name: values.authors[i] || null,
              author_position: values.authorPositions[i] || null,
              author_company: values.authorCompanies[i] || null,
              id: values.IDs[i] || null,
            })
          }
        }
        return references
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

        console.log('payload', payload)

        dispatch({
          type: 'profile/EDIT_REFERENCES',
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
      case 'References':
        return {
          title: 'Reference',
          createMutation: 'createReference',
          deleteMutation: 'removeReference',
          dispatchType: 'profile/EDIT_REFERENCES',
          labels: ['Reference', 'Author', 'Author Position', 'Author Company'],
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
    const { references } = profile

    switch (type) {
      case 'References':
        return references || []
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
    const { title, labels } = this.getFormAttributes(type)

    getFieldDecorator('keys', { initialValue: initialValues.map((referenceObj, i) => i) })
    getFieldDecorator('IDs', {
      initialValue: initialValues.map(referenceObj => {
        console.log('referenceObj ID', referenceObj)
        return referenceObj.id
      }),
    })
    getFieldDecorator('changed', { initialValue: initialValues.map(() => false) })

    const { keys } = getFieldsValue()

    const referenceFormItem = keys.map((k, index) => {
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
          <Form.Item label={`${labels[0]} ${index + 1}`}>
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
                  message: 'Please input a reference or delete this field.',
                },
              ],
            })(
              <TextArea
                rows={4}
                style={{ width: '100%', marginRight: 8 }}
                onChange={this.onChange}
              />,
            )}
          </Form.Item>
          <Form.Item label={`${labels[1]} ${index + 1}`} required={false}>
            {getFieldDecorator(`authors[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].author_name : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input additional articles or delete this field.',
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
          <Form.Item label={`${labels[2]} ${index + 1}`} required={false}>
            {getFieldDecorator(`authorPositions[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue:
                index < initialValues.length ? initialValues[index].author_position : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input additional articles or delete this field.',
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
          <Form.Item label={`${labels[3]} ${index + 1}`} required={false}>
            {getFieldDecorator(`authorCompanies[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].author_company : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input author company or delete this field.',
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
        </div>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        {referenceFormItem}
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

export default ReferenceForm
