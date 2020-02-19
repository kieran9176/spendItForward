import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import styles from './style.module.scss'

@withRouter
@connect(({ profile }) => ({ profile }))
class BlogFeed extends React.Component {
  createArticleUrl = key => {
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

  render() {
    const { profile } = this.props
    const { firstName, lastName, posts } = profile

    return (
      <div>
        <Helmet title="Blog Feed" />
        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Your Posts</strong>
            </div>
          </div>
          <div className="card-body">
            <div className={styles.blogFeed}>
              <div className="row">
                <div className="col-lg-12">
                  <main>
                    {posts.map(article => (
                      <article className={styles.article} key={Math.random()}>
                        <div className={styles.information}>
                          <div className={styles.title}>
                            <h1>
                              <Link to={`/blog/edit-blog-post/false/${article.id}`}>
                                {article.title}
                              </Link>
                            </h1>
                          </div>
                          <ul className={styles.meta}>
                            <li className={styles.metaInf}>
                              <span>
                                Post By {firstName} {lastName}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className={styles.content}>
                          <p dangerouslySetInnerHTML={{ __html: article.caption }} />
                          <div className={styles.articleMore}>
                            <Link to={`/blog/edit-blog-post/false/${article.id}`}>
                              Edit
                              <i className="ml-2 fa fa-angle-right" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                        <footer className={styles.footer} />
                      </article>
                    ))}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default BlogFeed
