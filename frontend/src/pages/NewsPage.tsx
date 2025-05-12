import React, { useState, useEffect } from 'react';
import '../components/Header.css'
import '../components/Banner.css'
import News from '../components/News';
import myImage from '../images/forest.jpg';

function NewsPage() {
    const [username, setUsername] = useState("");

    // Get username from localStorage (set by AuthLayout)
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <div className="banner">
                <img className='banner-img' src={myImage} alt="Forest landscape"/>
            </div>

            {username && <News />}
        </div>
    );
}

export default NewsPage;