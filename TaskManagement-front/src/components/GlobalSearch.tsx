import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface GlobalSearchProps {
  // Función que el padre debe implementar para manejar el texto de búsqueda
  onSearch: (searchText: string) => void;
  placeholder?: string;
  loading?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  onSearch, 
  placeholder = "Buscar...", 
  loading = false 
}) => {
  return (
    <Input.Search
      placeholder={placeholder}
      enterButton={<SearchOutlined/>}
      size="large"
      loading={loading}
      onSearch={onSearch} 
      // Para buscar mientras se escribe (ejecutar en onChange)
      // onChange={(e) => onSearch(e.target.value)} 
      style={{ width: 300 }}
    />
  );
};

export default GlobalSearch;