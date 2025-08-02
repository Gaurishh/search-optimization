// Simple MERN Stack App - No Vite needed!

// Data
const PUBLIC_QUERIES = [
  {
    id: 'tax_lawyer',
    name: 'Tax Lawyer',
    naturalLanguage: 'Seasoned attorney with a JD from a top U.S. law school and over three years of legal practice, specializing in corporate tax structuring and compliance. Has represented clients in IRS audits and authored legal opinions on federal tax code matters.',
    hardCriteria: [
      'JD degree from an accredited U.S. law school',
      '3+ years of experience practicing law'
    ],
    softCriteria: [
      'Experience advising clients on tax implications of corporate or financial transactions',
      'Experience handling IRS audits, disputes, or regulatory inquiries',
      'Experience drafting legal opinions or filings related to federal and state tax compliance'
    ],
    configPath: 'tax_lawyer.yml'
  },
  {
    id: 'junior_corporate_lawyer',
    name: 'Junior Corporate Laywer',
    naturalLanguage: 'Corporate lawyer with two years of experience at a top-tier international law firm, specializing in M&A support and cross-border contract negotiations. Trained at a leading European law school with additional background in international regulatory compliance.',
    hardCriteria: [
      '2-4 years of experience as a Corporate Lawyer at a leading law firm in the USA, Europe, or Canada, or in-house at a major global organization',
      'Graduate of a reputed law school in the USA, Europe, or Canada'
    ],
    softCriteria: [
      'Experience supporting Corporate M&A transactions, including due diligence and legal documentation',
      'Experience drafting and negotiating legal contracts or commercial agreements',
      'Familiarity with international business law or advising on regulatory requirements across jurisdictions'
    ],
    configPath: 'junior_corporate_lawyer.yml'
  },
  {
    id: 'radiology',
    name: 'Radiology',
    naturalLanguage: 'Radiologist with an MD from India and several years of experience reading CT and MRI scans. Well-versed in diagnostic workflows and has worked on projects involving AI-assisted image analysis.',
    hardCriteria: [
      'MD degree from a medical school in the U.S. or India'
    ],
    softCriteria: [
      'Board certification in Radiology (ABR, FRCR, or equivalent) or comparable credential',
      '3+ years of experience interpreting X-ray, CT, MRI, ultrasound, or nuclear medicine studies',
      'Expertise in radiology reporting, diagnostic protocols, differential diagnosis, or AI applications in medical imaging'
    ],
    configPath: 'radiology.yml'
  },
  {
    id: 'doctors_md',
    name: 'Doctors (MD)',
    naturalLanguage: 'U.S.-trained physician with over two years of experience as a general practitioner, focused on chronic care management, wellness screenings, and outpatient diagnostics. Skilled in telemedicine and patient education.',
    hardCriteria: [
      'MD degree from a top U.S. medical school',
      '2+ years of clinical practice experience in the U.S.',
      'Experience working as a General Practitioner (GP)'
    ],
    softCriteria: [
      'Familiarity with EHR systems and managing high patient volumes in outpatient or family medicine settings',
      'Comfort with telemedicine consultations, patient triage, and interdisciplinary coordination'
    ],
    configPath: 'doctors_md.yml'
  },
  {
    id: 'biology_expert',
    name: 'Biology Expert',
    naturalLanguage: 'Biologist with a PhD from a top U.S. university, specializing in molecular biology and gene expression',
    hardCriteria: [
      'Completed undergraduate studies in the U.S., U.K., or Canada',
      'PhD in Biology from a top U.S. university'
    ],
    softCriteria: [
      'Research experience in molecular biology, genetics, or cell biology, with publications in peer-reviewed journals',
      'Familiarity with experimental design, data analysis, and lab techniques such as CRISPR, PCR, or sequencing',
      'Experience mentoring students, teaching undergraduate biology courses, or collaborating on interdisciplinary research'
    ],
    configPath: 'biology_expert.yml'
  },
  {
    id: 'anthropology',
    name: 'Anthropology',
    naturalLanguage: 'PhD student in anthropology at a top U.S. university, focused on labor migration and cultural identity',
    hardCriteria: [
      'PhD (in progress or completed) from a distinguished program in sociology, anthropology, or economics',
      'PhD program started within the last 3 years'
    ],
    softCriteria: [
      'Demonstrated expertise in ethnographic methods, with substantial fieldwork or case study research involving cultural, social, or economic systems',
      'Strong academic output — published papers, working papers, or conference presentations on anthropological or sociological topics',
      'Experience applying anthropological theory to real-world or interdisciplinary contexts (e.g., migration, labor, technology, development), showing both conceptual depth and practical relevance'
    ],
    configPath: 'anthropology.yml'
  },
  {
    id: 'mathematics_phd',
    name: 'Mathematics PhD',
    naturalLanguage: 'Mathematician with a PhD from a leading U.S, specializing in statistical inference and stochastic processes. Published and experienced in both theoretical and applied research.',
    hardCriteria: [
      'Completed undergraduate studies in the U.S., U.K., or Canada',
      'PhD in Mathematics or Statistics from a top U.S. university'
    ],
    softCriteria: [
      'Research expertise in pure or applied mathematics, statistics, or probability, with peer-reviewed publications or preprints',
      'Proficiency in mathematical modeling, proof-based reasoning, or algorithmic problem-solving'
    ],
    configPath: 'mathematics_phd.yml'
  },
  {
    id: 'quantitative_finance',
    name: 'Quantitative Finance',
    naturalLanguage: 'MBA graduate from a top U.S. program with 3+ years of experience in quantitative finance, including roles in risk modeling and algorithmic trading at a global investment firm. Skilled in Python and financial modeling, with expertise in portfolio optimization and derivatives pricing.',
    hardCriteria: [
      'MBA from a Prestigious U.S. university (M7 MBA)',
      '3+ years of experience in quantitative finance, including roles such as risk modeling, algorithmic trading, or financial engineering'
    ],
    softCriteria: [
      'Experience applying financial modeling techniques to real-world problems like portfolio optimization or derivatives pricing',
      'Proficiency with Python for quantitative analysis and exposure to financial libraries (e.g., QuantLib or equivalent)',
      'Demonstrated ability to work in high-stakes environments such as global investment firms, showing applied knowledge of quantitative methods in production settings'
    ],
    configPath: 'quantitative_finance.yml'
  },
  {
    id: 'bankers',
    name: 'Bankers',
    naturalLanguage: 'Healthcare investment banker with over two years at a leading advisory firm, focused on M&A for multi-site provider groups and digital health companies. Currently working in a healthcare-focused growth equity fund, driving diligence and investment strategy.',
    hardCriteria: [
      'MBA from a U.S. university',
      '2+ years of prior work experience in investment banking, corporate finance, or M&A advisory'
    ],
    softCriteria: [
      'Specialized experience in healthcare-focused investment banking or private equity, including exposure to sub-verticals like biotech, pharma services, or provider networks',
      'Led or contributed to transactions involving healthcare M&A, recapitalizations, or growth equity investments',
      'Familiarity with healthcare-specific metrics, regulatory frameworks, and value creation strategies (e.g., payer-provider integration, RCM optimization)'
    ],
    configPath: 'bankers.yml'
  },
  {
    id: 'mechanical_engineers',
    name: 'Mechanical Engineers',
    naturalLanguage: 'Mechanical engineer with over three years of experience in product development and structural design, using tools like SolidWorks and ANSYS. Led thermal system simulations and supported prototyping for electromechanical components in an industrial R&D setting.',
    hardCriteria: [
      'Higher degree in Mechanical Engineering from an accredited university',
      '3+ years of professional experience in mechanical design, product development, or systems engineering'
    ],
    softCriteria: [
      'Experience with CAD tools (e.g., SolidWorks, AutoCAD) and mechanical simulation tools (e.g., ANSYS, COMSOL)',
      'Demonstrated involvement in end-to-end product lifecycle — from concept through prototyping to manufacturing or testing',
      'Domain specialization in areas like thermal systems, fluid dynamics, structural analysis, or mechatronics'
    ],
    configPath: 'mechanical_engineers.yml'
  }
];

// Utility functions
function formatScore(score) {
  if (score === null || score === undefined || isNaN(score)) {
    return 'N/A';
  }
  // If score is already a percentage (like 28.667), just format it
  // If score is a decimal (like 0.28667), multiply by 100
  if (score > 1) {
    return score.toFixed(1) + '%';
  } else {
    return (score * 100).toFixed(1) + '%';
  }
}

// API Client
class APIClient {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
  }

  async healthCheck() {
    const response = await axios.get(`${this.baseURL}/health`);
    return response.data;
  }

  async getProfileCount() {
    const response = await axios.get(`${this.baseURL}/profiles/count`);
    return response.data;
  }

  async getSampleProfiles(limit = 5) {
    const response = await axios.get(`${this.baseURL}/profiles/sample?limit=${limit}`);
    return response.data;
  }

  async search(query, config, minResults = 10) {
    // First attempt with original config
    let response = await axios.post(`${this.baseURL}/search`, {
      query,
      config
    });
    
    let results = response.data;
    
    // If we don't have enough results, try with progressively relaxed criteria
    if (results.length < minResults) {
      console.log(`Initial search returned ${results.length} results, need at least ${minResults}. Trying with relaxed criteria...`);
      
      // Try multiple relaxation strategies
      const relaxationStrategies = [
        {
          name: 'Reduce threshold',
          config: {
            ...config,
            threshold: Math.max(0, config.threshold - 0.1),
            maxResults: Math.max(minResults * 2, config.maxResults + 20)
          }
        },
        {
          name: 'Further reduce threshold',
          config: {
            ...config,
            threshold: Math.max(0, config.threshold - 0.2),
            maxResults: Math.max(minResults * 3, config.maxResults + 50)
          }
        },
        {
          name: 'Minimal threshold',
          config: {
            ...config,
            threshold: 0,
            maxResults: Math.max(minResults * 4, config.maxResults + 100)
          }
        }
      ];
      
      for (const strategy of relaxationStrategies) {
        try {
          console.log(`Trying ${strategy.name}...`);
          const relaxedResponse = await axios.post(`${this.baseURL}/search`, {
            query,
            config: strategy.config
          });
          
          const relaxedResults = relaxedResponse.data;
          
          if (relaxedResults.length >= minResults) {
            console.log(`${strategy.name} returned ${relaxedResults.length} results, using these instead.`);
            results = relaxedResults;
            break;
          } else {
            console.log(`${strategy.name} returned ${relaxedResults.length} results, still insufficient.`);
          }
        } catch (error) {
          console.warn(`${strategy.name} failed for ${query.name}:`, error);
        }
      }
      
      if (results.length < minResults) {
        console.warn(`All relaxation strategies failed. Best result: ${results.length} results for ${query.name}`);
      }
    }
    
    return results;
  }

  async evaluate(configPath, candidateIds) {
    const response = await axios.post(`${this.baseURL}/evaluate`, {
      configPath,
      candidateIds
    });
    return response.data;
  }
}

const apiClient = new APIClient();

// React Components
const SearchResults = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card">
        <h2>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Search Results
        </h2>
        <div className="loading">
          <div>Searching...</div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="card">
        <h2>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Search Results
        </h2>
        <div className="loading">
          <div>No results found. Try adjusting your search criteria.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        Search Results ({results.length})
      </h2>
      
      <div className="results-list">
        {results.map((result, index) => (
          <div key={result.profile._id || index} className="result-item">
            <h3>{result.profile.name}</h3>
            <div className="score">Score: {formatScore(result.score)}</div>
            <div className="explanation">{result.explanation}</div>
            
            {result.matchedCriteria.hard.length > 0 && (
              <div className="criteria">
                <strong>Hard Criteria Met:</strong> {result.matchedCriteria.hard.join(', ')}
              </div>
            )}
            
            {result.matchedCriteria.soft.length > 0 && (
              <div className="criteria">
                <strong>Soft Criteria Met:</strong> {result.matchedCriteria.soft.join(', ')}
              </div>
            )}
            
            {result.profile.experience && result.profile.experience.length > 0 && (
              <div className="criteria">
                <strong>Recent Experience:</strong> {result.profile.experience[0].title} at {result.profile.experience[0].company}
              </div>
            )}
            
            {result.profile.education && result.profile.education.length > 0 && (
              <div className="criteria">
                <strong>Education:</strong> {result.profile.education[0].degree} from {result.profile.education[0].institution}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfigPanel = ({ config, onConfigChange }) => {
  const handleChange = (field, value) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="card">
      <h2>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
        Search Configuration
      </h2>

      <div>
        <label className="label">
          <input
            type="checkbox"
            checked={config.useSemanticSearch}
            onChange={(e) => handleChange('useSemanticSearch', e.target.checked)}
          />
          Use Semantic Search
        </label>
      </div>

      <div>
        <label className="label">
          <input
            type="checkbox"
            checked={config.useHardFiltering}
            onChange={(e) => handleChange('useHardFiltering', e.target.checked)}
          />
          Use Hard Filtering
        </label>
      </div>

      <div>
        <label className="label">Soft Criteria Weight</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.softCriteriaWeight}
          onChange={(e) => handleChange('softCriteriaWeight', parseFloat(e.target.value))}
          className="input"
        />
        <span>{Math.round(config.softCriteriaWeight * 100)}%</span>
      </div>

      <div>
        <label className="label">Max Results</label>
        <input
          type="number"
          min="1"
          max="200"
          value={config.maxResults}
          onChange={(e) => handleChange('maxResults', parseInt(e.target.value))}
          className="input"
        />
      </div>

      <div>
        <label className="label">Score Threshold</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={config.threshold}
          onChange={(e) => handleChange('threshold', parseFloat(e.target.value))}
          className="input"
        />
        <span>{Math.round(config.threshold * 100)}%</span>
      </div>
    </div>
  );
};

const EvaluationPanel = ({ onEvaluate, isEvaluating, evaluation, resultsCount }) => {
  return (
    <div className="card">
      <h2>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        Evaluation
      </h2>

      <div style={{ marginTop: '10px' }}>
        <button
          className="button success"
          onClick={() => onEvaluate(5)}
          disabled={isEvaluating || resultsCount === 0}
          style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            padding: '12px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isEvaluating || resultsCount === 0 ? 'not-allowed' : 'pointer',
            opacity: isEvaluating || resultsCount === 0 ? 0.6 : 1
          }}
        >
          {isEvaluating ? 'Evaluating...' : 'Evaluate Top 5'}
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button
          className="button success"
          onClick={() => onEvaluate(10)}
          disabled={isEvaluating || resultsCount === 0}
          style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            padding: '12px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isEvaluating || resultsCount === 0 ? 'not-allowed' : 'pointer',
            opacity: isEvaluating || resultsCount === 0 ? 0.6 : 1
          }}
        >
          {isEvaluating ? 'Evaluating...' : 'Evaluate Top 10'}
        </button>
      </div>

      {evaluation && (
        <div style={{ marginTop: '20px' }}>
          <div className="success">
            <strong>Evaluation Score: {evaluation.average_final_score !== undefined ? formatScore(evaluation.average_final_score) : 'N/A'}</strong>
          </div>
        </div>
      )}

      {resultsCount === 0 && (
        <div className="error" style={{ marginTop: '10px' }}>
          No search results to evaluate. Please run a search first.
        </div>
      )}
    </div>
  );
};

const GradePanel = ({ onSubmitGrade, isSubmitting }) => {
  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h2>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        Gather Grade Submission Data
      </h2>

      <div style={{ marginTop: '10px' }}>
        <button
          className="button primary"
          onClick={onSubmitGrade}
          disabled={isSubmitting}
          style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            padding: '12px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1
          }}
        >
          {isSubmitting ? 'Gathering...' : 'Gather Data'}
        </button>
      </div>
    </div>
  );
};

// Main App Component
const SearchInterface = () => {
  const [selectedQuery, setSelectedQuery] = React.useState(PUBLIC_QUERIES[0]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [serverStatus, setServerStatus] = React.useState('checking');
  const [evaluationResults, setEvaluationResults] = React.useState({});
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchConfig, setSearchConfig] = React.useState({
    useSemanticSearch: true,
    useHardFiltering: false,
    softCriteriaWeight: 0.7,
    maxResults: 100,
    threshold: 0.01
  });

  React.useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      await apiClient.healthCheck();
      setServerStatus('connected');
      
      try {
        const countData = await apiClient.getProfileCount();
      } catch (error) {
        console.warn('Could not get profile count:', error);
      }
    } catch (error) {
      console.error('Server connection failed:', error);
      setServerStatus('error');
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await apiClient.search(selectedQuery, searchConfig, 10);
      setSearchResults(results);
      
      if (results.length === 0) {
        console.warn('No results found - consider adjusting search criteria');
      } else if (results.length < 10) {
        console.warn(`Only found ${results.length} results, less than the desired 10`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please check the console for details and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleEvaluate = async (topN = 10) => {
    if (searchResults.length === 0) {
      alert('No search results to evaluate. Please run a search first.');
      return;
    }

    setIsEvaluating(true);
    try {
      const topCandidates = searchResults.slice(0, topN).map(result => result.profile._id);
      
      const evaluation = await apiClient.evaluate(selectedQuery.configPath, topCandidates);
      
      // Handle empty or invalid response
      if (!evaluation || (typeof evaluation === 'object' && Object.keys(evaluation).length === 0)) {
        console.warn('Empty evaluation response received');
        setEvaluationResults(prev => ({
          ...prev,
          [selectedQuery.id]: { 
            overallScore: null, 
            timestamp: new Date().toISOString(),
            message: 'Empty response from evaluation API'
          }
        }));
      } else {
        setEvaluationResults(prev => ({
          ...prev,
          [selectedQuery.id]: evaluation
        }));
      }
    } catch (error) {
      console.error('Evaluation failed:', error);
      console.error('Error response:', error.response?.data);
      alert('Evaluation failed. Please check your configuration and try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmitGrade = async () => {
    setIsSubmitting(true);
    try {
      // Configuration for gathering data
      const gatherConfig = {
        useSemanticSearch: true,
        useHardFiltering: true, // Use hard filtering - true
        softCriteriaWeight: 1.0, // Soft Criteria Weight - 100%
        maxResults: 50, // Max Results - 50 (increased for better relaxation)
        threshold: 0.0 // Score Threshold - 0%
      };

      const configCandidates = {};
      
                     // Gather data for all 10 job titles
        for (const query of PUBLIC_QUERIES) {
          try {
            console.log(`Gathering data for ${query.name}...`);
            const results = await apiClient.search(query, gatherConfig, 10);
            
            // Check if we have at least 10 results
            if (results.length < 10) {
              throw new Error(`Insufficient results for ${query.name}: found ${results.length} candidates, need at least 10`);
            }
            
            // Extract top 10 candidate IDs
            const candidateIds = results.slice(0, 10).map(result => result.profile._id);
            
            // Store in configCandidates object
            configCandidates[query.configPath] = candidateIds;
            
            console.log(`Found ${candidateIds.length} candidates for ${query.name}`);
          } catch (error) {
            console.error(`Error gathering data for ${query.name}:`, error);
            throw new Error(`Failed to gather data for ${query.name}: ${error.message || 'Unknown error'}`);
          }
        }

                    // Generate curl command
       const curlCommand = `curl \\
   -H 'Authorization: 211210070@nitdelhi.ac.in' \\
   -H 'Content-Type: application/json' \\
   -d '${JSON.stringify({ config_candidates: configCandidates }, null, 2)}' \\
   'https://mercor-dev--search-eng-interview.modal.run/grade'`;

       // Save to submission.json file locally
       try {
         const saveResponse = await axios.post(`${apiClient.baseURL}/save-submission`, {
           configCandidates: configCandidates
         });
         
         console.log('Submission data saved locally:', saveResponse.data);
       } catch (error) {
         console.error('Failed to save submission data locally:', error);
         // Continue with the process even if local save fails
       }

       // Display the curl command in a modal or alert
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        position: relative;
      `;

      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      `;
      closeButton.onclick = () => document.body.removeChild(modal);

      const title = document.createElement('h2');
      title.textContent = 'Generated cURL Command';
      title.style.cssText = `
        margin: 0 0 20px 0;
        color: #2c3e50;
        font-size: 20px;
      `;

      const curlText = document.createElement('pre');
      curlText.textContent = curlCommand;
      curlText.style.cssText = `
        background: #f8f9fa;
        padding: 20px;
        border-radius: 5px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.4;
        white-space: pre-wrap;
        word-break: break-all;
        border: 1px solid #e9ecef;
      `;

      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy to Clipboard';
      copyButton.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      `;
      copyButton.onclick = () => {
        navigator.clipboard.writeText(curlCommand).then(() => {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy to Clipboard';
          }, 2000);
        });
      };

      modalContent.appendChild(closeButton);
      modalContent.appendChild(title);
      modalContent.appendChild(curlText);
      modalContent.appendChild(copyButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);

    } catch (error) {
      console.error('Grade submission failed:', error);
      alert('Grade submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case 'connected': return 'Server Connected';
      case 'error': return 'Server Error';
      default: return 'Checking Server...';
    }
  };

  const getStatusClass = () => {
    switch (serverStatus) {
      case 'connected': return 'connected';
      case 'error': return 'error';
      default: return 'checking';
    }
  };

  return (
    <div className="container">
             {/* Header */}
       <div className="header">
         <h1>Mercor Search Engineer System - MERN Stack</h1>
       </div>

      {/* Main Content */}
      <div className="grid">
        {/* Search Panel */}
        <div>
          {/* Query Selection */}
          <div className="card">
            <h2>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Query Selection
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', marginBottom: '20px' }}>
              <select
                value={selectedQuery.id}
                onChange={(e) => {
                  const query = PUBLIC_QUERIES.find(q => q.id === e.target.value);
                  if (query) setSelectedQuery(query);
                }}
                className="select"
              >
                {PUBLIC_QUERIES.map(query => (
                  <option key={query.id} value={query.id}>
                    {query.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="button"
              >
                {isSearching ? 'Searching...' : 'Run Search'}
              </button>
            </div>

            {/* Query Details */}
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Natural Language Query</h3>
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '5px',
                  color: '#7f8c8d',
                  fontSize: '14px'
                }}>
                  {selectedQuery.naturalLanguage}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Hard Criteria</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedQuery.hardCriteria.map((criterion, index) => (
                      <li key={index} style={{ 
                        color: '#e74c3c', 
                        fontSize: '14px', 
                        marginBottom: '5px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <span style={{ 
                          width: '6px', 
                          height: '6px', 
                          backgroundColor: '#e74c3c', 
                          borderRadius: '50%',
                          marginTop: '6px',
                          flexShrink: 0
                        }}></span>
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Soft Criteria</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedQuery.softCriteria.map((criterion, index) => (
                      <li key={index} style={{ 
                        color: '#27ae60', 
                        fontSize: '14px', 
                        marginBottom: '5px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <span style={{ 
                          width: '6px', 
                          height: '6px', 
                          backgroundColor: '#27ae60', 
                          borderRadius: '50%',
                          marginTop: '6px',
                          flexShrink: 0
                        }}></span>
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <SearchResults results={searchResults} isLoading={isSearching} />
        </div>

        {/* Side Panel */}
        <div>
          {/* Configuration */}
          <ConfigPanel config={searchConfig} onConfigChange={setSearchConfig} />

                     {/* Evaluation */}
           <EvaluationPanel
             onEvaluate={handleEvaluate}
             isEvaluating={isEvaluating}
             evaluation={evaluationResults[selectedQuery.id]}
             resultsCount={searchResults.length}
           />
           <GradePanel onSubmitGrade={handleSubmitGrade} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(
  <React.StrictMode>
    <SearchInterface />
  </React.StrictMode>,
  document.getElementById('root')
); 