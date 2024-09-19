import React, { useState, useEffect } from 'react';
import { Form, Switch, InputNumber, Button, notification, Input, Tag } from 'antd';
import { fetchData, updateData, fetchSolOn, postSolOn, fetchSolOff, postSolOff } from '../api';

const ConfigForm = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [solOn, setSolOn] = useState(false);
  const [solOff, setSolOff] = useState(false); // Estado para solOff
  const [loading, setLoading] = useState(true);
  const [checkingSolOn, setCheckingSolOn] = useState(true);
  const [checkingSolOff, setCheckingSolOff] = useState(true); // Estado para manejar la verificación de solOff

  useEffect(() => {
    getData();
  }, [form]);

  const getData = async () => {
    try {
      const response = await fetchData('/controls/configuraciones/');
      const [config] = response;
      setData(config);
      form.setFieldsValue(config);

      const solOnResponse = await fetchSolOn();
      setSolOn(solOnResponse);

      const solOffResponse = await fetchSolOff(); // Fetch solOff status
      setSolOff(solOffResponse);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (checkingSolOn) {
      interval = setInterval(async () => {
        try {
          const solOnResponse = await fetchSolOn();
          if (!solOnResponse) {
            setSolOn(solOnResponse);
            setCheckingSolOn(false);
            getData();
            clearInterval(interval);
            ableInputOne();
          }
        } catch (error) {
          console.error('Error fetching solOn status:', error);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [checkingSolOn]);

  useEffect(() => {
    let interval;
    if (checkingSolOff) { // Similar a checkingSolOn, pero para solOff
      interval = setInterval(async () => {
        try {
          const solOffResponse = await fetchSolOff();
          if (!solOffResponse) {
            setSolOff(solOffResponse);
            setCheckingSolOff(false);
            getData();
            clearInterval(interval);
            ableInputTwo();
          }
        } catch (error) {
          console.error('Error fetching solOff status:', error);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [checkingSolOff]);

  const onFinish = async (values) => {
    try {
      if (data && data.id) {
        const result = await updateData(data.id, values);
        notification.success({
          message: 'Configuración actualizada',
          description: 'La configuración se actualizó con éxito.',
        });
      } else {
        console.error('No data or ID found');
      }
    } catch (error) {
      notification.error({
        message: 'Error al actualizar',
        description: 'Ocurrió un error al intentar actualizar la configuración.',
      });
    }
  };

  const handlePostSolOn = async () => {
    try {
      await postSolOn();
      notification.success({
        message: 'Código de encendido enviado',
        description: 'El código de encendido fue enviado con éxito al dispositivo.',
      });
      disableInputOne();
      setSolOn(true);
      setCheckingSolOn(true);
    } catch (error) {
      notification.error({
        message: 'Error al enviar código',
        description: 'Ocurrió un error al intentar enviar el código de encendido.',
      });
    }
  };

  const handlePostSolOff = async () => {
    try {
      await postSolOff();
      notification.success({
        message: 'Código de apagado enviado',
        description: 'El código de apagado fue enviado con éxito al dispositivo.',
      });
      disableInputTwo();
      setSolOff(true);
      setCheckingSolOff(true);
    } catch (error) {
      notification.error({
        message: 'Error al enviar código',
        description: 'Ocurrió un error al intentar enviar el código de apagado.',
      });
    }
  };

  function disableInputOne() {
    document.getElementById("onid").disabled = true;
  }

  function ableInputOne() {
    document.getElementById("onid").disabled = false;
  }

  function disableInputTwo() {
    document.getElementById("offid").disabled = true;
  }

  function ableInputTwo() {
    document.getElementById("offid").disabled = false;
  }

  

  if (loading) return <p>Loading...</p>;
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={data}
    >
      <Form.Item
        label="Luces"
        name="luces"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Aire"
        name="aire"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Luces Automáticas"
        name="lucesauto"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Aire Automático"
        name="aireauto"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Tiempo de Movimiento ON (segundos)"
        name="tmmovON"
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label="Tiempo de Movimiento OFF (segundos)"
        name="tmmovOFF"
      >
        <InputNumber min={0} />
      </Form.Item>


      <Form.Item
        label="Configurar camara para detectar movimiento"
        name="urlcamara"
      >
        <Input maxLength={150} />
      </Form.Item>
      <br />
      <h2>Configuración de control de Aire acondicionado</h2>
      <line></line>
      <br />

      <Form.Item
        label="Temperatura  mínima de encendido"
        name="tempminima"
      >
        <InputNumber min={-50} step={0.1} />
      </Form.Item>

      <label>Configurar código de encendido</label>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Form.Item
            name="codonair"
          >
            <Input maxLength={100} id='onid' />
          </Form.Item>
        </div>
        <div style={{ width: '50%', marginLeft: '5%' }}>
          {!solOn ? (
            <Form.Item>
              <Button type="dashed" onClick={handlePostSolOn}>
                Detectar código de encendido
              </Button>
            </Form.Item>
          ) : (
            <Tag color="green">Esperando código del dispositivo</Tag>
          )}
        </div>
      </div>
      <label>Configurar código de apagado</label>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Form.Item
            name="codoffair"
          >
            <Input maxLength={100} id='offid' />
          </Form.Item>
        </div>
        <div style={{ width: '50%', marginLeft: '5%' }}>
          {!solOff ? (
            <Form.Item>
              <Button type="dashed" onClick={handlePostSolOff}>
                Detectar código de apagado
              </Button>
            </Form.Item>
          ) : (
            <Tag color="red">Esperando código de apagado del dispositivo</Tag>
          )}
        </div>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConfigForm;