import {io} from 'socket.io-client';

  const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };

  // const socketURl = 'http://localhost:5000';
  const socketURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
  return io( socketURL, options);
};
// 
export default initSocket;