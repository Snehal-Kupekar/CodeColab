import { Avatar } from "@mui/material";



function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = ['FF69B4', '0000FF', '800080' ,'ED0A3F' , '50BFE6' ,'2243B6','299617' ,'01786F','DA2647']; // Bright shade color codes (red, pink, blue, purple)


  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  const color = '#' + colors[index];


  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize : "15px"
    },
    children: `${name?.split(' ')[0]?.[0] || ''}${name?.split(' ')[1]?.[0] || ''}`,
  };
}



const Client = ({username}) => {

  return (
    <div className="client">
        <Avatar {...stringAvatar(`${username}`) }/>
        <span className="username">{username}</span>

    </div>
  )
}

export default Client;