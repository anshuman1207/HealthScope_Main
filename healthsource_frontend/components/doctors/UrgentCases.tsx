import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assuming you have a type defined for the case data
interface UrgentCase {
  _id: string;
  reporter: { name: string; age: number; city: string }; // Assuming you populate the reporter
  title: string;
  description: string;
  riskScore: number;
  flags: string[];
  createdAt: string;
}

const UrgentCasesDashboard: React.FC = () => {
  const [cases, setCases] = useState<UrgentCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCases = async () => {
      const token = localStorage.getItem('x-auth-token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/api/doctors/urgent-cases', {
          headers: { 'x-auth-token': token },
        });
        setCases(response.data); // Update the state with the backend data
      } catch (error) {
        console.error('Error fetching urgent cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []); // Run only once when the component mounts

  // Show a loading state while fetching data
  if (loading) {
    return <div>Loading cases...</div>;
  }

  // Handle case where no reports are found
  if (cases.length === 0) {
    return <div>No urgent cases found.</div>;
  }
  
  // Return the dynamic JSX to render the cases
  return (
    <div>
      {cases.map((caseItem) => (
        <div key={caseItem._id}>
          {/* Dynamically render the user's name */}
          <h3>{caseItem.reporter.name}</h3>
          {/* Dynamically render the risk score and flags */}
          <p>Risk Score: {caseItem.riskScore}/100</p>
          <p>AI Flags:</p>
          <ul>
            {caseItem.flags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>
          {/* Add other details */}
          <p>Title: {caseItem.title}</p>
        </div>
      ))}
    </div>
  );
};

export default UrgentCasesDashboard;