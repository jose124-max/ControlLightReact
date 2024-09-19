const API_URL = process.env.REACT_APP_API_URL;

export const fetchData = async () => {
  const response = await fetch(`${API_URL}/controls/configuraciones/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchRegistros = async () => {
  const response = await fetch(`${API_URL}/controls/registros/`);
  if (!response.ok) {
    throw new Error('Failed to fetch registros');
  }
  return response.json();
};



export const toggleLuces = async () => {
  const response = await fetch(`${API_URL}/controls/onofflights/`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateData = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/controls/configuraciones/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update data');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

export const fetchTempStatus = async () => {
  const response = await fetch(`${API_URL}/controls/temp-status/`);
  if (!response.ok) {
    throw new Error('Failed to fetch temperature status');
  }
  return response.json();
};

export const fetchSolOn = async () => {
  const response = await fetch(`${API_URL}/controls/getsolon/`);
  if (!response.ok) {
    throw new Error('Failed to fetch sol on');
  }
  return response.json();
};

export const postSolOn = async () => {
  const response = await fetch(`${API_URL}/controls/solcodon/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to post sol on');
  }
  return response.json();
};

export const fetchSolOff = async () => {
  const response = await fetch(`${API_URL}/controls/getsoloff/`);
  if (!response.ok) {
    throw new Error('Failed to fetch sol off');
  }
  return response.json();
};

export const postSolOff = async () => {
  const response = await fetch(`${API_URL}/controls/solcodoff/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to post sol off');
  }
  return response.json();
};


export const toggleAire = async () => {
  const response = await fetch(`${API_URL}/controls/onoffAir/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to toggle air conditioning');
  }
  return response.json();
};

export const fetchAirStatus = async () => {
  const response = await fetch(`${API_URL}/controls/air-status/`);
  if (!response.ok) {
    throw new Error('Failed to fetch air status');
  }
  return response.json();
};