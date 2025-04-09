import React from 'react';

const Recommendations = ({ data }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Recommended Assessments</h2>
      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>URL</th>
            <th>Remote Support</th>
            <th>Description</th>
            <th>Adaptive Support</th>
            <th>Duration (min)</th>
            <th>Test Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              <td>{item.remote_support === 'Yes' ? 'Yes' : 'No'}</td>
              <td>{item.description || 'N/A'}</td>
              <td>{item.adaptive_support === 'Yes' ? 'Yes' : 'No'}</td>
              <td>{item.duration || 'N/A'}</td>
              <td>
                {Array.isArray(item.test_type)
                  ? item.test_type.join(', ')
                  : item.test_type || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
