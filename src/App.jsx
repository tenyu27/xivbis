import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [data, setData] = useState({ sets: [], patches: [], categories: [], roles: [] });
  const [filters, setFilters] = useState({ patch: 'All', category: 'All', role: 'All' });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/data/sets.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading sets:', err);
        setLoading(false);
      });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };


  const filteredSets = data.sets.filter(set => {
    return (filters.patch === 'All' || set.patch === filters.patch) &&
           (filters.category === 'All' || set.category === filters.category) &&
           (filters.role === 'All' || set.role === filters.role);
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="container" style={{textAlign: 'center', marginTop: '10rem'}}>Loading sets...</div>;
  }

  return (
    <div className="container">
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <header>

        <h1>XIV Best in Slot</h1>
        <p className="subtitle">Curated gear sets for Final Fantasy XIV</p>
      </header>

      <section className="filter-bar">
        <div className="filter-group">
          <label>Patch</label>
          <select name="patch" value={filters.patch} onChange={handleFilterChange}>
            <option value="All">All Patches</option>
            {data.patches.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="All">All Categories</option>
            {data.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Role</label>
          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="All">All Roles</option>
            {data.roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </section>

      <main className="sets-grid">
        {filteredSets.length > 0 ? (
          filteredSets.map(set => (
            <div key={set.id} className="set-card">
              <div className="card-header">
                <span className="patch-badge">Patch {set.patch}</span>
                <span className="category-tag">{set.category}</span>
              </div>
              <div className="job-name">{set.job} - {set.name}</div>
              <p className="description">{set.description}</p>
              <div className="card-footer">
                <a 
                  href={set.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="link-button"
                >
                  View Gearset
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
            No sets found for the selected filters.
          </div>
        )}
      </main>

      <footer style={{marginTop: '5rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
        <p>&copy; {new Date().getFullYear()} XIVBIS. All gearsets hosted on Etro or xivgear.app.</p>
        <p>FFXIV is a trademark of Square Enix.</p>
      </footer>
    </div>
  );
}

export default App;
