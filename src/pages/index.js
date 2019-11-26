import { useCMS, useLocalForm, useWatchFormValues } from 'react-tinacms'
import matter from 'gray-matter'

import Layout from "../components/Layout";
import BlogList from "../components/BlogList";

const Index = (props) => {
  // TINA CMS Config ---------------------------
  const cms = useCMS()
  const [data, form] = useLocalForm({
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
    <Layout pathname="/" siteTitle={data.title} siteDescription={data.description}>
      <section>
        <BlogList allBlogs={props.allBlogs} />
      </section>
      </Layout>
  );
};

export default Index;

Index.getInitialProps = async function() {
  const content = await import(`../data/config.json`)
     // get all blog data for list
     const posts = (context => {
      const keys = context.keys();
      const values = keys.map(context);
      const data = keys.map((key, index) => {
        // Create slug from filename
        const slug = key
          .replace(/^.*[\\\/]/, "")
          .split(".")
          .slice(0, -1)
          .join(".");
        const value = values[index];
        // Parse yaml metadata & markdownbody in document
        const document = matter(value.default);
        return {
          document,
          slug
        };
      });
      return data;
    })(require.context("../posts", true, /\.md$/));

  return {
    fileRelativePath: `src/data/config.json`,
    allBlogs: posts,
    ...content
  }
}