import React, { Suspense } from "react";
import { List, Page, Icon, useNavigate } from "zmp-ui";
import IndexHeader from "pages/index/index_header";
import TopBanner from "pages/index/top_banner";
import Divider from "../../components/divider";
import TopCategory from "./top_category";
import MainCategory from "./main_category";
import { BotBanner } from "./bot_banner";

const HomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex-1 flex flex-col">
      <IndexHeader />
      <Page hideScrollbar={true} className="flex-1 overflow-auto">
        <TopBanner />
        <Suspense>
          <TopCategory />
        </Suspense>
        <Divider />
        <MainCategory />
        <Divider />
        <BotBanner />
      </Page>
    </Page>
  );
};

export default HomePage;
