import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import { useLocalMarkdownForm } from 'next-tinacms-markdown'

import Layout from '../components/Layout'

export default function Info(props) {
  const formOptions = {
    label: 'Info Page',
    fields: [
      {
        name: 'frontmatter.background_color',
        label: 'Background Color',
        component: 'color',
      },
      {
        name: 'markdownBody',
        label: 'Info Content',
        component: 'markdown',
      },
    ],
  }
  const [data] = useLocalMarkdownForm(props.markdownFile, formOptions)

  return (
    <Layout
      pathname="info"
      bgColor={data.frontmatter.background_color}
      siteTitle={props.title}
    >
      <section className="info_blurb">
        <ReactMarkdown source={data.markdownBody} />
      </section>
      <style jsx>{`
        .info_blurb {
          max-width: 800px;
          padding: 1.5rem 1.25rem;
        }

        @media (min-width: 768px) {
          .info_blurb {
            padding: 2rem;
          }
        }

        @media (min-width: 1440px) {
          .info_blurb {
            padding: 3rem;
          }
        }
      `}</style>
    </Layout>
  )
}

Info.getInitialProps = async function() {
  const content = await import(`../data/info.md`)
  const config = await import(`../data/config.json`)
  const data = matter(content.default)

  return {
    markdownFile: {
      fileRelativePath: `data/info.md`,
      frontmatter: data.data,
      markdownBody: data.content,
    },
    title: config.default.title,
  }
}
