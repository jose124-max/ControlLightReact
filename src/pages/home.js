import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import 'antd/dist/reset.css';
import './Home.css';
import engranepng from '../static/engranaje.png';
import { fetchData, toggleLuces } from '../api';
import ConfigForm from './configForm';
import RegistrosTable from './registros';
import RoundButton from '../componentns/RoundButton';
import ControlDeTemperatura from '../componentns/ControlTemperatura';

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
  const [lucesOn, setLucesOn] = useState(false);
  const [refreshRegistros, setRefreshRegistros] = useState(false); // Estado para forzar la recarga

  useEffect(() => {
    getData();
    const intervalId = setInterval(() => {
      getData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getData = async () => {
    try {
      const response = await fetchData();
      const [data] = response;
      setLucesOn(data.luces);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRoundButtonClick = async () => {
    try {
      await toggleLuces();
      const response = await fetchData();
      const [data] = response;
      setLucesOn(data.luces);
    } catch (error) {
      console.error('Error toggling lights:', error);
    }
  };

  const showConfigModal = () => {
    setIsModalVisible(true);
  };

  const showRecordsModal = () => {
    setRefreshRegistros(prev => !prev); // Toggle to refresh
    setIsRecordsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    getData();
  };

  const handleRecordsCancel = () => {
    setIsRecordsModalVisible(false);
  };

  return (
    <>
      <div className="title">
        <h1>Control de iluminación</h1>
        <Button onClick={showRecordsModal}>Ver registros</Button><br />
      </div>
      <div className="container">
        <div className="box" style={{ width: '50%' }}>
          <RoundButton isChecked={lucesOn} onClick={handleRoundButtonClick} />
        </div>

        <div style={{ width: '50%' }}>
          <ControlDeTemperatura />
        </div>
        <div className="box">
          <div className="modal-button">
            <img
              src={engranepng}
              alt="Open Modal"
              onClick={showConfigModal}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Modal de configuración */}
        <Modal
          title="Configuración"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <ConfigForm />
        </Modal>

        {/* Modal de Registros */}
        <Modal
          title="Registros"
          visible={isRecordsModalVisible}
          onCancel={handleRecordsCancel}
          footer={null}
          width={1000}
        >
          <RegistrosTable refreshData={refreshRegistros} /> {/* Pasa la función de actualización */}
        </Modal>
      </div>
    </>
  );
};

export default Home;
