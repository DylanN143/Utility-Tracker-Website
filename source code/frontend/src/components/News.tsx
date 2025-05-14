import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './News.css';
// Import mock data for demo
import { mockNews } from '../mockData/userData';

interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');

      // DEMO MODE: Use mock data instead of API call
      console.log('Using mock news data for demo');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Use mock news data
      setNews(mockNews);

      /* Original server-based code (commented out for demo)
      const response = await axios.get('http://localhost:8080/Backend/Backend?reqID=11');

      if (response.data.success) {
        setNews(response.data.news || []);
      } else {
        setError('Failed to load news. Please try again later.');
      }
      */

      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
      setLoading(false);
    }
  };

  // Function to open URLs in a new tab
  const openNewsLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="news-container">
      <div className="news-title">
        <h2>Environmental News</h2>
      </div>

      {error && <div className="news-error">{error}</div>}

      {loading ? (
        <div className="news-loading">Loading environmental news...</div>
      ) : news.length === 0 ? (
        <div className="news-empty">No news articles available at the moment. Please check back later.</div>
      ) : (
        <div className="news-grid">
          {news.map(item => (
            <div key={item.id} className="news-card">
              <div className="news-card-image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="news-card-content">
                <h3 className="news-card-title">{item.title}</h3>
                <div className="news-card-source">Source: {item.source}</div>
                <a 
                  href={item.url} 
                  className="news-card-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openNewsLink(item.url);
                  }}
                >
                  Read Article
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;