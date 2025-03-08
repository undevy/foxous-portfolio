// projects.js - данные о проектах для всех компаний
export const caseStudies = {
  // GMX Exchange projects
  tradepage: {
    id: 'tradepage',
    companyId: 'gmx',
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
    id: 'gasless',
    companyId: 'gmx',
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
    id: 'pools',
    companyId: 'gmx',
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
    id: 'multichain',
    companyId: 'gmx',
    title: "Multichain UI Architecture",
    challenge: "GMX had to go beyond the Arbitrum and Avalanche chains to increase the trading volume. This called for an architectural approach that was economically feasible and straightforward for users with no experience with cross-chain operations.",
    solution: "I participated in the R&D phase for this feature and created several designs and mock-ups to test with pre-selected traders. My work helped determine which components were best created internally and which could be partnered with third-party apps to address the technical limitations and UX design needs.",
    impact: "The architectural choices made during our prototyping and testing processes have helped outline GMX's expansion strategy. My designs have received sign-off for production and will further lessen the development effort while providing the user with a smooth experience."
  },
  
  // Nexus Network projects
  crosschain: {
    id: 'crosschain',
    companyId: 'nexus',
    title: "Cross-Chain Bridge Interface",
    challenge: "Users found existing bridge interfaces confusing and risky, often leading to lost funds or abandoned transactions. Technical terminology created barriers for new users.",
    solution: "I designed a step-by-step guided interface with real-time status updates and visual confirmations at each stage. Implemented predictive gas estimations and clear security validations to increase user confidence.",
    impact: [
      "Improved bridge completion rate by 47%",
      "Reduced support tickets for transaction issues by 62%",
      "Doubled monthly active users within 3 months of launch"
    ]
  },
  governance: {
    id: 'governance',
    companyId: 'nexus',
    title: "Governance Dashboard",
    challenge: "The protocol's governance system was underutilized due to complex participation requirements and lack of clear information about proposals and their impacts.",
    solution: "Created an intuitive governance dashboard with proposal summaries, voting impact visualizations, and simplified voting flows. Added educational components to help users understand the governance process.",
    impact: [
      "Increased governance participation by 156%",
      "Improved proposal quality through better templates",
      "Enhanced community engagement with 72% of voters returning for subsequent proposals"
    ]
  },
  mobile: {
    id: 'mobile',
    companyId: 'nexus',
    title: "Mobile Experience Optimization",
    challenge: "The protocol's interface was primarily designed for desktop, resulting in poor mobile experiences despite 40% of users accessing via smartphones.",
    solution: "Redesigned the core user flows for mobile-first interactions, created custom touch controls for complex operations, and implemented progressive disclosure patterns for complex data.",
    impact: [
      "Increased mobile user retention by 58%",
      "Reduced task completion time on mobile by 35%",
      "Improved mobile conversion rates from 2.3% to 6.7%"
    ]
  },
  
  // P2P Validator projects
  dashboard: {
    id: 'dashboard',
    companyId: 'p2p',
    title: "Staking Dashboard Redesign",
    challenge: "User feedback revealed confusion about staking status, rewards calculation, and delegation processes across different blockchain networks.",
    solution: "I created a unified dashboard with standardized metrics across chains, implemented visual status indicators, and designed contextual help systems. A rewards calculator and timeline visualization were added to improve transparency.",
    impact: [
      "Reduced customer support inquiries by 41%",
      "Increased average stake amount by 34%",
      "Improved user satisfaction scores from 6.7 to 8.9 (out of 10)"
    ]
  },
  onboarding: {
    id: 'onboarding',
    companyId: 'p2p',
    title: "Validator Onboarding Flow",
    challenge: "Technical barriers prevented many qualified node operators from joining the validation network, limiting decentralization and geographic diversity.",
    solution: "Designed a step-by-step onboarding process with interactive tutorials, hardware requirement calculators, and performance simulators. Created a community knowledge base for troubleshooting.",
    impact: [
      "Doubled the number of new validators per month",
      "Improved geographic distribution of nodes by 37%",
      "Decreased setup failure rate from 28% to 9%"
    ]
  },
  rewards: {
    id: 'rewards',
    companyId: 'p2p',
    title: "Rewards & Analytics System",
    challenge: "Stakers had difficulty understanding their actual returns and performance compared to network averages, leading to frequent withdrawals and platform switching.",
    solution: "Created comprehensive analytics dashboards with historical performance data, peer comparisons, and projected rewards. Implemented customizable alerts for significant events.",
    impact: [
      "Reduced withdrawal rates by 23% during market downturns",
      "Increased average staking duration from 4 months to 7 months",
      "Generated additional feature requests that became prioritized roadmap items"
    ]
  },
  
  // Wildberries projects
  search: {
    id: 'search',
    companyId: 'wildberries',
    title: "Search & Discovery Optimization",
    challenge: "The platform's search functionality had poor relevance and didn't effectively showcase promotions or new products, affecting conversion rates and average order value.",
    solution: "Redesigned search algorithms and results page to balance relevance, popularity, and promotion factors. Added visual filters, personalized recommendations, and smart categorization.",
    impact: [
      "Improved search-to-purchase conversion by 28%",
      "Increased average order value by 17% for search-originated sessions",
      "Reduced search abandonment rate from 45% to 29%"
    ]
  },
  checkout: {
    id: 'checkout',
    companyId: 'wildberries',
    title: "Streamlined Checkout Process",
    challenge: "Shopping cart abandonment rates were high due to a lengthy, multi-page checkout process with redundant information requests and confusing delivery options.",
    solution: "Designed a single-page checkout with progress indicators, smart defaults, and simplified delivery selection. Added express checkout options and clear order summaries.",
    impact: [
      "Reduced checkout abandonment by 32%",
      "Decreased average checkout time from 4.2 minutes to 1.8 minutes",
      "Increased successful checkout completions on mobile devices by 47%"
    ]
  },
  mobileapp: {
    id: 'mobileapp',
    companyId: 'wildberries',
    title: "Mobile App Redesign",
    challenge: "The mobile app had lower engagement and conversion rates compared to the mobile web version, despite having more features and better performance.",
    solution: "Completely redesigned the app with a focus on intuitive navigation, simplified product browsing, and personalized content. Added offline capabilities and quick reordering functions.",
    impact: [
      "Increased app installations by 45% within three months",
      "Improved in-app purchase rate by 38% compared to previous version",
      "Received 4.7/5 average rating (up from 3.6) in app stores"
    ]
  }
};

// Группировка проектов по компаниям для удобства доступа
export const projectsByCompany = Object.values(caseStudies).reduce((acc, project) => {
  if (!acc[project.companyId]) {
    acc[project.companyId] = [];
  }
  acc[project.companyId].push(project);
  return acc;
}, {});

export default caseStudies;