import React from 'react'
import AddForm from './AddForm'
import styles from './style.module.scss'

class BlogAddPost extends React.Component {
  render() {
    return (
      <div className={styles.addPost}>
        <AddForm />
      </div>
    )
  }
}

export default BlogAddPost
