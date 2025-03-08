// projects.js - данные о проектах
export const caseStudies = {
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
  
  export default caseStudies;