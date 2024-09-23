import { PropagateLoader } from "react-spinners";
import styles from "./LoadingFullpage.module.css";

function LoadingFullpage() {
  return (
    <div className={styles.loading_page}>
      <PropagateLoader color="#24ae7c" size={35} />
    </div>
  );
}

export default LoadingFullpage;
