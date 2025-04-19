import { ApiResponse } from '@/types/job';

const BASE_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';

export const fetchJobs = async (page: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(BASE_URL);
    
    if (!response.ok) {
      throw new Error(`Error fetching jobs: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    throw error;
  }
};