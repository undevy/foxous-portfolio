import React, { useState } from 'react';

const PortfolioLayout = () => {
  const [activeCase, setActiveCase] = useState('tradepage');
  const [isOpen, setIsOpen] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const handleCloseDetail = () => {
    // Only close the detail panel, handled in the UI by conditionally rendering
  };

  const togglePanels = () => {
    setIsOpen(!isOpen);
  };

  const caseStudies = {
    tradepage: {
      title: "Trade Page Redesign",
      challenge: "GMX's trading interface intimidated users with its complex data display and confusing navigation patterns. Our analytics showed that 68% of new users abandoned the platform before completing their first transaction.",
      solution: "I redesigned the trading page by simplifying the tradebox interface and adding a Depth Chart for easier liquidity viewing. A focus was placed on core trading actions. For mobile users, I created a fixed-bottom navigation with always-visible action buttons. Power users were still satisfied, and removing rarely-used features resulted in a more user-centered experience for novices.",
      impact: [
        "Increased successful first-time trades by 23% per user",
        "Increased mobile trading volume by 27%",
        "Reduced average session time by 15% while increasing per-user trading volume"
      ]
    },
    gasless: {
      title: "Gasless & One-Click Trading",
      challenge: "Users were frustrated by high gas fees and complex transaction flows. Multiple required signatures created friction, especially during network congestion. Trading often required multiple wallet approvals, decreasing completion rates.",
      solution: "I consolidated Express Trading (Gasless) and One-Click Trading into a unified settings interface, creating a cohesive experience that removed technical complexity. I focused on streamlining onboarding flows, designing clear status indicators, and implementing intuitive security controls.",
      impact: [
        "Simplified trading flow from 5 steps to a single action",
        "Reduced transaction failures by 62% during network congestion periods",
        "Improved feature adoption rate by 38% through contextual promotions"
      ]
    },
    pools: {
      title: "Pools Page Redesign",
      challenge: "GMX's pools page suffered from information overload and poor information hierarchy. Critical metrics were buried among less important data, and core liquidity provider functions required multiple clicks to access. Users struggled to evaluate and compare pool performance.",
      solution: "I restructured the information architecture by separating pool listings from detailed views and implementing tabbed navigation (Performance, Price, Fee APY). I created clear user flows for different personas (LPs, token investors, traders) and designed intuitive performance visualizations that prioritized relevant timeframes.",
      impact: [
        "Increased pool deposits by 35% within the first month after release",
        "Decreased support tickets related to pool functions by 60%",
        "Improved average session duration on pool pages from 45 seconds to 2 minutes"
      ]
    },
    multichain: {
      title: "Multichain UI Architecture",
      challenge: "GMX had to go beyond the Arbitrum and Avalanche chains to increase the trading volume. This called for an architectural approach that was economically feasible and straightforward for users with no experience with cross-chain operations.",
      solution: "I participated in the R&D phase for this feature and created several designs and mock-ups to test with pre-selected traders. My work helped determine which components were best created internally and which could be partnered with third-party apps to address the technical limitations and UX design needs.",
      impact: "The architectural choices made during our prototyping and testing processes have helped outline GMX's expansion strategy. My designs have received sign-off for production and will further lessen the development effort while providing the user with a smooth experience."
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-blue-50 p-8 gap-6">
      <div className="flex-1 flex gap-6">
        {isOpen && (
          /* Project Overview Card */
          <div className="w-96 bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative">
            <button onClick={handleCloseSidebar} className="absolute top-4 right-4 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="mb-6">
              <img 
                src="/api/placeholder/400/250" 
                alt="GMX Interface" 
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2">GMX Exchange</h2>
              <p className="text-gray-600 mb-4">
                Redesigned the key trading experience of a decentralized derivatives exchange by improving main features and reducing complexity for experienced and novice traders alike.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Key Projects</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveCase('tradepage')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeCase === 'tradepage' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  Trade Page
                </button>
                <button 
                  onClick={() => setActiveCase('gasless')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeCase === 'gasless' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  Gasless & 1CT
                </button>
                <button 
                  onClick={() => setActiveCase('pools')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeCase === 'pools' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  Pools
                </button>
                <button 
                  onClick={() => setActiveCase('multichain')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeCase === 'multichain' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  Multichain
                </button>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                >
                  Other
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">DEX</span>
                <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">Perpetual Trading</span>
                <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">DeFi</span>
                <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">Web3</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100">
              <a 
                href="https://app.gmx.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span>Visit GMX Platform</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </div>
        )}

        {isOpen && (
          /* Case Study Detail Card */
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-200 relative">
            <button onClick={handleCloseDetail} className="absolute top-4 right-4 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold mb-6">{caseStudies[activeCase].title}</h1>
              
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-3">Challenge</h2>
                <p className="text-gray-600">
                  {caseStudies[activeCase].challenge}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-medium mb-3">Solution</h2>
                <p className="text-gray-600">
                  {caseStudies[activeCase].solution}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-3">Impact</h2>
                {Array.isArray(caseStudies[activeCase].impact) ? (
                  <ul className="list-disc list-inside text-gray-600">
                    {caseStudies[activeCase].impact.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">{caseStudies[activeCase].impact}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Get in Touch</h2>
              <button onClick={() => setShowContactModal(false)} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-8">
              If you'd like to learn more about my work at GMX or discuss other aspects of the project, please feel free to reach out through any of the following channels:
            </p>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-3">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <a href="mailto:foxous@proton.me" className="text-blue-600 hover:text-blue-800">
                    foxous@proton.me
                  </a>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('foxous@proton.me');
                    alert('Email copied to clipboard!');
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-3">
                    <path d="M21.8 17.8C21.2 17.2 20.4 16.8 19.6 16.6C18.7 16.4 17.9 16.2 17 16C16.7 15.9 16.4 16 16.2 16.2L14.8 17.6C13 16.7 11.3 15 10.4 13.2L11.8 11.8C12 11.6 12.1 11.3 12 11C11.8 10.1 11.6 9.3 11.4 8.4C11.2 7.6 10.8 6.8 10.2 6.2C9.6 5.6 8.8 5.2 8 5.2C7.2 5.2 6.4 5.6 5.8 6.2C4.2 7.8 4 11.8 5.6 15.6C6.8 18.1 8.8 20.1 11.3 21.3C12.5 21.9 13.8 22.2 15 22.2C16.2 22.2 17.3 21.9 18.2 21C19.1 20.4 21.2 18.4 21.8 17.8Z"></path>
                  </svg>
                  <a href="https://t.me/foxous" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    @foxous
                  </a>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('@foxous');
                    alert('Telegram username copied to clipboard!');
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Mac OS-style dock */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div>
            {/* Left logo - Fox icon */}
            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 3A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 6.5 3h11z"></path>
                <path d="M9.5 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
                <path d="M14.5 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
                <path d="M9.5 15.5s1.5 2 2.5 2 2.5-2 2.5-2"></path>
                <path d="M19 9V5.5a2.5 2.5 0 0 0-5 0v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a2.5 2.5 0 0 0-5 0V9"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex space-x-3">
            {/* Center icons */}
            <button 
              onClick={togglePanels}
              className={`w-10 h-10 ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} rounded-lg flex items-center justify-center hover:bg-blue-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
          
          <div>
            {/* Right connect button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioLayout;