import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB connection
let db = null;
let collection = null;

async function connectToMongoDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('interview_data');
    collection = db.collection('linkedin_data_subset');
    
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Initialize MongoDB connection with retry mechanism
let connectionRetries = 0;
const maxRetries = 5;

async function initializeDatabase() {
  try {
    await connectToMongoDB();
    connectionRetries = 0; // Reset retry counter on success
  } catch (error) {
    connectionRetries++;
    console.error(`MongoDB connection attempt ${connectionRetries} failed:`, error);
    
    if (connectionRetries < maxRetries) {
      console.log(`Retrying MongoDB connection in 5 seconds... (${connectionRetries}/${maxRetries})`);
      setTimeout(initializeDatabase, 5000);
    } else {
      console.error('Max MongoDB connection retries reached. Server will continue without database.');
    }
  }
}

initializeDatabase();

// Helper functions
function getProfileText(profile) {
  const experienceText = (profile.experience && Array.isArray(profile.experience))
    ? profile.experience
        .map(exp => `${exp.title || ''} ${exp.company || ''} ${exp.description || ''}`)
        .join(' ')
    : '';
  
  const educationText = (profile.education && Array.isArray(profile.education))
    ? profile.education
        .map(edu => `${edu.degree || ''} ${edu.field || ''} ${edu.institution || ''}`)
        .join(' ')
    : '';

  return [
    profile.name || '',
    experienceText,
    educationText,
    profile.summary || '',
    (profile.skills && Array.isArray(profile.skills)) ? profile.skills.join(' ') : ''
  ].join(' ');
}

function extractKeywords(criterion) {
  // Keep important words like 'must', 'have', 'experience', 'degree', etc.
  const stopWords = new Set(['the', 'and', 'or', 'in', 'at', 'to', 'for', 'be', 'a', 'an', 'of', 'with', 'by']);
  return criterion
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

function matchesHardCriteria(profile, criteria) {
  const profileText = getProfileText(profile).toLowerCase();
  
  // Count how many criteria match
  const matchCount = criteria.filter(criterion => {
    const keywords = extractKeywords(criterion);
    return keywords.some(keyword => profileText.includes(keyword.toLowerCase()));
  }).length;
  
  // Require at least 50% of hard criteria to match (more flexible)
  const requiredMatches = Math.ceil(criteria.length * 0.5);
  
  return matchCount >= requiredMatches;
}

function calculateSoftCriteriaScore(profile, criteria) {
  try {
    const profileText = getProfileText(profile).toLowerCase();
    let matchCount = 0;

    criteria.forEach(criterion => {
      const keywords = extractKeywords(criterion);
      if (keywords.some(keyword => profileText.includes(keyword.toLowerCase()))) {
        matchCount++;
      }
    });

    return criteria.length > 0 ? matchCount / criteria.length : 0;
  } catch (error) {
    console.error('Error calculating soft criteria score:', error);
    return 0;
  }
}

function generateExplanation(profile, query, hardMatches, softMatches) {
  const explanations = [];

  if (hardMatches.length > 0) {
    explanations.push(`Meets ${hardMatches.length}/${query.hardCriteria.length} hard requirements`);
  }

  if (softMatches.length > 0) {
    explanations.push(`Matches ${softMatches.length}/${query.softCriteria.length} preferred criteria`);
  }

  if (profile.yearsOfExperience > 0) {
    explanations.push(`${profile.yearsOfExperience} years of experience`);
  }

  return explanations.join('. ') || 'Profile found through semantic similarity';
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/profiles/count', async (req, res) => {
  try {
    if (!collection) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const count = await collection.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting profile count:', error);
    res.status(500).json({ error: 'Failed to get profile count' });
  }
});

// Add a test endpoint to get sample profiles
app.get('/api/profiles/sample', async (req, res) => {
  try {
    if (!collection) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const limit = parseInt(req.query.limit) || 5;
    const sampleProfiles = await collection.find({}).limit(limit).toArray();
    res.json({ profiles: sampleProfiles });
  } catch (error) {
    console.error('Error getting sample profiles:', error);
    res.status(500).json({ error: 'Failed to get sample profiles' });
  }
});

app.post('/api/search', async (req, res) => {
  try {
    if (!collection) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { query, config } = req.body;
    
    // Extract individual search terms from all criteria
    const allTerms = [
      ...query.hardCriteria,
      ...query.softCriteria,
      query.naturalLanguage
    ];
    
    // Split into individual words and filter out short terms
    const searchTerms = allTerms
      .join(' ')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2);
    
    // Create progressive search strategies
    let candidates = [];
    
    // Strategy 1: Search for any of the individual terms
    if (searchTerms.length > 0) {
      // Simplified query structure - search for any term in any field
      const searchQuery = {
        $or: [
          ...searchTerms.map(term => ({ name: { $regex: term, $options: 'i' } })),
          ...searchTerms.map(term => ({ 'experience.title': { $regex: term, $options: 'i' } })),
          ...searchTerms.map(term => ({ 'experience.company': { $regex: term, $options: 'i' } })),
          ...searchTerms.map(term => ({ 'education.degree': { $regex: term, $options: 'i' } })),
          ...searchTerms.map(term => ({ 'education.institution': { $regex: term, $options: 'i' } })),
          ...searchTerms.map(term => ({ summary: { $regex: term, $options: 'i' } }))
        ]
      };
      

      candidates = await collection.find(searchQuery).limit(config.maxResults * 2).toArray();

    }
    
    // Strategy 2: If no results, try with just hard criteria terms
    if (candidates.length === 0 && query.hardCriteria.length > 0) {
      const hardTerms = query.hardCriteria
        .join(' ')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(term => term.length > 2);
      
      if (hardTerms.length > 0) {
        const hardSearchQuery = {
          $or: [
            ...hardTerms.map(term => ({ name: { $regex: term, $options: 'i' } })),
            ...hardTerms.map(term => ({ 'experience.title': { $regex: term, $options: 'i' } })),
            ...hardTerms.map(term => ({ 'experience.company': { $regex: term, $options: 'i' } })),
            ...hardTerms.map(term => ({ 'education.degree': { $regex: term, $options: 'i' } })),
            ...hardTerms.map(term => ({ 'education.institution': { $regex: term, $options: 'i' } })),
            ...hardTerms.map(term => ({ summary: { $regex: term, $options: 'i' } }))
          ]
        };
        
        candidates = await collection.find(hardSearchQuery).limit(config.maxResults * 2).toArray();
      }
    }
    
    // Strategy 3: If still no results, try with just natural language
    if (candidates.length === 0) {
      const naturalTerms = query.naturalLanguage
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(term => term.length > 2);
      
      if (naturalTerms.length > 0) {
        const naturalSearchQuery = {
          $or: [
            ...naturalTerms.map(term => ({ name: { $regex: term, $options: 'i' } })),
            ...naturalTerms.map(term => ({ 'experience.title': { $regex: term, $options: 'i' } })),
            ...naturalTerms.map(term => ({ 'experience.company': { $regex: term, $options: 'i' } })),
            ...naturalTerms.map(term => ({ 'education.degree': { $regex: term, $options: 'i' } })),
            ...naturalTerms.map(term => ({ 'education.institution': { $regex: term, $options: 'i' } })),
            ...naturalTerms.map(term => ({ summary: { $regex: term, $options: 'i' } }))
          ]
        };
        
        candidates = await collection.find(naturalSearchQuery).limit(config.maxResults * 2).toArray();
      }
    }
    
    // Strategy 4: Last resort - get random profiles
    if (candidates.length === 0) {
      candidates = await collection.find({}).limit(config.maxResults).toArray();
    }

    // Apply hard criteria filtering
    if (config.useHardFiltering) {
      candidates = candidates.filter(profile => 
        matchesHardCriteria(profile, query.hardCriteria)
      );
    }

    // Score and rank candidates
    const results = candidates.map(profile => {
      try {
        const softScore = calculateSoftCriteriaScore(profile, query.softCriteria);
        const hardMatches = query.hardCriteria.filter(criterion => 
          matchesHardCriteria(profile, [criterion])
        );
        const softMatches = query.softCriteria.filter(criterion => 
          calculateSoftCriteriaScore(profile, [criterion]) > 0
        );

        // Improved scoring algorithm
        const hardScore = hardMatches.length / query.hardCriteria.length;
        const finalScore = config.useHardFiltering 
          ? (hardScore * 0.6) + (softScore * 0.4)  // Weight hard criteria more
          : softScore;

        return {
          profile,
          score: finalScore,
          explanation: generateExplanation(profile, query, hardMatches, softMatches),
          matchedCriteria: {
            hard: hardMatches,
            soft: softMatches
          }
        };
      } catch (error) {
        console.error('Error processing profile:', profile._id, error);
        return {
          profile,
          score: 0,
          explanation: 'Error processing profile',
          matchedCriteria: {
            hard: [],
            soft: []
          }
        };
      }
    });

    // Filter by threshold and sort by score
    const finalResults = results
      .filter(result => result.score >= config.threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, config.maxResults);

    res.json(finalResults);
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.post('/api/evaluate', async (req, res) => {
  try {
    const { configPath, candidateIds } = req.body;
    
    if (!configPath || !candidateIds) {
      console.error('Missing required fields:', { configPath, candidateIds });
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { configPath, candidateIds: candidateIds?.length }
      });
    }
    
    const email = process.env.MERCOR_EMAIL;
    if (!email) {
      console.error('MERCOR_EMAIL environment variable not set');
      return res.status(500).json({ 
        error: 'Server configuration error: MERCOR_EMAIL not set'
      });
    }
    
    const requestBody = {
      config_path: configPath,
      object_ids: candidateIds
    };
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': email
    };
    
    const response = await axios.post(
      'https://mercor-dev--search-eng-interview.modal.run/evaluate',
      requestBody,
      {
        headers: requestHeaders
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Evaluation failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    
    res.status(500).json({ 
      error: 'Evaluation failed',
      details: error.response?.data || error.message,
      status: error.response?.status
    });
  }
});

app.post('/api/submit', async (req, res) => {
  try {
    const { configCandidates } = req.body;
    
    const email = process.env.MERCOR_EMAIL;
    if (!email) {
      console.error('MERCOR_EMAIL environment variable not set');
      return res.status(500).json({ 
        error: 'Server configuration error: MERCOR_EMAIL not set'
      });
    }
    
    const response = await axios.post(
      'https://mercor-dev--search-eng-interview.modal.run/grade',
      {
        config_candidates: configCandidates
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': email
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Submission failed:', error);
    res.status(500).json({ 
      error: 'Submission failed',
      details: error.response?.data || error.message 
    });
  }
});

app.post('/api/save-submission', async (req, res) => {
  try {
    const { configCandidates } = req.body;
    
    // Create submission data with metadata
    const submissionData = {
      config_candidates: configCandidates,
      timestamp: new Date().toISOString(),
      total_queries: Object.keys(configCandidates).length,
      total_candidates: Object.values(configCandidates).reduce((sum, candidates) => sum + candidates.length, 0)
    };
    
    // Save to submission.json in the project directory
    const filePath = path.join(process.cwd(), 'submission.json');
    fs.writeFileSync(filePath, JSON.stringify(submissionData, null, 2));
    
    console.log(`Submission data saved to: ${filePath}`);
    
    res.json({ 
      success: true, 
      message: 'Submission data saved locally',
      filePath: filePath,
      totalQueries: submissionData.total_queries,
      totalCandidates: submissionData.total_candidates
    });
  } catch (error) {
    console.error('Failed to save submission data:', error);
    res.status(500).json({ 
      error: 'Failed to save submission data',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});