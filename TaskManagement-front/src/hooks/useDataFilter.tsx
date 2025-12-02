// src/hooks/useDataFilter.ts

import { useMemo } from 'react';
import { useAuth } from '../contexts/authContext'; 

interface userAssugned {
  assigned_user?: {
    _id: string; 
    first_name: string;
    last_name: string;
  };
  [key: string]: any; 
}

type SearchMapper<T> = (item: T) => string;

export const useDataFilter = <T extends userAssugned>(
  data: T[], //elementos a filtrar 
  searchText: string, //texto de búsqueda
  searchMapper: SearchMapper<T> //Una función que mapea el objeto T a una cadena de busqueda
): T[] => {
  
  const { user } = useAuth();
  

  const isAdmin = user?.role?.is_admin;
  const currentUserId = user?._id;

  const lowerSearchText = searchText.toLowerCase().trim();

  const filteredData = useMemo(() => {
    return data.filter(item => {

      if (isAdmin && currentUserId) {
        if (item.assigned_user?._id !== currentUserId) {
          return false;
        }
      }
       if (!searchText && !user?.role.is_admin) return true;
    
      if (!lowerSearchText) return true;

      const searchTerms = searchMapper(item).toLowerCase(); 

      return searchTerms.includes(lowerSearchText);
    });
  }, [data, lowerSearchText, currentUserId, isAdmin, searchMapper]);
  
  return filteredData;
};