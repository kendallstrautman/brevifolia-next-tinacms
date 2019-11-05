import Layout from "../components/Layout";
import BlogList from "../components/BlogList";
import "../styles/index.scss";

const Index = () => {
  return (
    <Layout pathname="/">
      <section>
        <BlogList />
      </section>
      </Layout>
  );
};

export default Index;