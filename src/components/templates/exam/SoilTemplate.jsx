import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'react-modal';
import { getCropNames, getSoilExamData, getSoilFertilizerInfo } from "../../../apis/predict";
import { useLoading } from "../../../LoadingContext"; // 로딩 훅 임포트
import CustomModal from '../../atoms/CustomModal'; // CustomModal 컴포넌트 임포트

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  min-height: 50vh;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  width: 100%;
  max-width: 600px;
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 24px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  margin-bottom: 16px;
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 12px;
  }
`;

const Select = styled.select`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  font-size: 16px;
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const CropList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1;
  top: 40px;
  max-height: 200px;
  overflow-y: auto;
`;

const CropItem = styled.div`
  padding: 8px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
`;

const RecommendationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 24px;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 12px;
    margin-top: 16px;
  }
`;

const RecommendationTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* iOS 스크롤 부드럽게 */
  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 16px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #f1f1f1;
  width: 150px;
  @media (max-width: 768px) {
    padding: 6px;
    font-size: 14px;
  }
`;

const TableData = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  width: 150px;
  @media (max-width: 768px) {
    padding: 6px;
    font-size: 14px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  width: 100%;
  margin-top: 16px;
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const ExternalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-top: 16px;
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    zIndex: 1102, // Ensure modal is above other elements
  },
  overlay: {
    zIndex: 1101, // Ensure overlay is above other elements
  }
};

Modal.setAppElement('#root');

const SoilTemplate = () => {
  const { setIsLoading } = useLoading(); // 로딩 훅 사용
  const [cropName, setCropName] = useState('');
  const [address, setAddress] = useState('');
  const [soilData, setSoilData] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [fertilizerData, setFertilizerData] = useState(null);
  const [cropNames, setCropNames] = useState([]);
  const [filteredCropNames, setFilteredCropNames] = useState([]);
  const [showCropList, setShowCropList] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSoilSample, setSelectedSoilSample] = useState(null);
  const [isFetching, setIsFetching] = useState(false); // 상태 추가
  const [analysisDone, setAnalysisDone] = useState(false); // 분석 완료 상태 추가
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // 에러 모달 상태 추가
  const navigate = useNavigate(); // 네비게이트 추가

  const inputRef = useRef(null);

  const handleCropNameChange = (e) => {
    const value = e.target.value;
    setCropName(value);
    setFilteredCropNames(cropNames.filter(crop => crop.toLowerCase().includes(value.toLowerCase())));
    setShowCropList(true);
  };

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleSampleChange = (e) => {
    setSelectedSample(e.target.value);
    setSelectedSoilSample(soilData.find(sample => sample.No === e.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCropNames();
        setCropNames(response.data.crop_names);
        setFilteredCropNames(response.data.crop_names);
      } catch (err) {
        setError('작물 이름을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, []);

  const fetchSoilExamData = async () => {
    try {
      if (!cropNames.includes(cropName)) {
        setError('작물이름과 주소를 정확히 입력해 주세요.');
        setErrorModalIsOpen(true); // 에러 모달 오픈
        return;
      }

      setIsLoading(true); // 로딩 시작
      const response = await getSoilExamData(cropName, address);
      if (response.data.soil_data.length === 0) {
        setError('현재 주소에 해당하는 데이터가 없습니다.');
        setErrorModalIsOpen(true); // 에러 모달 오픈
        setSoilData([]);
        setSelectedSample(null);
        setFertilizerData(null);
        setSelectedSoilSample(null);
        setModalIsOpen(false);
        return;
      }
      setSoilData(response.data.soil_data);
      setSelectedSample(null);
      setFertilizerData(null);
      setSelectedSoilSample(null);
      setError(null);
      setModalIsOpen(true);
    } catch (err) {
      setError('작물이름과 주소를 정확히 입력해 주세요.');
      setErrorModalIsOpen(true); // 에러 모달 오픈
      setSoilData([]);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const fetchFertilizerData = async () => {
    if (!selectedSample) {
      setError('먼저 토양 샘플을 선택하세요.');
      setErrorModalIsOpen(true); // 에러 모달 오픈
      return;
    }

    if (isFetching) {
      return; // 이미 fetching 중이라면 아무것도 하지 않음
    }

    setIsFetching(true); // 비활성화 시작

    const latestSoilSample = soilData.find(sample => sample.No === selectedSample);
    const sanitizedSample = {
      ...latestSoilSample,
      ACID: latestSoilSample.ACID ?? 0,
      OM: latestSoilSample.OM ?? 0,
      VLDPHA: latestSoilSample.VLDPHA ?? 0,
      POSIFERT_K: latestSoilSample.POSIFERT_K ?? 0,
      POSIFERT_CA: latestSoilSample.POSIFERT_CA ?? 0,
      POSIFERT_MG: latestSoilSample.POSIFERT_MG ?? 0,
      VLDSIA: latestSoilSample.VLDSIA ?? 0,
      SELC: latestSoilSample.SELC ?? 0
    };

    try {
      setIsLoading(true); // 로딩 시작
      const response = await getSoilFertilizerInfo({
        crop_code: cropName,
        address: address,
        acid: sanitizedSample.ACID,
        om: sanitizedSample.OM,
        vldpha: sanitizedSample.VLDPHA,
        posifert_K: sanitizedSample.POSIFERT_K,
        posifert_Ca: sanitizedSample.POSIFERT_CA,
        posifert_Mg: sanitizedSample.POSIFERT_MG,
        vldsia: sanitizedSample.VLDSIA,
        selc: sanitizedSample.SELC,
        PNU_Nm: sanitizedSample.PNU_Nm
      });
      setFertilizerData(response.data.data);
      setSelectedSoilSample(sanitizedSample);
      setError(null);
      setModalIsOpen(false);
      setAnalysisDone(true); // 분석 완료 상태 설정
    } catch (err) {
      setError(err.response.data.error);
      setErrorModalIsOpen(true); // 에러 모달 오픈
      setFertilizerData(null);
    } finally {
      setIsLoading(false); // 로딩 끝
      setIsFetching(false); // 비활성화 종료
    }
  };

  const handleCropNameClick = () => {
    setShowCropList(true);
  };

  const handleCropSelect = (crop) => {
    setCropName(crop);
    setShowCropList(false);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowCropList(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeErrorModal = () => {
    setErrorModalIsOpen(false);
  };

  const formatValue = (value) => {
    const num = Number(value);
    return num < 1 ? `${num}` : num.toString();
  };

  const handleBackToList = () => {
    navigate('/soillist');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchSoilExamData();
    }
  };

  const handleModalKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchFertilizerData();
    }
  };

  return (
    <Container>
      <BoxContainer>
        <Title>토양 분석</Title>
        <InputContainer ref={inputRef}>
          <Input
            type="text"
            value={cropName}
            onChange={handleCropNameChange}
            onClick={handleCropNameClick}
            onKeyDown={handleKeyDown}
            placeholder="작물 이름"
          />
          {showCropList && filteredCropNames.length > 0 && (
            <CropList>
              {filteredCropNames.map((crop, index) => (
                <CropItem key={index} onClick={() => handleCropSelect(crop)}>
                  {crop}
                </CropItem>
              ))}
            </CropList>
          )}
        </InputContainer>
        <InputContainer>
          <Input
            type="text"
            value={address}
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            placeholder="예) 광주광역시 수완동"
          />
        </InputContainer>
        <Button onClick={fetchSoilExamData}>주소 검색</Button>
      </BoxContainer>
      {!analysisDone && (
        <ExternalButtonContainer>
          <Button onClick={handleBackToList}>목록보기</Button>
        </ExternalButtonContainer>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Soil Samples Modal"
      >
        <ModalContent>
          <h2>상세 주소</h2>
          <Select onChange={handleSampleChange} onKeyDown={handleModalKeyDown}>
            <option value="">선택</option>
            {soilData.map(sample => (
              <option key={sample.No} value={sample.No}>
                {sample.PNU_Nm}
              </option>
            ))}
          </Select>
          <ButtonContainer>
            <Button onClick={fetchFertilizerData} disabled={isFetching || !selectedSample}>분석하기</Button>
            <Button onClick={closeModal}>닫기</Button>
          </ButtonContainer>
        </ModalContent>
      </Modal>
      <CustomModal
        isOpen={errorModalIsOpen}
        onRequestClose={closeErrorModal}
        title="오류"
        content={error}
        onConfirm={closeErrorModal}
        showConfirmButton={false}
        isError={true}
        overlayStyles={{ zIndex: 1103 }} // Ensure overlay is above other elements
        contentStyles={{ zIndex: 1104 }} // Ensure modal content is above other elements
      />
      {selectedSoilSample && fertilizerData && (
        <RecommendationContainer>
          <RecommendationTitle>상세주소 : {selectedSoilSample.PNU_Nm}</RecommendationTitle>
          <RecommendationTitle>토양 분석 데이터</RecommendationTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>항목</TableHeader>
                  <TableHeader>값</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>산도(ACID)</TableData>
                  <TableData>{formatValue(selectedSoilSample.ACID)} (pH)</TableData>
                </tr>
                <tr>
                  <TableData>유기물(OM)</TableData>
                  <TableData>{formatValue(selectedSoilSample.OM)} (g/kg)</TableData>
                </tr>
                <tr>
                  <TableData>인산(VLDPHA)</TableData>
                  <TableData>{formatValue(selectedSoilSample.VLDPHA)} (mg/kg)</TableData>
                </tr>
                <tr>
                  <TableData>칼륨(K)</TableData>
                  <TableData>{formatValue(selectedSoilSample.POSIFERT_K)} (cmol+/kg)</TableData>
                </tr>
                <tr>
                  <TableData>칼슘(Ca)</TableData>
                  <TableData>{formatValue(selectedSoilSample.POSIFERT_CA)} (cmol+/kg)</TableData>
                </tr>
                <tr>
                  <TableData>마그네슘(Mg)</TableData>
                  <TableData>{formatValue(selectedSoilSample.POSIFERT_MG)} (cmol+/kg)</TableData>
                </tr>
                <tr>
                  <TableData>규산(VLDSIA)</TableData>
                  <TableData>{formatValue(selectedSoilSample.VLDSIA)} (mg/kg)</TableData>
                </tr>
                <tr>
                  <TableData>전기전도도(SELC)</TableData>
                  <TableData>{formatValue(selectedSoilSample.SELC)} (dS/m)</TableData>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
          <RecommendationTitle>비료 처방량</RecommendationTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>항목</TableHeader>
                  <TableHeader>값</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>밑거름_질소 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Fert_N} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>밑거름_인산 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Fert_P} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>밑거름_칼리 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Fert_K} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>웃거름_질소 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.post_Fert_N} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>웃거름_인산 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.post_Fert_P} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>웃거름_칼리 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.post_Fert_K} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>우분퇴비 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Cattl} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>돈분퇴비 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Pig} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>계분퇴비 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Chick} (kg/10a)</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>혼합퇴비 처방량</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Mix}(kg/10a)</TableData>
                  ))}
                </tr>
              </tbody>
            </Table>
          </TableContainer>
          <ButtonContainer>
            <Button onClick={handleBackToList}>목록보기</Button>
          </ButtonContainer>
        </RecommendationContainer>
      )}
    </Container>
  );
};

export default SoilTemplate;
