// src/hooks/usePortfolio.js
import { useState, useRef } from 'react';

const usePortfolio = () => {
  // Existing states
  const [activeCompany, setActiveCompany] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [savedProjects, setSavedProjects] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isCompanyCardTransformed, setIsCompanyCardTransformed] = useState(false);
  
  // Menu states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const foxIconRef = useRef(null);

  // Function to toggle company visibility
  const toggleCompany = (companyId) => {
    // Handle menu separately
    if (companyId === 'menu') {
      toggleMenu();
      return;
    }
    
    // Handle contact modal
    if (companyId === 'contact') {
      setShowContactModal(true);
      return;
    }
    
    // Toggle active company
    if (activeCompany === companyId) {
      // Close current company
      setActiveCompany(null);
      setActiveCase(null);
      setIsOpen(false);
      setIsCompanyCardTransformed(false);
    } else {
      // Open new company
      setActiveCompany(companyId);
      
      // Restore saved project or default state
      const savedCase = savedProjects[companyId];
      if (savedCase) {
        setActiveCase(savedCase);
        setIsCompanyCardTransformed(true);
      } else {
        setActiveCase(null);
        setIsCompanyCardTransformed(false);
      }
      
      setIsOpen(true);
    }
  };

  // Function to select a project case
  const selectCase = (caseId) => {
    setActiveCase(caseId);
    setIsCompanyCardTransformed(true);
    
    // Save project selection for this company
    setSavedProjects({
      ...savedProjects,
      [activeCompany]: caseId
    });
  };

  // Function to return to full company card
  const backToCompanyCard = () => {
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  // Function to close sidebar (all windows)
  const closeSidebar = () => {
    setIsOpen(false);
    setActiveCompany(null);
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  // Function to close only project details
  const closeProjectDetails = () => {
    setActiveCase(null);
    setIsCompanyCardTransformed(false);
  };

  // Function to open contact modal
  const openContactModal = () => {
    setShowContactModal(true);
  };
  
  // Function to toggle menu
  const toggleMenu = () => {
    // If menu is open, close it
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    
    // Get position for menu placement
    if (foxIconRef.current) {
      const rect = foxIconRef.current.getBoundingClientRect();
      const position = {
        x: rect.left,
        y: rect.top,
        height: rect.height,
        width: rect.width
      };
      setMenuPosition(position);
    }
    
    // Open menu
    setIsMenuOpen(true);
  };
  
  // Function to close menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return {
    activeCompany,
    activeCase,
    isOpen,
    showContactModal,
    isCompanyCardTransformed,
    setShowContactModal,
    toggleCompany,
    selectCase,
    closeSidebar,
    closeProjectDetails,
    backToCompanyCard,
    openContactModal,
    isMenuOpen,
    menuPosition,
    toggleMenu,
    closeMenu,
    foxIconRef
  };
};

export default usePortfolio;