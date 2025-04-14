import { Link } from 'react-router-dom';
import '../../styles/layout.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Catalog</h3>
      <ul>
        <li><Link to="/">All Courses</Link></li>
        <li className="active"><Link to="/">All Problems</Link></li>
        <li><Link to="/">Skill Tests</Link></li>
        <li><Link to="/">Learn Python</Link></li>
        <li><Link to="/">Learn C++</Link></li>
      </ul>
      
      <div className="skill-tests">
        <h3>Skill tests</h3>
        <p>Build a strong profile by taking skill tests</p>
      </div>
      
      <div className="badges">
        <h3>Badges</h3>
        <p id="badges-info">No badges yet</p>
        <p id="candies-info">Total Candies: 0</p>
        <p id="contest-info">Contest Contender: No Badge</p>
      </div>
    </aside>
  );
}

export default Sidebar;
