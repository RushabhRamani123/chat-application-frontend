import io from "socket.io-client"; 
let socket;
const connectSocket = (user_id) => {
    socket = io("http://localhost:3000",{transports: ['polling', 'websocket'], 
        query: `user_id=${user_id}`,
        header: {}
  });
socket.on("connect_error", (err) => {
// console.log(err.req);
});
socket.on("connect", () => {
  // console.log("Connected to server");
})
} 
export {socket, connectSocket};