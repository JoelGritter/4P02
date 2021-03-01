import Auth from "@aws-amplify/auth";

export function logout(): Promise<any> {
  localStorage.removeItem("jwtToken");
  return Auth.signOut();
}

export function getToken() {
  return localStorage.getItem("jwtToken");
}
