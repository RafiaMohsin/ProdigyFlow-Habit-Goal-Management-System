import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const UserAchievements = () => {
    // User achievements state
    const [userIdForList, setUserIdForList] = useState('');
    const [userAchievements, setUserAchievements] = useState([]);
    
    // Award achievement state
    const [awardUserId, setAwardUserId] = useState('');
    const [awardAchievementId, setAwardAchievementId] = useState('');

    const fetchUserAchievements = async () => {
        if (!userIdForList) return;
        try {
            const res = await fetch(`${API_BASE_URL}/user-achievements/${userIdForList}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setUserAchievements(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const awardBadge = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/user-achievements/award`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId: awardUserId, achievementId: awardAchievementId })
            });
            if (res.ok) {
                alert('Achievement awarded successfully!');
                setAwardUserId('');
                setAwardAchievementId('');
                if (userIdForList === awardUserId) fetchUserAchievements();
            } else {
                const errorText = await res.text();
                alert('Error awarding achievement: ' + errorText);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="premium-container">
            <div className="header-section">
                <h2>User Achievements Management</h2>
                <p>Award and track user milestones and badges</p>
            </div>
            
            <div className="management-layout">
                <div className="glass-card award-section">
                    <h3><span className="icon">🏅</span> Award Badge</h3>
                    <form onSubmit={awardBadge} className="premium-form">
                        <div className="input-group">
                            <input type="number" placeholder="User ID" value={awardUserId} onChange={e => setAwardUserId(e.target.value)} required className="premium-input" />
                        </div>
                        <div className="input-group">
                            <input type="number" placeholder="Achievement ID" value={awardAchievementId} onChange={e => setAwardAchievementId(e.target.value)} required className="premium-input" />
                        </div>
                        <button type="submit" className="premium-button">Award</button>
                    </form>
                </div>

                <div className="glass-card view-section">
                    <h3><span className="icon">👀</span> View User Badges</h3>
                    <div className="search-bar">
                        <input type="number" placeholder="Enter User ID" value={userIdForList} onChange={e => setUserIdForList(e.target.value)} className="premium-input search-input" />
                        <button onClick={fetchUserAchievements} className="premium-button secondary">Fetch</button>
                    </div>
                    
                    <div className="table-container">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Badge</th>
                                    <th>Description</th>
                                    <th>Earned Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAchievements.length > 0 ? userAchievements.map((ua, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className="badge-title">
                                                <span className="badge-icon">
                                                    {ua.Title?.toLowerCase().includes('starter') ? '🌱' : 
                                                     ua.Title?.toLowerCase().includes('warrior') ? '⚔️' :
                                                     ua.Title?.toLowerCase().includes('champion') ? '👑' : '⭐'}
                                                </span>
                                                <span className="badge-name">{ua.Title}</span>
                                            </div>
                                        </td>
                                        <td className="description-cell">{ua.Description}</td>
                                        <td><span className="date-badge">{new Date(ua.EarnedDate).toLocaleDateString()}</span></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="empty-state">No earned achievements for this user.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }

                .header-section p {
                    color: #64748b;
                    font-size: 16px;
                }

                .management-layout {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
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
                    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.1);
                }

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
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .input-group {
                    flex: 1;
                    min-width: 200px;
                }

                .premium-input {
                    width: 100%;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-size: 15px;
                    color: #334155;
                    transition: all 0.3s ease;
                    outline: none;
                    box-sizing: border-box;
                }

                .premium-input:focus {
                    background: white;
                    border-color: #10b981;
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }

                .premium-button {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
                    white-space: nowrap;
                }

                .premium-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
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
                    max-width: 500px;
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

                .badge-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .badge-icon {
                    background: #f1f5f9;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    font-size: 20px;
                }

                .badge-name {
                    font-weight: 700;
                    color: #1e293b;
                }

                .description-cell {
                    color: #64748b;
                    line-height: 1.5;
                }

                .date-badge {
                    background: #f8fafc;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                    border: 1px solid #e2e8f0;
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

export default UserAchievements;
