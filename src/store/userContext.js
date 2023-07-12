import React, { createContext } from "react";

const UserContext = createContext({
  username: String,
  user_id: Number,
  loginStatus: Boolean,
  token: String,
  verifyLoginStatus: () => {},
  logout: () => {},
  last_logged_in: String,
  notify: (msg, severity) => {},
});

export default UserContext;
