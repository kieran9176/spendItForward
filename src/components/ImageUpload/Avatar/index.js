import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Upload, Icon, message, Progress, Button, notification } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import AWS from 'aws-sdk'
import uuidv4 from 'uuid/v4'
import styles from './style.module.scss'

function beforeUpload(file, type) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isPdf = file.type === 'application/pdf'

  if (type === 'Primary' || type === 'Secondary') {
    if (!isJpgOrPng) {
      notification.error({
        message: 'File-type not accepted.',
        description: 'You can only upload a JPG/PNG file.',
      })
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!')
      notification.error({
        message: 'File too large.',
        description: 'Image must be smaller than 5MB!',
      })
    }
    return isJpgOrPng && isLt10M
  }
  if (type === 'Resume') {
    if (!isPdf) {
      notification.error({
        message: 'File-type not accepted.',
        description: 'You can only upload a PDF.',
      })
    }
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error('File must be smaller than 20MB!')
      notification.error({
        message: 'File too large.',
        description: 'File must be smaller than 20MB!',
      })
    }
    return isPdf && isLt20M
  }
  notification.error({
    message: 'File Type Not Recognized.',
    description: 'Images must be JPG or PNG. Resumes must be PDFs.',
  })
  return 'Type Not Recognized'
}

@connect(({ assets, profile }) => ({ assets, profile }))
class Avatar extends React.Component {
  _isMounted = false

  state = {
    loading: false,
    progress: false,
    dispatchEdit: null,
  }

  async componentDidMount() {
    const { type } = this.props
    // eslint-disable-next-line no-underscore-dangle
    this._isMounted = true
    await this.setFormState(type)
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-underscore-dangle
    this._isMounted = false
  }

  setFormState = async type => {
    // this.setState(this.getInitialValues(type));
    switch (type) {
      case 'Primary':
        // eslint-disable-next-line no-underscore-dangle
        if (this._isMounted) {
          this.setState({ dispatchEdit: 'assets/EDIT_ASSETS' })
          // this.setState(this.getInitialValues(type));
          return 'Primary Success'
        }
        return 'Primary Failure'
      case 'Secondary':
        // eslint-disable-next-line no-underscore-dangle
        if (this._isMounted) {
          this.setState({
            dispatchEdit: 'assets/EDIT_ASSETS',
          })
          // this.setState(this.getInitialValues(type));
        }
        return 'Secondary Failure'
      case 'Resume':
        this.setState({
          dispatchEdit: 'profile/EDIT_RESUME',
        })
        return 'Resume Success'
      case 'postImage':
        this.setState({
          dispatchEdit: 'profile/EDIT_POST',
        })
        return 'postImage Success'
      default:
        return null
    }
  }

  getInitialValues = type => {
    const { assets, id, profile } = this.props
    const { posts } = profile

    if (type === 'Primary') {
      console.log('avatar/index.js getInitialValues assets', assets)
      if (assets) return assets.filter(asset => asset.type === 'primary')[0]
      return { id: null, type: 'primary', url: '' }
    }
    if (type === 'Secondary') {
      if (assets) return assets.filter(asset => asset.type === 'secondary')[0]
      return { id: null, type: 'secondary', url: '' }
    }
    if (type === 'Resume') {
      if (assets) {
        const resume = assets.filter(asset => asset.type === 'resume')[0]
        return resume
      }
      return { id: null, type: 'resume', url: '' }
    }
    if (type === 'postImage') {
      // const { id } = currentPost
      const post = posts.filter(postObj => postObj.id === id)[0]
      return { id, url: post.image_url }
    }
    return null
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      this.handleUpload(info.file.originFileObj).then(res => console.log(res))
    }
  }

  handleResumeChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      this.handleUpload(info.file.originFileObj).then(res => console.log(res))
    }
    if (info.file.status === 'done') {
      this.setState({ loading: false })
    }
    if (info.file.status === 'error') {
      this.setState({ loading: false })
    }
    if (info.file.status === 'removed') {
      this.setState({
        loading: false,
      })
    }
  }

  createArticleUrl = (key, type) => {
    if (type !== 'Resume') {
      const imageRequest = JSON.stringify({
        bucket: 'cf-simple-s3-origin-cloudfrontfors3-273116933489',
        key,
        edits: {
          resize: {
            width: 500,
            height: 300,
            fit: 'inside',
          },
        },
      })
      return `https://d1kk667yopfgms.cloudfront.net/${btoa(imageRequest)}`
    }
    return `https://pbmgmt-resumes.s3.amazonaws.com/${key}`
  }

  async handleUpload(fileObj) {
    const { dispatch, assets, type } = this.props
    const { dispatchEdit } = this.state
    let id = null

    if (type === 'Primary') {
      // eslint-disable-next-line prefer-destructuring
      id = assets[0].id
      // eslint-disable-next-line prefer-destructuring
    }

    if (type === 'Secondary') {
      // eslint-disable-next-line prefer-destructuring
      id = assets[1] ? assets[1].id : null
      // eslint-disable-next-line prefer-destructuring
    }

    this.setState({
      loading: true,
    })

    AWS.config.update({
      accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
      region: 'us-east-1',
    })

    const S3 = new AWS.S3()
    const key = uuidv4()

    const objParams = {
      Bucket:
        type !== 'resume' ? 'cf-simple-s3-origin-cloudfrontfors3-273116933489' : 'pbmgmt-resumes',
      Key: key,
      Body: fileObj,
      ContentType: fileObj.type,
    }

    return S3.putObject(objParams)
      .on('httpUploadProgress', progress => {
        const progressPercentage = Math.round((progress.loaded / progress.total) * 100)
        this.setState({ progress: progressPercentage })
      })
      .send(err => {
        if (err) {
          notification.error({
            message: err.code,
            description: err.message,
          })

          this.setState({
            loading: false,
            progress: false,
          })
          return 'Failed'
        }

        this.setState({
          loading: false,
          progress: false,
        })

        // this.setState({
        //   id,
        //   url: key,
        // })

        dispatch({
          type: dispatchEdit,
          payload: { type: type.toLowerCase(), id, url: key },
        })
        return 'Success'
      })
  }

  render() {
    const { loading, progress } = this.state
    const { type, profile, dispatch, assets } = this.props
    const { firstTimeLogin } = profile

    // if (form && post) {
    //   form.getFieldDecorator('image_url', {
    //     initialValue: post ? post.image_url : null,
    //   })
    // }
    let id = null
    let url = null

    if (type === 'Primary') {
      // eslint-disable-next-line prefer-destructuring
      id = assets[0].id
      // eslint-disable-next-line prefer-destructuring
      url = assets[0].url
    }

    if (type === 'Secondary') {
      // eslint-disable-next-line prefer-destructuring
      id = assets[1] ? assets[1].id : null
      // eslint-disable-next-line prefer-destructuring
      url = assets[1] ? assets[1].url : null
    }

    const uploadImageButton = (
      <div className={styles.avatarUploader}>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div>Upload Picture</div>
      </div>
    )

    if (progress === 100 && firstTimeLogin.status === true) {
      dispatch({
        type: 'profile/EDIT_FIRST_TIME_LOGIN',
        payload: 'Step 2',
      })
      return <Redirect to="/apps/profile" />
    }

    if (progress && type !== 'Resume') {
      return (
        <Upload
          name="avatar"
          listType="picture-card"
          className={styles.avatarUploader}
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={file => beforeUpload(file, type)}
          onChange={this.handleChange}
        >
          <Progress className={styles.avatarUploader} type="circle" percent={progress} width={80} />
        </Upload>
      )
    }

    if (progress && type === 'Resume') {
      return (
        <div>
          <Upload
            name="file"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={file => beforeUpload(file, type)}
            onChange={this.handleResumeChange}
            className={styles.avatarUploader}
            fileList={
              url
                ? [
                    {
                      uid: id,
                      name: url,
                      url: this.createArticleUrl(url, 'Resume'),
                    },
                  ]
                : []
            }
          >
            <Button>
              <UploadOutlined className={styles.avatarUploader} />
              Click to Upload
            </Button>
          </Upload>
          <Progress
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            percent={progress}
          />
        </div>
      )
    }

    if (type === 'Primary' || type === 'Secondary' || type === 'postImage') {
      return (
        <Upload
          name="avatar"
          listType="picture-card"
          className={styles.avatarUploader}
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={file => beforeUpload(file, type)}
          onChange={this.handleChange}
        >
          {url ? (
            <img src={this.createArticleUrl(url)} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadImageButton
          )}
        </Upload>
      )
    }
    return (
      <Upload
        name="file"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={file => beforeUpload(file, type)}
        onChange={this.handleResumeChange}
        className={styles.avatarUploader}
        fileList={
          url
            ? [
                {
                  uid: id,
                  name: url,
                  url: this.createArticleUrl(url, 'Resume'),
                },
              ]
            : []
        }
      >
        <Button>
          <UploadOutlined /> Click to Upload
        </Button>
      </Upload>
    )
  }
}

export default Avatar
