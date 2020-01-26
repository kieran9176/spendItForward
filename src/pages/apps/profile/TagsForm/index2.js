import React from 'react'
import { connect } from 'react-redux'
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'graphql/mutations'
import { Tag, Input, Icon, notification } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

@connect(({ profile }) => ({ profile }))
class TagsForm extends React.Component {

  constructor(props) {
    super(props);
    const { coursework }  = props.profile;
    const { context } = props;
    let tags = [];
    // if (context === "coursework") tags = coursework.map(courseworkInstance => courseworkInstance.course_name);
    if (context === "coursework") tags = coursework
    this.state = {
      tags,
      // coursework,
      inputVisible: false,
      inputValue: '',
    };
  }

  handleClose = removedTag => {
    let {tags, coursework} = this.state;

    console.log(removedTag.id);

    API.graphql(graphqlOperation(mutations.deleteCoursework, {
        input: {
          id: removedTag.id
        }
      })
    )
      .then(response => {

        if (response.data) {
          const {deleteCoursework} = response.data;

          tags = tags.filter(tag => tag !== removedTag.course_name);
          coursework = coursework.filter(courseworkObj => courseworkObj.course_name !== removedTag.course_name);

          this.setState({tags, coursework});

          notification.success({
            message: 'Updates Saved',
            description: `You've successfully removed "${deleteCoursework.course_name}" from your coursework.`
          });

        } else {
          notification.error({
            message: 'Error',
            description: 'Our team of highly trained monkeys has been dispatched to deal with the situation.',
          });
        }
      });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
    // this.setState({ inputVisible: true });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const {inputValue} = this.state;
    let {tags, coursework} = this.state;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];

      API.graphql(graphqlOperation(mutations.createCoursework, {
          input: {
            course_name: inputValue
          }
        })
      )
        .then(response => {

          if (response.data) {
            const {createCoursework} = response.data;
            const {id} = createCoursework;

            coursework = [...coursework, {course_name: createCoursework.course_name, id}];

            this.setState({
              tags,
              coursework,
              inputVisible: false,
              inputValue: '',
            });

            notification.success({
              message: 'Updates Saved',
              description: `You've successfully added "${createCoursework.course_name}" to your coursework.`
            });

          } else {
            notification.error({
              message: 'Error',
              description: 'Our team of highly trained monkeys has been dispatched to deal with the situation.',
            });
          }
        });
    }
  };

  forMap = courseworkObj => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(courseworkObj);
        }}
      >
        {courseworkObj.course_name}
      </Tag>
    );
    return (
      <span key={courseworkObj.course_name} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  saveInputRef = (input) => {
    this.input = input
  };

  handleSubmit = e => {
    e.preventDefault();
    // const { dispatch } = this.props
    const { tags, coursework } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'profile/EDIT_PROFILE',
      payload: {
        mutation: "updateCoursework",
        data: { coursework }
      }
    });

    console.log("COURSEWORK", coursework)
    console.log("TAGS", tags)

  };

  render() {
    const {coursework, inputVisible, inputValue} = this.state;
    // const tagChild = tags.map(this.forMap);
    const tagChild = coursework.map(this.forMap);

    return (
      <div>
        <div style={{marginBottom: 16}}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = '';
              },
            }}
            leave={{opacity: 0, width: 0, scale: 0, duration: 200}}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        <div style={{marginBottom: 16}}>
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{width: 78}}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag onClick={this.showInput} style={{background: '#fff', borderStyle: 'dashed'}}>
              <Icon type="plus" /> New Tag
            </Tag>
          )}
        </div>
      </div>
    )
  }
}

export default TagsForm
