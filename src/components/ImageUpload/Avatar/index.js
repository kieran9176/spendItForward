import React from 'react'
import {connect} from 'react-redux'
import {Upload, Icon, message, Progress } from 'antd';
import AWS from "aws-sdk";
import styles from './style.css'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
    console.log('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('Image must be smaller than 5MB!');
    console.log('Image must be smaller than 5MB!');
  }
  return isJpgOrPng && isLt2M;
}

@connect(({profile}) => ({profile}))
class Avatar extends React.Component {

  state = {
    loading: false,
    progress: false
  };

  componentDidMount() {
    const {post} = this.props;

    if (post) this.setState({imageUrl: post.image_url});
    else this.setState({imageUrl: ''})
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.handleUpload(info.file.originFileObj)
        .then(res => console.log(res))
    }
  };

  async handleUpload(fileObj) {
    const {form, dispatch} = this.props;

    console.log("made it to handleUpload");

    this.setState({
      loading: true
    });

    AWS.config.update({
      
    });

    const S3 = new AWS.S3();

    const encoded = encodeURI(fileObj.name);

    const objParams = {
      Bucket: "cf-simple-s3-origin-cloudfrontfors3-273116933489",
      Key: `kieranpaul-source/${encoded}`,
      Body: fileObj,
      ContentType: fileObj.type
    };

    return S3.putObject(objParams)
      .on("httpUploadProgress", (progress) => {
        const progressPercentage = Math.round((progress.loaded / progress.total) * 100);
        this.setState({progress: progressPercentage});
        console.log((progress.loaded / progress.total) * 100);
      })
      .send((err) => {
          if (err) {
            console.log("Something went wrong");
            console.log(err.code);
            console.log(err.message);
            this.setState({
              loading: false,
              progress: false
            });
            return "Failed"
          }

          this.setState({
            loading: false,
            progress: false
          });

          console.log("fileObj.name", fileObj.name)

          const resURL = `https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/${encoded}`;

          form.setFieldsValue({
            image_url: resURL
          });

          getBase64(fileObj, imageUrl =>
            this.setState({
              imageUrl,
            })
          );

          const post = form.getFieldsValue();

          dispatch({
            type: 'profile/EDIT_POST',
            payload: {
              mutation: "updatePost",
              data: {post}
            }
          });
          return "Success";
        }
      );
  };

  render() {
    const { loading, progress } = this.state;
    const { form, post } = this.props;

    form.getFieldDecorator('image_url', {
      initialValue: post ? post.image_url : null
    });

    if (progress)  {
      return (
        <Upload
          name="avatar"
          listType="picture-card"
          className={styles.avataruploader}
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          <Progress type="circle" percent={progress} width={80} />
        </Upload>
      )
    }

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload Cover Image</div>
      </div>
    );

    const { imageUrl } = this.state;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className={styles.avataruploader}
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default Avatar
