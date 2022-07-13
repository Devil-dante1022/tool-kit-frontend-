import React, { Fragment } from "react";

import { useRouter } from "next/router";

import Box from "@mui/material/Box";

import Header from "./Header";
import Footer from "./Footer";
import PageInfo from "./PageInfo";
import Left from "./Left"

interface ContainerProps {
  children: React.ReactNode
}

const PageContainer = (props: ContainerProps) => {
  const linkRouter = useRouter();

  const isActive = (url: string) => {
    //used pathname before news category page.
    return linkRouter.asPath.includes(url);
  };

  React.useEffect(() => {
    (async () => {

    })()
  }, []);

  return (
    <Box
      component={`section`}
      sx={{
        background: theme => theme.palette.background.default
      }}
    >
      <Box
        sx={{
          display: 'flex'
        }}
      >
        <Left />
        <Box
          sx={{
            width: '100%',
            ml: 25
          }}
        >

          <Box
            component={`main`}
          >
            {props.children}
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default PageContainer;
