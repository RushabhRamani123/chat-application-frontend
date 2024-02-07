import io from "socket.io-client"; 
// const user= window.localStorage.getItem("user")._id;
let socket;
socket = io("http://localhost:3000", {  headers: {} });
export {socket};