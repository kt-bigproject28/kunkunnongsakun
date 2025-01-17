import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(2, 1fr);
`;

const MenuCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  text-decoration: none;
  text-align: center;
  color: #333;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 120px; 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  h2 {
    margin: 0;
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    color: #4aaa87;
  }

  p {
    margin: 0.5rem 0 0;
    font-size: clamp(0.8rem, 3vw, 1rem);
    color: #666;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled(Link)`
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: #333;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  h2 {
    margin: 0;
    font-size: clamp(1rem, 3vw, 1.2rem);
    color: #4aaa87;
  }

  p {
    margin: 0.5rem 0 0;
    font-size: clamp(0.5rem, 2.5vw, 0.9rem);
    color: #666;
  }
`;

const MainTemplate = () => {
  return (
    <Container>
      <GridContainer>
        <MenuCard to="/diagnosislist">
          <h2>병해충 진단</h2>
          <p>
            작물 이미지로<br/>
            병해충 진단
          </p>
        </MenuCard>
        <MenuCard to="/cropselection">
          <h2>수익 예측</h2>
          <p>작물 수익<br/>미리 계산해보기</p>
        </MenuCard>
        <MenuCard to="/chatlist">
          <h2>농업 GPT</h2>
          <p>농업 전문 챗봇</p>
        </MenuCard>
        <MenuCard to="/soillist">
          <h2>토양 분석</h2>
          <p>적합한 비료 추천</p>
        </MenuCard>
      </GridContainer>
      <ListContainer>
        <ListItem to="/mypage">
          <h2>마이페이지</h2>
        </ListItem>
        <ListItem to="/board">
          <h2>게시판</h2>
        </ListItem>
      </ListContainer>
    </Container>
  );
};

export default MainTemplate;