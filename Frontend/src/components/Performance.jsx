import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

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
            const res = await fetch(`${API_BASE_URL}/performance/${userIdForList}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const addReport = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/performance`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
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
        <div className="premium-container">
            <div className="header-section">
                <h2>Performance Reports</h2>
                <p>Track your efficiency and consistency metrics</p>
            </div>
            
            <div className="glass-card mb-20">
                <h3><span className="icon">📈</span> Add Performance Report</h3>
                <form onSubmit={addReport} className="premium-form">
                    <div className="input-group">
                        <input type="number" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} required className="premium-input" />
                    </div>
                    <div className="input-group">
                        <select value={reportType} onChange={e => setReportType(e.target.value)} required className="premium-input">
                            <option value="">Select Report Type</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <input type="number" step="0.01" placeholder="Completion Rate (%)" value={completionRate} onChange={e => setCompletionRate(e.target.value)} required className="premium-input" />
                    </div>
                    <div className="input-group">
                        <input type="number" step="0.01" placeholder="Consistency Score (0-10)" value={consistencyScore} onChange={e => setConsistencyScore(e.target.value)} required className="premium-input" />
                    </div>
                    <button type="submit" className="premium-button">Add Report</button>
                </form>
            </div>

            <div className="glass-card">
                <h3><span className="icon">🔍</span> View User Reports</h3>
                <div className="search-bar">
                    <input type="number" placeholder="Enter User ID to view reports" value={userIdForList} onChange={e => setUserIdForList(e.target.value)} className="premium-input search-input" />
                    <button onClick={fetchReports} className="premium-button secondary">Fetch Reports</button>
                </div>
                
                <div className="table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Report Type</th>
                                <th>Completion Rate</th>
                                <th>Consistency Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? reports.map((r, idx) => (
                                <tr key={idx}>
                                    <td>#{r.ReportID}</td>
                                    <td><span className={`badge ${r.ReportType?.toLowerCase()}`}>{r.ReportType}</span></td>
                                    <td>
                                        <div className="progress-cell">
                                            <span>{r.CompletionRate}%</span>
                                            <div className="progress-bar-bg">
                                                <div className="progress-bar-fill" style={{ width: `${Math.min(r.CompletionRate, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="score-cell">
                                            <span className="score-number">{r.ConsistencyScore}</span>
                                            <span className="score-max">/ 10</span>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="empty-state">No reports found for this user.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .premium-container {
                    padding: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: 'Inter', system-ui, sans-serif;
                    animation: fadeIn 0.6s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .header-section {
                    margin-bottom: 32px;
                    text-align: center;
                }

                .header-section h2 {
                    font-size: 36px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }

                .header-section p {
                    color: #64748b;
                    font-size: 16px;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .glass-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.1);
                }

                .mb-20 { margin-bottom: 32px; }

                .glass-card h3 {
                    display: flex;
                    align-items: center;
                    font-size: 22px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 24px;
                }

                .icon { margin-right: 12px; font-size: 28px; }

                .premium-form {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    align-items: end;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                }

                .premium-input {
                    background: #f8fafc;
                    border: 2px solid transparent;
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-size: 15px;
                    color: #334155;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .premium-input:focus {
                    background: white;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .premium-button {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .premium-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
                }

                .premium-button.secondary {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                }

                .premium-button.secondary:hover {
                    box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
                }

                .search-bar {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 28px;
                }

                .search-input { flex: 1; }

                .table-container {
                    overflow-x: auto;
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                }

                .premium-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .premium-table th {
                    background: #f8fafc;
                    padding: 16px 24px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-align: left;
                    border-bottom: 1px solid #e2e8f0;
                }

                .premium-table td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                    font-size: 15px;
                    vertical-align: middle;
                }

                .premium-table tr:last-child td { border-bottom: none; }
                .premium-table tr:hover td { background: #f8fafc; }

                .badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    display: inline-block;
                }

                .badge.weekly { background: #dbeafe; color: #1e40af; }
                .badge.monthly { background: #fae8ff; color: #86198f; }

                .progress-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .progress-bar-bg {
                    flex: 1;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #34d399 0%, #10b981 100%);
                    border-radius: 4px;
                    transition: width 1s ease-in-out;
                }

                .score-cell {
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                }

                .score-number {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                }

                .score-max {
                    font-size: 14px;
                    color: #94a3b8;
                }

                .empty-state {
                    text-align: center;
                    padding: 48px !important;
                    color: #94a3b8 !important;
                    font-size: 16px !important;
                }
            `}</style>
        </div>
    );
};

export default Performance;
