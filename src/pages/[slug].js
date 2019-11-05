import React from 'react'
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

import blogStyles from "../styles/pages/blog.scss";
import Layout from '../components/Layout'

export default function Page(props) {
    
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
            <h1>{frontmatter.title}</h1>
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
  const content = await import(`../posts/${slug}.md`)
  const data = matter(content.default);

  return {
    fileRelativePath: `/posts/${slug}.md`,
    ...data
  }
}