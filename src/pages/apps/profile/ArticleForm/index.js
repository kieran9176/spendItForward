import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Icon, Button, Modal, notification } from 'antd'
import { formatUrl } from '../../../../services/profile'

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
class ArticlesForm extends React.Component {
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
    const { keys, captions, titles, links, IDs } = form.getFieldsValue()

    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    if (IDs[index]) {
      dispatch({
        type: 'profile/DELETE_ARTICLES',
        data: { id: IDs[index] },
      })
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => {
        return key !== k
      }),
      captions: captions.filter(caption => {
        return caption !== captions[index]
      }),
      titles: titles.filter(title => {
        return title !== titles[index]
      }),
      links: links.filter(titleLink => {
        return titleLink !== links[index]
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
    const articles = []
    switch (type) {
      case 'Articles':
        for (let i = 0; i < values.keys.length; i += 1) {
          const formattedUrl = formatUrl(values.links[i])
          articles.push({
            caption: values.captions[i] || null,
            title: values.titles[i] || null,
            url: formattedUrl || null,
            id: values.IDs[i] || null,
            changed: values.changed[i],
          })
        }
        return articles
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
          type: 'profile/EDIT_ARTICLES',
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
      case 'Articles':
        return {
          title: 'Article',
          createMutation: 'createArticle',
          deleteMutation: 'removeArticle',
          dispatchType: 'profile/EDIT_ARTICLES',
          labels: ['Title', 'Caption', 'Link'],
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
    const { articles } = profile

    switch (type) {
      case 'Articles':
        return articles || []
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

  onChange = e => {
    e.preventDefault()
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

    getFieldDecorator('keys', { initialValue: initialValues.map((articleObj, i) => i) })
    getFieldDecorator('IDs', { initialValue: initialValues.map(articleObj => articleObj.id) })
    getFieldDecorator('changed', { initialValue: initialValues.map(() => false) })

    const { keys } = getFieldsValue()

    const articleFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <h5>
            <strong style={{ marginRight: 8 }}>
              {title} {index + 1}{' '}
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
            {getFieldDecorator(`titles[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].title : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input additional articles or delete this field.',
                },
              ],
            })(
              <Input
                placeholder="e.g. EY has record year"
                style={{ width: '100%', marginRight: 8 }}
                onChange={this.onChange}
              />,
            )}
          </Form.Item>
          <Form.Item label={`${labels[1]} ${index + 1}`} required={false}>
            {getFieldDecorator(`captions[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].caption : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input additional articles or delete this field.',
                },
              ],
            })(
              <Input
                placeholder="e.g. > 1 trillion in revenue"
                style={{ width: '100%', marginRight: 8 }}
                onChange={this.onChange}
              />,
            )}
          </Form.Item>
          <Form.Item label={`${labels[2]} ${index + 1}`} required={false}>
            {getFieldDecorator(`links[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].url : '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Not a valid URL. Sample URL: https://chunesupply.com',
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

export default ArticlesForm
