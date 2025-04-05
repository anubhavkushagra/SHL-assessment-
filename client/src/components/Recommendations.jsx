import React from 'react';

const Recommendations = ({ data }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Recommended Assessments</h2>
      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th>Remote Support</th>
            <th>Adaptive IRT</th>
            <th>Duration</th>
            <th>Test Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              <td>{item.remote_support ? 'Yes' : 'No'}</td>
              <td>{item.adaptive_irt_support ? 'Yes' : 'No'}</td>
              <td>{item.duration}</td>
              <td>{item.test_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
