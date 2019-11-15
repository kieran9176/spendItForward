import React from 'react'
import { connect } from 'react-redux'
import {Form, Input, Select, Icon, Button } from 'antd';

const { Option } = Select;
const changedGlobal = new Set([]);

@connect(({ profile }) => ({ profile }))
@Form.create({
  onFieldsChange(props, changedFields) {
  // onFieldsChange(props) {

    // const {form} = props;
    // const {changed} = allFields;
    const {captions, titles, titleLinks, dates} = changedFields;


    [captions, titles, titleLinks, dates].forEach(arr => {
      return arr ? arr.forEach((indexValue, index) => {
        if (indexValue.touched) changedGlobal.add(index)
      }) : null
    });

    // console.log("form", form)
    // console.log("ALL FIELDS", allFields)
    // console.log("CHANGED FIELDS", changedFields)

    // // form.setFieldsValue({
    // //   changed: [true]
    // // })
    //
  //   changedGlobal.push(changedFields)[...changedGlobal, changedFields]
  //         form.setFieldsValue({
  //         changed: ["false", "false", "false", "false"].map((status, index) => {
  //           return arr[index] ? "true" : "false"
  //         })
  //       }) : null
  //     });
  }
})

class ArticlesForm extends React.Component {

  remove = (k, index) => {
    const { form, dispatch } = this.props;
    // can use data-binding to get
    const { keys, captions, titles, links, IDs } = form.getFieldsValue();

    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    const articles = this.createPayloads("removeArticles", [IDs[index]]);

    console.log("ARTICLES", articles)

    dispatch({
      type: 'profile/EDIT_PROFILE',
      payload: {
        mutation: "removeArticles",
        data: { articles }
      }
    });

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter( (key) => {
        return key !== k
      }),
      captions: captions.filter( (caption) => {
        return caption !== captions[index]
      }),
      titles: titles.filter( (title) => {
        return title !== titles[index]
      }),
      links: links.filter( (titleLink) => {
        return titleLink !== links[index]
      }),
      IDs: IDs.filter( (ID) => {
        return ID !== IDs[index]
      }),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(keys[keys.length - 1] + 1);

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  createPayloads = (action, array) => {
    const articles = [];
    switch (action) {
      case "updateArticles":
        for (let i = 0; i < array[0].length; i += 1) {
          articles.push({
            caption: array[0][i],
            title: array[1][i],
            url: array[2][i],
            id: array[3][i],
            changed: array[4][i]
          })
        }
        return articles;
      case "removeArticles":
        articles.push({ id: array[0] });
        return articles;
      default:
        return "Could not update"
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const {form, dispatch} = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const {keys, titles, captions, links, IDs } = values;
        const uniqueChanged = Array.from(changedGlobal)


        const titlesArr = keys.map(key => titles[key]);
        const captionArr = keys.map(key => captions[key]);

        const linksArr = keys.map(key => links[key]);
        const idArr = keys.map(key => IDs[key]);
        const changedArr = ["false", "false", "false", "false", "false"].map((value, index) => {
          if (uniqueChanged.includes(index)) return "true";
          return "false"
        });

        const articles = this.createPayloads("updateArticles", [captionArr, titlesArr, linksArr, idArr, changedArr]);

        // console.log("ARTICLES", articles)

        dispatch({
          type: 'profile/EDIT_PROFILE',
          payload: {
            mutation: "updateArticles",
            data: { articles }
          }
        })
      }
    })
  };

  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880

  render() {
    const { form, profile } = this.props
    const { articles } = profile
    const { getFieldDecorator, getFieldValue } = form;

    const selectBefore = (
      <Select defaultValue="https://" style={{ width: 90 }}>
        <Option value="https://">https://</Option>
        <Option value="http://">http://</Option>
      </Select>
    );
    const selectAfter = (
      <Select defaultValue=".com" style={{ width: 80 }}>
        <Option value=".com">.com</Option>
        <Option value=".io">.io</Option>
        <Option value=".org">.org</Option>
        <Option value=".gov">.gov</Option>
      </Select>
    );

    getFieldDecorator('keys', { initialValue: articles.map((articleObj, i) => i )});
    getFieldDecorator('IDs', { initialValue: articles.map((articleObj) => articleObj.id )});
    // getFieldDecorator('changed', { initialValue: articles.map( () => "false" )});

    const keys = getFieldValue('keys');

    const titleFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <Form.Item
            label={`Title ${index + 1}`}
            required={false}
          >
            { getFieldDecorator(`titles[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < articles.length ? articles[index].title : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional articles or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)
            }
          </Form.Item>
          <Form.Item
            label={`Caption ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`captions[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < articles.length ? articles[index].caption : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional articles or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. Senior Consultant" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
          <Form.Item
            label={`Article ${index + 1} URL`}
            required={false}
          >
            { getFieldDecorator(`links[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < articles.length ? articles[index].url : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional articles or delete this field.",
                },
              ],
            })(<Input
              addonBefore={selectBefore}
              addonAfter={selectAfter}
              placeholder="consulting.ey"
              style={{width: '60%', marginRight: 8}}
            />) }
            { keys.length > 0 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k, index)}
              />
            ) : null }
          </Form.Item>
        </div>
      )
    });

    return (
      <Form onSubmit={this.handleSubmit}>
        { titleFormItem }
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default ArticlesForm
