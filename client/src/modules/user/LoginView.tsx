import * as React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { RouteComponentProps } from "react-router-dom";

import { LoginMutation, LoginMutationVariables } from "../../schemaTypes";
import { meQuery } from "src/graphql/queries/me";
import { userFragment } from "src/graphql/fragments/userFragment";

const loginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ...UserInfo
    }
  }
  ${userFragment}
`;

class LoginView extends React.PureComponent<RouteComponentProps<{}>> {
  state = {
    email: "",
    password: ""
  };

  handleChange = (e: any) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { password, email } = this.state;
    return (
      <Mutation<LoginMutation, LoginMutationVariables>
        update={(cache, { data }) => {
          if (!data || !data.login) {
            return;
          }

          cache.writeQuery({
            query: meQuery,
            data: { me: data.login }
          });
        }}
        mutation={loginMutation}
      >
        {mutate => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <button
                onClick={async () => {
                  const response = await mutate({
                    variables: this.state
                  });
                  console.log(response);
                  this.props.history.push("/account");
                }}
              >
                login
              </button>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default LoginView;
