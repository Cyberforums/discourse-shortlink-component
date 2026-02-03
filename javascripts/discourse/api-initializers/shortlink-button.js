import { apiInitializer } from "discourse/lib/api";
import ShortlinkDisplay from "../components/shortlink-display";

export default apiInitializer("0.11.1", (api) => {
  api.renderInOutlet("topic-title-after", ShortlinkDisplay);
});
