import React from 'react';

/**
 * Компонент анимации загрузки первого проекта
 * @returns {JSX.Element} - Компонент анимации проекта
 */
const ProjectLoader = () => {
  return (
    <div className="project-loader-container">
      <div className="project-window">
        <div className="project-window-header">
          {/*<div className="project-window-controls">
            <span className="window-control close"></span>
            <span className="window-control minimize"></span>
            <span className="window-control maximize"></span>
          </div>*/}
          <div className="project-window-title">GMX Exchange</div>
        </div>
        <div className="project-window-content">
          <div className="project-loading-indicator">
            <div className="project-loading-bar"></div>
          </div>
        </div>
      </div>
      <p className="boot-text">Opening the first project...</p>
    </div>
  );
};

export default ProjectLoader;