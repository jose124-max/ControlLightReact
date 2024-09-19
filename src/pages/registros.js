import React, { useState, useEffect } from 'react';
import { Table, Spin, message, Tag } from 'antd';
import { fetchRegistros } from '../api';
import moment from 'moment';

const RegistrosTable = ({ refreshData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const registros = await fetchRegistros();
        
        const formattedData = registros.map((registro) => ({
          key: registro.id,
          id: registro.id,
          fecha: moment(registro.fechahora).format('YYYY-MM-DD'),
          hora: moment(registro.fechahora).format('HH:mm'),
          dispositivo: registro.dispositivo.nombre,
          accion: registro.accion ? 'Encendido' : 'Apagado',
          tipodeact: registro.tipodeact,
        })).sort((a, b) => b.id - a.id); // Ordenar por ID descendente

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        message.error('Error al obtener los registros');
        setLoading(false);
      }
    };

    getData();
  }, [refreshData]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      sorter: (a, b) => moment(b.fecha).unix() - moment(a.fecha).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Hora',
      dataIndex: 'hora',
      key: 'hora',
    },
    {
      title: 'Dispositivo',
      dataIndex: 'dispositivo',
      key: 'dispositivo',
    },
    {
      title: 'Acción',
      dataIndex: 'accion',
      key: 'accion',
      render: (accion) => (
        <Tag color={accion === 'Encendido' ? 'green' : 'red'}>
          {accion}
        </Tag>
      ),
      filters: [
        { text: 'Encendido', value: 'Encendido' },
        { text: 'Apagado', value: 'Apagado' },
      ],
      onFilter: (value, record) => record.accion === value,
    },
    {
      title: 'Tipo de Actividad',
      dataIndex: 'tipodeact',
      key: 'tipodeact',
      render: (tipodeact) => (
        <Tag color={tipodeact === 'automatico' ? 'blue' : 'orange'}>
          {tipodeact}
        </Tag>
      ),
      filters: [
        { text: 'Automático', value: 'automatico' },
        { text: 'Manual', value: 'manual' },
      ],
      onFilter: (value, record) => record.tipodeact === value,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />
    </Spin>
  );
};

export default RegistrosTable;
