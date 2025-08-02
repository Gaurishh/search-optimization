#!/usr/bin/env python3
"""
Mercor Search Engineer - Retrieval Logic Test

This script demonstrates:
1. How to call the search API with different queries
2. How to extract candidate IDs from search results
3. How to call the evaluation API
4. How to parse and display the overallScore

This serves as both a test and an example of the retrieval logic.
"""

import requests
import json
import time
import os
from typing import List, Dict, Any

class MercorRetrievalTest:
    def __init__(self, api_base: str = "http://localhost:3001/api", email: str = None):
        self.api_base = api_base
        self.email = email or os.getenv('MERCOR_EMAIL', 'your_email@example.com')
        
    def search_candidates(self, query: Dict[str, Any], config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Search for candidates using the retrieval API
        
        Args:
            query: Query object with criteria
            config: Search configuration
            
        Returns:
            List of search results with profiles and scores
        """
        payload = {
            "query": query,
            "config": config
        }
        
        try:
            response = requests.post(f"{self.api_base}/search", json=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ Search failed: {e}")
            return []
    
    def extract_candidate_ids(self, search_results: List[Dict[str, Any]], max_candidates: int = 10) -> List[str]:
        """
        Extract candidate IDs from search results
        
        Args:
            search_results: Results from search_candidates
            max_candidates: Maximum number of candidates to extract
            
        Returns:
            List of candidate IDs
        """
        candidate_ids = []
        for result in search_results[:max_candidates]:
            if 'profile' in result and '_id' in result['profile']:
                candidate_ids.append(result['profile']['_id'])
        
        return candidate_ids
    
    def evaluate_candidates(self, config_path: str, candidate_ids: List[str]) -> Dict[str, Any]:
        """
        Evaluate candidates using the evaluation API
        
        Args:
            config_path: Configuration file path (e.g., "tax_lawyer.yml")
            candidate_ids: List of candidate IDs to evaluate
            
        Returns:
            Evaluation results
        """
        payload = {
            "configPath": config_path,
            "candidateIds": candidate_ids
        }
        
        try:
            response = requests.post(f"{self.api_base}/evaluate", json=payload, timeout=60)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ Evaluation failed: {e}")
            return {}
    
    def test_query(self, query_name: str, query: Dict[str, Any], config: Dict[str, Any]):
        """
        Test a complete search and evaluation pipeline for a query
        
        Args:
            query_name: Name of the query for display
            query: Query object
            config: Search configuration
        """
        print(f"\n🔍 Testing Query: {query_name}")
        print("=" * 50)
        
        # Step 1: Search for candidates
        print("1. Searching for candidates...")
        search_results = self.search_candidates(query, config)
        
        if not search_results:
            print("❌ No search results found")
            return None
        
        print(f"✅ Found {len(search_results)} candidates")
        
        # Display top 3 results
        print("\nTop 3 candidates:")
        for i, result in enumerate(search_results[:3], 1):
            profile = result['profile']
            score = result.get('score', 0)
            print(f"  {i}. {profile.get('name', 'Unknown')} (Score: {score:.2f})")
        
        # Step 2: Extract candidate IDs
        print("\n2. Extracting candidate IDs...")
        candidate_ids = self.extract_candidate_ids(search_results, max_candidates=10)
        
        if not candidate_ids:
            print("❌ No candidate IDs found")
            return None
        
        print(f"✅ Extracted {len(candidate_ids)} candidate IDs")
        print(f"Sample IDs: {candidate_ids[:3]}")
        
        # Step 3: Evaluate candidates
        print(f"\n3. Evaluating candidates with {query['configPath']}...")
        evaluation_result = self.evaluate_candidates(query['configPath'], candidate_ids)
        
        if not evaluation_result:
            print("❌ Evaluation failed")
            return None
        
        # Step 4: Display results
        print("✅ Evaluation successful!")
        overall_score = evaluation_result.get('average_final_score', 'N/A')
        print(f"Overall Score: {overall_score}")
        
        # Display full response for debugging
        print(f"\nFull evaluation response:")
        print(json.dumps(evaluation_result, indent=2))
        
        return {
            'query_name': query_name,
            'candidates_found': len(search_results),
            'candidates_evaluated': len(candidate_ids),
            'overall_score': overall_score,
            'evaluation_result': evaluation_result
        }

def main():
    """Main test function"""
    print("🚀 Mercor Search Engineer - Retrieval Logic Test")
    print("=" * 60)
    
    # Initialize test client
    test_client = MercorRetrievalTest()
    
    # Test configuration
    test_config = {
        "useSemanticSearch": True,
        "useHardFiltering": False,
        "softCriteriaWeight": 0.7,
        "maxResults": 100,
        "threshold": 0.01
    }
    
    # Test queries
    test_queries = [
        {
            "name": "Tax Lawyer",
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
            }
        },
        {
            "name": "Junior Corporate Lawyer",
            "query": {
                "id": "junior_corporate_lawyer",
                "name": "Junior Corporate Laywer",
                "naturalLanguage": "Corporate lawyer with two years of experience at a top-tier international law firm, specializing in M&A support and cross-border contract negotiations.",
                "hardCriteria": [
                    "2-4 years of experience as a Corporate Lawyer at a leading law firm in the USA, Europe, or Canada, or in-house at a major global organization",
                    "Graduate of a reputed law school in the USA, Europe, or Canada"
                ],
                "softCriteria": [
                    "Experience supporting Corporate M&A transactions, including due diligence and legal documentation",
                    "Experience drafting and negotiating legal contracts or commercial agreements",
                    "Familiarity with international business law or advising on regulatory requirements across jurisdictions"
                ],
                "configPath": "junior_corporate_lawyer.yml"
            }
        },
        {
            "name": "Radiology",
            "query": {
                "id": "radiology",
                "name": "Radiology",
                "naturalLanguage": "Radiologist with an MD from India and several years of experience reading CT and MRI scans.",
                "hardCriteria": [
                    "MD degree from a medical school in the U.S. or India"
                ],
                "softCriteria": [
                    "Board certification in Radiology (ABR, FRCR, or equivalent) or comparable credential",
                    "3+ years of experience interpreting X-ray, CT, MRI, ultrasound, or nuclear medicine studies",
                    "Expertise in radiology reporting, diagnostic protocols, differential diagnosis, or AI applications in medical imaging"
                ],
                "configPath": "radiology.yml"
            }
        }
    ]
    
    # Run tests
    results = []
    for test_query in test_queries:
        try:
            result = test_client.test_query(
                test_query["name"],
                test_query["query"],
                test_config
            )
            if result:
                results.append(result)
            
            # Add delay between tests to avoid overwhelming the API
            time.sleep(2)
            
        except Exception as e:
            print(f"❌ Test failed for {test_query['name']}: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    if results:
        print(f"✅ Successfully tested {len(results)} queries")
        for result in results:
            print(f"\n{result['query_name']}:")
            print(f"  - Candidates found: {result['candidates_found']}")
            print(f"  - Candidates evaluated: {result['candidates_evaluated']}")
            print(f"  - Overall score: {result['overall_score']}")
    else:
        print("❌ No tests completed successfully")
    
    print("\n🎉 Test complete!")

if __name__ == "__main__":
    main() 