/* eslint-disable import/no-anonymous-default-export */
import Cookies from 'js-cookie';

const getUser = () => {
  const user = Cookies.get('authUser');
  return typeof user === 'string' ? JSON.parse(user) : user;
};

const setUser = (user: any, options = {}) => Cookies.set(
  'authUser',
  JSON.stringify({
    ...user,
  }),
  options,
);

const removeUser = () => Cookies.remove('authUser');

const getJWTToken = () => Cookies.get('jwttoken');

const setJWTToken = (token: any, options = {}) => Cookies.set(
  'jwttoken',
  token,
  options,
);

const removeJWTToken = () => Cookies.remove('jwttoken');

export default {
  getUser,
  setUser,
  removeUser,
  setJWTToken,
  getJWTToken,
  removeJWTToken,
};
