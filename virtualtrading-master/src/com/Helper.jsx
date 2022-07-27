import SimpleCrypto from "simple-crypto-js";

export function getCurrentToken() {
  var raw_token = localStorage.getItem('vt-token');
  if (raw_token === null || raw_token === "") {
    return "empty";
  }
  return raw_token;
}

export function authenticateUser(resp) {
  try{
  const {token, ...user} = resp;
  const userdata = JSON.stringify(user);
  localStorage.setItem("vt-token",token);
  localStorage.setItem("user", userdata);
  window.location.href="/dashboard";
  }
  catch(e){
    console.log("login error",e.message);
  }
}

export function getUserData() {
  var raw = localStorage.getItem("user") ??"";
  var user = JSON.parse(raw);
  return user;
}

export function isUserLoggedIn() {
  var user_data = localStorage.hasOwnProperty("vt-token");
  if (user_data !== false) {
    return true;
  } else {
    return false;
  }
}
export function Logout() {
  if(window.confirm("Are you sure you want to logout?")){
    localStorage.removeItem("vt-token");
    window.location.href = "/";
  }
}

//export const VT_BASE = "http://143.110.248.228:8080/api/v1";
export const VT_BASE = "http://localhost:8182/api/v1";