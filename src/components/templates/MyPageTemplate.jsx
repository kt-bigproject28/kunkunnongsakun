// MyPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import ChangePasswordModal from "./ChangePasswordModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const UserInfo = styled.div`
  font-size: 18px;
  margin-bottom: 24px;
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 12px;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const MyPageTemplate = () => {
  const [username, setUsername] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/login/auth_check/", { withCredentials: true });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = () => {
    setIsPasswordModalOpen(true);
  };

  const handleAccountDeletion = () => {
    navigate("/delete_account");
  };

  const handleViewMyPosts = () => {
    navigate("/my_posts");
  };

  return (
    <Container>
      <Title>마이페이지</Title>
      <UserInfo>Username: {username}</UserInfo>
      <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
      <Button onClick={handleAccountDeletion}>회원 탈퇴</Button>
      <Button onClick={handleViewMyPosts}>내가 쓴 글</Button>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onRequestClose={() => setIsPasswordModalOpen(false)}
      />
    </Container>
  );
};

export default MyPageTemplate;