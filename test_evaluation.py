#!/usr/bin/env python3
"""
Simple test script for Mercor Search Engineer Evaluation API

This script demonstrates how to:
1. Call the search API
2. Extract candidate IDs
3. Call the evaluation API
4. Print the overallScore

Usage:
    python test_evaluation.py
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_evaluation():
    """Test the evaluation API with a simple query"""
    
    # Configuration
    API_BASE = "http://localhost:3001/api"
    EMAIL = os.getenv('MERCOR_EMAIL', 'your_email@example.com')
    
    print("🚀 Testing Mercor Search Engineer Evaluation API")
    print("=" * 50)
    
    # Step 1: Search for candidates
    print("1. Searching for Tax Lawyer candidates...")
    
    search_payload = {
        "query": {
            "id": "tax_lawyer",
            "name": "Tax Lawyer",
            "naturalLanguage": "Seasoned attorney with a JD from a top U.S. law school and over three years of legal practice, specializing in corporate tax structuring and compliance.",
            "hardCriteria": [
                "JD degree from an accredited U.S. law school",
                "3+ years of experience practicing law"
            ],
            "softCriteria": [
                "Experience advising clients on tax implications of corporate or financial transactions",
                "Experience handling IRS audits, disputes, or regulatory inquiries",
                "Experience drafting legal opinions or filings related to federal and state tax compliance"
            ],
            "configPath": "tax_lawyer.yml"
        },
        "config": {
            "useSemanticSearch": True,
            "useHardFiltering": False,
            "softCriteriaWeight": 0.7,
            "maxResults": 10,
            "threshold": 0.01
        }
    }
    
    try:
        search_response = requests.post(f"{API_BASE}/search", json=search_payload, timeout=30)
        search_response.raise_for_status()
        search_results = search_response.json()
        
        print(f"✅ Found {len(search_results)} candidates")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Search failed: {e}")
        return
    
    # Step 2: Extract candidate IDs
    print("2. Extracting candidate IDs...")
    
    candidate_ids = []
    for result in search_results[:5]:  # Use top 5 candidates
        if 'profile' in result and '_id' in result['profile']:
            candidate_ids.append(result['profile']['_id'])
    
    if not candidate_ids:
        print("❌ No candidate IDs found")
        return
    
    print(f"✅ Extracted {len(candidate_ids)} candidate IDs")
    print(f"Sample IDs: {candidate_ids[:3]}")
    
    # Step 3: Evaluate candidates
    print("3. Evaluating candidates...")
    
    eval_payload = {
        "configPath": "tax_lawyer.yml",
        "candidateIds": candidate_ids
    }
    
    try:
        eval_response = requests.post(f"{API_BASE}/evaluate", json=eval_payload, timeout=60)
        eval_response.raise_for_status()
        eval_result = eval_response.json()
        
        print("✅ Evaluation successful!")
        
        # Step 4: Print the overallScore
        overall_score = eval_result.get('average_final_score', 'N/A')
        print(f"\n🎯 Overall Score: {overall_score}")
        
        # Display additional details
        print(f"\n📊 Evaluation Details:")
        print(f"  - Candidates evaluated: {len(candidate_ids)}")
        print(f"  - Config path: tax_lawyer.yml")
        print(f"  - Email used: {EMAIL}")
        
        # Display full response for debugging
        print(f"\n📄 Full evaluation response:")
        print(json.dumps(eval_result, indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Evaluation failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    test_evaluation() 