import Layout from "../components/Layout";
import BlogList from "../components/BlogList";
import "../styles/index.scss";

const Index = (props) => {
  console.log(props)
  return (
    <Layout>
      <section>
        <BlogList />
      </section>
      </Layout>
  );
};


export default Index;
