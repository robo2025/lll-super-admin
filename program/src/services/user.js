import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { URL, USERS_URL, LOGIN_URL, LOGOUT_URL, REGISTER_URL, VERIFY_PAGE, HOME_PAGE } from '../constant/config';


// 获取用户信息
export async function getUserInfo() {
  const access_token = Cookies.get('access_token');
  return lyRequest(`${URL}/server/verify`, {
    headers: {
      Authorization: access_token,
    },
  });
}


// 获取供应商信息
export async function getSupplierInfo(supplierid) {
  const access_token = Cookies.get('access_token');
  return lyRequest(`${USERS_URL}/suppliers/${supplierid}`, {
    headers: {
      Authorization: access_token,
    },
  });
}

// 注册操作
export function register() {
  window.location.href = `${REGISTER_URL}?next=${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}`;
}
// 登出
export function logout() {
  const accessToken = Cookies.get('access_token');
  if (accessToken) {
    Cookies.remove('access_token');
    window.location.href = `${LOGOUT_URL}?access_token=${accessToken}&next=${HOME_PAGE}`;
  } else {
    window.location.href = `${LOGOUT_URL}`;
  }
}

// 登录操作
export function login() {
  // console.log("登录URL--------------",LOGIN_URL + `?next=${encodeURIComponent(VERIFY_PAGE)}`);
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}`;
}


// 纯跳转到登录页面
export function jumpToLogin() {
  // window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}`;  
  // window.location.href = URL;
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(HOME_PAGE)}&disable_redirect=1`;
}
