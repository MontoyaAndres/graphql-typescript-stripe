import * as React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";

import { MeQuery } from "../../schemaTypes";
import SubscribeUser from "./SubscribeUser";
import { meQuery } from "src/graphql/queries/me";
import ChangeCreditCard from "./ChangeCreditCard";

const Account = () => (
  <Query<MeQuery> fetchPolicy="network-only" query={meQuery}>
    {({ data, loading }) => {
      if (loading) {
        return null;
      }

      if (!data) {
        return <div>data is undefined</div>;
      }

      if (!data.me) {
        return <Redirect to="/login" />;
      }

      if (data.me.type === "free-trial") {
        return (
          <React.Fragment>
            <div>It's free</div>
            <SubscribeUser />
          </React.Fragment>
        );
      }

      return (
        <React.Fragment>
          <div>your current last 4 digits: {data.me.ccLast4}</div>
          <ChangeCreditCard />
        </React.Fragment>
      );
    }}
  </Query>
);

export default Account;
