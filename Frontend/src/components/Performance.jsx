import React, { useState } from 'react';

const ROOT_URL = 'http://localhost:3000';

const Performance = () => {
    const [userIdForList, setUserIdForList] = useState('');
    const [reports, setReports] = useState([]);
    
    const [userId, setUserId] = useState('');
    const [reportType, setReportType] = useState('');
    const [completionRate, setCompletionRate] = useState('');
    const [consistencyScore, setConsistencyScore] = useState('');

    const fetchReports = async () => {
        if (!userIdForList) return;
        try {
            const res = await fetch(`${ROOT_URL}/performance/${userIdForList}`);
            const data = await res.json();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const addReport = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${ROOT_URL}/performance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, reportType, completionRate, consistencyScore })
            });
            if (res.ok) {
                alert('Performance report created');
                setUserId('');
                setReportType('');
                setCompletionRate('');
                setConsistencyScore('');
                if (userIdForList === userId) fetchReports();
            } else {
                alert('Error creating report');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Performance Reports</h2>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Add Performance Report</h3>
                <form onSubmit={addReport} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="number" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} required />
                    <input type="text" placeholder="Report Type" value={reportType} onChange={e => setReportType(e.target.value)} required />
                    <input type="number" step="0.01" placeholder="Completion Rate" value={completionRate} onChange={e => setCompletionRate(e.target.value)} required />
                    <input type="number" step="0.01" placeholder="Consistency Score" value={consistencyScore} onChange={e => setConsistencyScore(e.target.value)} required />
                    <button type="submit">Add Report</button>
                </form>
            </div>

            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3>View User Reports</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input type="number" placeholder="User ID" value={userIdForList} onChange={e => setUserIdForList(e.target.value)} />
                    <button onClick={fetchReports}>Fetch</button>
                </div>
                
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc' }}>
                            <th>Report ID</th>
                            <th>Report Type</th>
                            <th>Completion Rate</th>
                            <th>Consistency Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? reports.map((r, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                <td>{r.ReportID}</td>
                                <td>{r.ReportType}</td>
                                <td>{r.CompletionRate}</td>
                                <td>{r.ConsistencyScore}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4">No reports found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Performance;
