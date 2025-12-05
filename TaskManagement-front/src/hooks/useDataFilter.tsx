// src/hooks/useDataFilter.ts

import { useMemo } from 'react';
import { useAuth } from '../contexts/authContext'; 

interface userAssigned {
  assigned_user?: {
    _id: string; 
    first_name: string;
    last_name: string;
    team?: string;
  },
  assigned_team?: {
    _id: string;
    idTeam: string
    name: string
    };
  [key: string]: any; 
}

type SearchMapper<T> = (item: T) => string;

export const useDataFilter = <T extends userAssigned>(
  data: T[], //elementos a filtrar 
  searchText: string, //texto de búsqueda
  searchMapper: SearchMapper<T> //Una función que mapea el objeto T a una cadena de busqueda
): T[] => {
  
  const { user } = useAuth();
  

  const isAdmin = user?.role?.is_admin; //el valor está invertido
  const isLeader = user?.is_leader || false;
  const currentUserId = user?._id;
  const currentUserTeamId = user?.team;

  const lowerSearchText = searchText.toLowerCase().trim();

  const filteredData = useMemo(() => {
    return data.filter(item => {

      if (isAdmin && currentUserId) {
        //Valido que sea lider y no admin
        if (isLeader && item.assigned_team?._id === currentUserTeamId) {
          return true;
        }
        //Si no es admin, tampoco es admin, es usuario normal
        if (item.assigned_user?._id !== currentUserId) {
          return false;
        }
      }
      //para los admin 
       if (!searchText && !user?.role.is_admin) return true;
    
      if (!lowerSearchText) return true;

      const searchTerms = searchMapper(item).toLowerCase(); 

      return searchTerms.includes(lowerSearchText);
    });
  }, [data, lowerSearchText, currentUserId, isAdmin, searchMapper]);
  
  return filteredData;
};