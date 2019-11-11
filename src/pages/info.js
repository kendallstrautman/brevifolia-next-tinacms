import { useCMS, useCMSForm, useWatchFormValues } from 'react-tinacms'

import Layout from "../components/Layout";
import infoStyles from "../styles/pages/info.scss";

export default function Info(props) {
  const contactData = props.contact
  

  // TINA CMS Config ---------------------------
  
  const cms = useCMS()
  const [data, form] = useCMSForm({
    id: props.fileRelativePath, // needs to be unique
    label: 'Info Page',

    // starting values for the post object
    initialValues: {
      fileRelativePath: props.fileRelativePath,
      contactData: props.contact,
    },

    // field definition
    fields: [
      {
        name: 'contactData.website_url',
        label: 'Site url',
        component: 'text',
      },
      {
        name: 'contactData.made_with_url',
        label: 'Made with url',
        component: 'text',
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
    console.log(JSON.stringify({ contactData: formState.values.contactData}))
    // console.log(props.fileRelativePath)
    console.log(cms)
    cms.api.git.writeToDisk({
      fileRelativePath: props.fileRelativePath,
      content: JSON.stringify({ contactData: formState.values.contactData}),
    })
  }, [])

  useWatchFormValues(form, writeToDisk)

// END Tina CMS config -----------------------------

  return (
    <Layout pathname='info'>
      <section className={infoStyles.info_blurb}>
        <h2>
          This blog was created using{" "}
          <a href={data.contactData.website_url}>Forestry</a> &{" "}
          <a href={data.contactData.made_with_url}>Gatsby </a>
          <br />
          <br />
          To get started, import this site into Forestry or checkout the
          repository.
        </h2>
        <ul>
          <li>
            <p>
              <a href={`mailto:${contactData.email}`}>
                Email: {contactData.email}
              </a>
            </p>
          </li>
          <li>
            <p>
              <a href={contactData.twitter_url}>
                Twitter: {contactData.twitter_handle}
              </a>
            </p>
          </li>
          <li>
            <p>
              <a href={contactData.github_url}>
                Github: {contactData.github_handle}
              </a>
            </p>
          </li>
        </ul>
      </section>
    </Layout>
  );
}


Info.getInitialProps = async function() {
  const content = await import(`../data/info.json`)

  return {
    fileRelativePath: `src/data/info.json`,
    ...content
  }
}