import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from 'react-router-dom';
import { fetchChatHistory, sendChatMessage } from '../../apis/chat';
import userProfileImage from '../../images/user_icon.jpg'; // 상대 경로로 수정
import botProfileImage from '../../images/big_logo.png'; // 상대 경로로 수정

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #075e54;
  color: white;
  font-size: 20px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 12px;
  }
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  background-color: #E6F8E0;
  overflow-y: auto;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MessageContainer = styled.li`
  display: flex;
  align-items: flex-start; /* 프로필 이미지 위에 메시지 표시 */
  margin-bottom: 12px;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const Message = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 20px;
  background-color: ${({ isUser }) => (isUser ? '#F7FE2E' : 'white')};
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  margin-top: 8px; /* 메시지를 프로필 이미지 아래로 배치 */

  @media (max-width: 768px) {
    padding: 8px 10px;
  }
`;

const ProfileImage = styled.img`
  width: 50px; /* 프로필 이미지 크기를 증가 */
  height: 50px; /* 프로필 이미지 크기를 증가 */
  border-radius: 50%;
  margin-right: ${({ isUser }) => (isUser ? '0' : '10px')};
  margin-left: ${({ isUser }) => (isUser ? '10px' : '0')};

  @media (max-width: 768px) {
    width: 40px; /* 모바일 화면에서는 크기 조정 */
    height: 40px; /* 모바일 화면에서는 크기 조정 */
    margin-right: ${({ isUser }) => (isUser ? '0' : '6px')};
    margin-left: ${({ isUser }) => (isUser ? '6px' : '0')};
  }
`;

const InputBox = styled.form`
  display: flex;
  padding: 10px;
  background-color: #f0f0f0;
  border-top: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
  position: sticky;
  bottom: 0;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 8px;
  &:focus {
    outline: none;
    border-color: #4aaa87;
  }

  @media (max-width: 768px) {
    padding: 8px;
    margin-right: 4px;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const ChatPage = () => {
  const { sessionid } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(sessionid);

  const params = new URLSearchParams(location.search);
  const sessionName = params.get('session_name');
  const isLoggedIn = localStorage.getItem('userId') !== null;

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('sessionName', sessionName);
      const fetchHistory = async () => {
        try {
          const response = await fetchChatHistory(sessionId);
          const orderedMessages = response.data.flatMap(chat => [
            { isUser: true, text: chat.question, timestamp: chat.timestamp },
            { isUser: false, text: chat.answer, timestamp: chat.timestamp }
          ]);
          setMessages([{ isUser: false, text: '안녕하세요 무엇을 도와드릴까요?', timestamp: new Date().toISOString() }, ...orderedMessages]);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };

      fetchHistory();
    } else {
      setMessages([{ isUser: false, text: '안녕하세요 무엇을 도와드릴까요?', timestamp: new Date().toISOString() }]);
    }
  }, [sessionId, sessionName, isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = {
      isUser: true,
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, userMessage]);

    const messageData = {
      question: inputValue,
      session_id: sessionId,
      session_name: sessionName,
      user_id: isLoggedIn ? localStorage.getItem('userId') : null
    };

    try {
      const response = await sendChatMessage(messageData);
      const botMessage = {
        isUser: false,
        text: response.data.answer,
        timestamp: response.data.timestamp
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error during chat processing:', error);
      const errorMessage = {
        isUser: false,
        text: 'An error occurred. Please try again later.',
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, userMessage, errorMessage]);
    }
    setInputValue('');
  };

  return (
    <Container>
      <Header>{sessionName || '농업 GPT'}</Header>
      <ChatBox>
        <MessageList>
          {messages.map((msg, index) => (
            <MessageContainer key={index} isUser={msg.isUser}>
              {!msg.isUser && <ProfileImage src={botProfileImage} alt="Profile" />}
              <Message isUser={msg.isUser}>
                {msg.text}
                <br />
                <small>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </Message>
              {msg.isUser && <ProfileImage src={userProfileImage} alt="Profile" isUser />}
            </MessageContainer>
          ))}
        </MessageList>
      </ChatBox>
      <InputBox onSubmit={handleSubmit}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="질문을 입력하세요"
          required
        />
        <Button type="submit">전송</Button>
      </InputBox>
    </Container>
  );
};

export default ChatPage;