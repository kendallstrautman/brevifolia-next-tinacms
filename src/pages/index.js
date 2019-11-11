import { useCMS, useCMSForm, useWatchFormValues } from 'react-tinacms'

import Layout from "../components/Layout";
import BlogList from "../components/BlogList";
import "../styles/index.scss";

const Index = (props) => {
  // TINA CMS Config ---------------------------
  const cms = useCMS()
  const [data, form] = useCMSForm({
    id: props.fileRelativePath, // needs to be unique
    label: 'Site Config',

    // starting values for the post object
    initialValues: {
      fileRelativePath: props.fileRelativePath,
      title: props.title,
      description: props.description,
      repositoryUrl: props.repositoryUrl
    },

    // field definition
    fields: [
      {
        name: 'title',
        label: 'Site Title',
        component: 'text'
      },
      {
        name: 'description',
        label: 'Site Description',
        component: 'text'
      },
      {
        name: 'repositoryUrl',
        label: 'Repository Url',
        component: 'text'
      },
    ],

    // save & commit the file when the "save" button is pressed
    onSubmit(data) {
      return cms.api.git
        .writeToDisk({
          fileRelativePath: props.fileRelativePath,
          content: JSON.stringify(formState.values),
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

    cms.api.git.onChange({
      fileRelativePath: props.fileRelativePath,
      content: JSON.stringify(formState.values),
    })
  }, [])

  useWatchFormValues(form, writeToDisk)

// END Tina CMS config -----------------------------
  return (
    <Layout pathname="/" siteTitle={data.title}>
      <section>
        <BlogList />
      </section>
      </Layout>
  );
};

export default Index;

Index.getInitialProps = async function() {
  const content = await import(`../data/config.json`)

  return {
    fileRelativePath: `src/data/config.json`,
    ...content
  }
}