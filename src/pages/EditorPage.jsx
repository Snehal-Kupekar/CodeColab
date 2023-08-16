
import { useEffect, useRef, useState } from 'react';
import logoImg from './Images/CodeEdit.png'
import Client from '../components/Client';
import Editor from '../components/Editor';

import './styles/Editor.css'
import initSocket from '../socket';
import { ACTIONS } from '../Action';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditorPage = () => {

    const socketRef = useRef(null);
    const codeRef = useRef();
    const location = useLocation();
    const reactNavigate = useNavigate();
    const [clients, setClients] = useState([]);
    // {
    //     socketId :1 ,
    //     username: 'John Doe' 
    // } ,


    const params = useParams();
    //roomId we get from router that is App.jsx 
    const roomId = params.roomId
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (error) => handleErrors(error));
            socketRef.current.on('connect_failed', (error) => handleErrors(error));

            const handleErrors = (e) => {
                console.log("socket error", e);
                toast.error("Socket connecting error , try after some time!");
                reactNavigate('/')

            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            

            //listening to joined event which is triggered from server side 
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    // Check if the received username is different from the current user's username
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room!`);
                        console.log(`${username} joined the room!`);
                    }

                    // Update the clients state with the received clients array
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE , {
                        code : codeRef.current,
                        socketId
                    })
                }); 


            //listening for disconnected event

            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (clients) => clients.socketId !== socketId
                            //returns remaining ARRAY except that client who left the room having socketID
                        );
                    })
                }
            )



        };

        init();

        //clear memory by closing listened events
        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.disconnect();
            }
        }
    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room Id has been copied!')
        }
        catch (err) {
            toast.error('Could not copy Room Id');
            console.log('Error', err);
        }
    }

    const leaveRoom = () => {
        reactNavigate('/');
    }

    if (!location.state) {
        <Navigate to="/" />
    }

    return (
        <>
            <div className="mainPageWrap">
                <div className="aside">
                    <div className="asideInner">
                        <div className="logo">
                            <img src={logoImg} className='logoImg' alt='logo'></img>
                        </div>
                        <h4>Connected</h4>
                        <div className='clientsList'>
                            {clients.map((client) => (
                                <Client key={client.socketId} username={client.username} />
                            ))}
                        </div>
                    </div>
                    <button className='btn copyBtn' onClick={copyRoomId}>Copy Room Id</button>
                    <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
                </div>
                <div className="editor">
                    <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code }} />
                </div>
            </div>
        </>
    )
}

export default EditorPage;