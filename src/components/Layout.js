import Header from "./Header";
import layoutStyles from "../styles/components/layout.scss";

export default function Layout(props) {
  return (
    <section
      className={`${layoutStyles.layout} ${
        props.pathname == "info" &&
        layoutStyles.info_page}`
      }
      style={{
        backgroundColor: `${props.bgColor && props.bgColor}`,
        color: `${props.pathname == "info" && 'white'}`
      }}
    >
      <Header siteTitle={props.siteTitle} />
      <div className={layoutStyles.content}>{props.children}</div>
    </section>
  );
}