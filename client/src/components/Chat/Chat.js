import React, {useEffect, useState} from "react";
import "./Chat.css";
import queryString from "query-string";
import io from "socket.io-client";
import Infobar from "../Infobar/Infobar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;

const Chat = () => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [usersInfo, setUsersInfo] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const {name, room} = queryString.parse(window.location.search);

    // console.log(window.location);
    console.log(name);
    // console.log(room);
    setName(name);
    setRoom(room);

    socket = io(ENDPOINT);
    console.log(socket);
    socket.emit("join", {name, room}, () => {});

    return () => {
      // socket.emit("disconnect");
      socket.off();
    };

    // console.log(socket);
  }, [window.location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({users}) => {
      setUsersInfo(users);
    });
  }, [messages]);
  console.log(usersInfo);

  //function to send message

  function sendMessage(e) {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  }

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <Infobar room={room} />
        <Messages name={name} messages={messages} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={usersInfo} />
    </div>
  );
};

export default Chat;
