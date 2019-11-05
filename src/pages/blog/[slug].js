import React from 'react'
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { useCMS, useCMSForm, useWatchFormValues } from 'react-tinacms'

import blogStyles from "../../styles/pages/blog.scss";
import Layout from '../../components/Layout'

export default function Page(props) {
  // TINA CMS Config ---------------------------

  const cms = useCMS()
  console.log(cms)
  const [post, form] = useCMSForm({
    id: props.fileRelativePath, // needs to be unique
    label: 'Edit Post',

    // starting values for the post object
    initialValues: {
      title: props.data.title,
      data: props.data.date,
      author: props.data.author,
      markdownBody: props.content
    },

    // field definition
    fields: [
      {
        name: 'title',
        label: 'Title',
        component: 'text',
      },
      {
        name: 'date',
        label: 'Date',
        component: 'date',
      },
      {
        name: 'author',
        label: 'Author',
        component: 'text',
      },
      {
        name: 'markdownBody',
        label: 'Blog Body',
        component: 'markdown',
      },
      
    ],

    // save & commit the file when the "save" button is pressed
    onSubmit(data) {
      return cms.api.git
        .writeToDisk({
          fileRelativePath: props.fileRelativePath,
          content: JSON.stringify({ title: formState.values.title }),
        })
        .then(() => {
          return cms.api.git.commit({
            files: [props.fileRelativePath],
            message: `Commit from Tina: Update ${data.fileRelativePath}`,
          })
        })
    },
  })

  const writeToDisk = React.useCallback(formState => {
    console.log(cms)
    cms.api.git.writeToDisk({
      fileRelativePath: props.fileRelativePath,
      content: JSON.stringify({ title: formState.values.title }),
    })
  }, [])

  useWatchFormValues(form, writeToDisk)

  // END Tina CMS config -----------------------------

  function reformatDate(fullDate) {
    const date = new Date(fullDate)
    return date.toDateString().slice(4);
  }

  const frontmatter = props.data
  const markdownBody = props.content

  return (
      <Layout>
      <article className={blogStyles.blog}>
          <figure className={blogStyles.blog__hero}>
          <img
              src={frontmatter.hero_image}
              alt={`blog_hero_${frontmatter.title}`}
          />
          </figure>
          <div className={blogStyles.blog__info}>
          <h1>{post.title}</h1>
          <h3>{reformatDate(frontmatter.date)}</h3>
          </div>
          <div className={blogStyles.blog__body}>
          <ReactMarkdown source={markdownBody} />
          </div>
          <h2 className={blogStyles.blog__footer}>
          Written By: {frontmatter.author}
          </h2>
      </article>
      </Layout>
    );

}

Page.getInitialProps = async function(ctx) {
  const { slug } = ctx.query
  const content = await import(`../../posts/${slug}.md`)
  const data = matter(content.default);

  return {
    fileRelativePath: `/posts/${slug}.md`,
    ...data
  }
}