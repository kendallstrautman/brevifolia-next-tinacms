import { useCMS, useCMSForm, useWatchFormValues } from 'react-tinacms'
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import * as yaml from 'js-yaml'

import Layout from "../components/Layout";
import toMarkdownString from '../utils/toMarkdownString'


export default function Info(props) {

  // TINA CMS Config ---------------------------
  const cms = useCMS()
  const [data, form] = useCMSForm({
    id: props.fileRelativePath, // needs to be unique
    label: 'Info Page',

    // starting values for the post object
    initialValues: {
      fileRelativePath: props.fileRelativePath,
      frontmatter: props.data,
      markdownBody: props.content,
    },

    // field definition
    fields: [
      {
        name: 'frontmatter.background_color',
        label: 'Background Color',
        component: 'color'
      },
      {
        name: 'markdownBody',
        label: 'Info Content',
        component: 'markdown',
      },
      
    ],

    // save & commit the file when the "save" button is pressed
    onSubmit(data) {
      return cms.api.git
        .writeToDisk({
          fileRelativePath: props.fileRelativePath,
          content: toMarkdownString(formState.values),
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
    cms.api.git.writeToDisk({
      fileRelativePath: props.fileRelativePath,
      content: toMarkdownString(formState.values),
    })
  }, [])

  useWatchFormValues(form, writeToDisk)

// END Tina CMS config -----------------------------

  return (
    <Layout pathname='info' bgColor={data.frontmatter.background_color} siteTitle={props.title}>
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
  );
}


Info.getInitialProps = async function() {
  const content = await import(`../data/info.md`)
  const config = await import(`../data/config.json`)
  const data = matter(content.default)

  return {
    fileRelativePath: `src/data/info.md`,
    title: config.title,
    ...data
  }
}