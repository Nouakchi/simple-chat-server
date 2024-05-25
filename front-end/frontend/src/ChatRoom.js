import React, { useState, useEffect, useRef } from 'react';

const ChatRoom = ({ roomName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const chatLogRef = useRef(null);
    const chatSocketRef = useRef(null);

    useEffect(() => {
        const chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);

        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        chatSocket.onclose = () => {
            console.error('Chat socket closed unexpectedly');
        };

        chatSocketRef.current = chatSocket;

        return () => {
            chatSocket.close();
        };
    }, [roomName]);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (message) {
            chatSocketRef.current.send(JSON.stringify({ 'message': message }));
            setMessage('');
        }
    };

    return (
        <div>
            <textarea
                id="chat-log"
                ref={chatLogRef}
                cols="100"
                rows="20"
                value={messages.join('\n')}
                readOnly
            /><br />
            <input
                id="chat-message-input"
                type="text"
                size="100"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
            /><br />
            <input
                id="chat-message-submit"
                type="button"
                value="Send"
                onClick={handleSendMessage}
            />
        </div>
    );
};

export default ChatRoom;
