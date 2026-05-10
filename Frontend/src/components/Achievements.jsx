import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Achievements = () => {
    const [allAchievements, setAllAchievements] = useState([]);

    useEffect(() => {
        fetchAllAchievements();
    }, []);

    const fetchAllAchievements = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/achievements/all`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setAllAchievements(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="premium-container">
            <div className="header-section">
                <h2>System Achievements</h2>
                <p>Unlock new milestones by maintaining your habits and goals</p>
            </div>
            
            <div className="achievements-grid">
                {allAchievements.length > 0 ? allAchievements.map((a) => (
                    <div key={a.AchievementID} className="achievement-card glass-card">
                        <div className="achievement-icon">
                            {a.Title.toLowerCase().includes('starter') ? '🌱' : 
                             a.Title.toLowerCase().includes('warrior') ? '⚔️' :
                             a.Title.toLowerCase().includes('champion') ? '👑' : '⭐'}
                        </div>
                        <div className="achievement-content">
                            <h3>{a.Title}</h3>
                            <p>{a.Description}</p>
                            <span className="achievement-id">ID: #{a.AchievementID}</span>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state glass-card">
                        No achievements found in the system.
                    </div>
                )}
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
                    margin-bottom: 40px;
                    text-align: center;
                }

                .header-section h2 {
                    font-size: 36px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }

                .header-section p {
                    color: #64748b;
                    font-size: 16px;
                }

                .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    padding: 24px;
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .achievement-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -15px rgba(245, 158, 11, 0.2);
                    border-color: rgba(245, 158, 11, 0.3);
                }

                .achievement-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }

                .achievement-icon {
                    font-size: 40px;
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    width: 70px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    flex-shrink: 0;
                    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.1);
                }

                .achievement-content {
                    flex: 1;
                }

                .achievement-content h3 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .achievement-content p {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.5;
                }

                .achievement-id {
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    background: #f1f5f9;
                    padding: 4px 8px;
                    border-radius: 12px;
                }

                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px !important;
                    color: #94a3b8;
                    font-size: 18px;
                }
            `}</style>
        </div>
    );
};

export default Achievements;
