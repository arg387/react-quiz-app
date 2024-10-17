

import { createContext } from "react";
import PropTypes from 'prop-types';

// the UserContext
export const UserContext = createContext();

// the UserProvider component
function UserProvider({ children, value }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export default UserProvider;
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.object.isRequired,
};
export { UserProvider };