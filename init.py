#!/usr/bin/env python3
"""
Mercor Search Engineer - Setup Script (init.py)

This script handles:
- Data loading and validation
- Environment setup
- Database connection testing
- Sample data generation for testing

Usage:
    python init.py [--validate] [--sample] [--test-evaluation]
"""

import os
import sys
import json
import argparse
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MercorSetup:
    def __init__(self):
        self.mongo_uri = os.getenv('MONGO_URI')
        self.mercor_email = os.getenv('MERCOR_EMAIL')
        self.api_base_url = 'http://localhost:3001/api'
        
    def validate_environment(self):
        """Validate environment configuration"""
        print("🔧 Validating environment configuration...")
        
        missing_vars = []
        if not self.mongo_uri:
            missing_vars.append('MONGO_URI')
        if not self.mercor_email:
            missing_vars.append('MERCOR_EMAIL')
            
        if missing_vars:
            print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
            print("Please update your .env file with the required credentials.")
            return False
            
        print("✅ Environment configuration validated.")
        return True
    
    def test_database_connection(self):
        """Test MongoDB connection via the API"""
        print("📊 Testing database connection...")
        
        try:
            response = requests.get(f"{self.api_base_url}/profiles/count", timeout=10)
            if response.status_code == 200:
                data = response.json()
                count = data.get('count', 0)
                print(f"✅ Database connected. Found {count:,} profiles.")
                return True
            else:
                print(f"❌ Database connection failed: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Database connection failed: {e}")
            return False
    
    def get_sample_profiles(self, limit=5):
        """Get sample profiles for testing"""
        print(f"📋 Loading {limit} sample profiles...")
        
        try:
            response = requests.get(f"{self.api_base_url}/profiles/sample?limit={limit}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                profiles = data.get('profiles', [])
                print(f"✅ Loaded {len(profiles)} sample profiles.")
                
                # Display sample profile IDs
                profile_ids = [profile['_id'] for profile in profiles]
                print("Sample profile IDs:")
                for i, pid in enumerate(profile_ids, 1):
                    print(f"  {i}. {pid}")
                    
                return profile_ids
            else:
                print(f"❌ Failed to load sample profiles: {response.status_code}")
                return []
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to load sample profiles: {e}")
            return []
    
    def test_evaluation_api(self, config_path="tax_lawyer.yml", profile_ids=None):
        """Test the evaluation API with sample data"""
        print(f"🧪 Testing evaluation API with {config_path}...")
        
        if not profile_ids:
            profile_ids = self.get_sample_profiles(3)
            if not profile_ids:
                print("❌ No profile IDs available for testing.")
                return False
        
        # Use only first 3 IDs for testing
        test_ids = profile_ids[:3]
        
        payload = {
            "config_path": config_path,
            "object_ids": test_ids
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.mercor_email
        }
        
        try:
            response = requests.post(
                f"{self.api_base_url}/evaluate",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Evaluation API test successful!")
                print(f"Response: {json.dumps(data, indent=2)}")
                return True
            else:
                print(f"❌ Evaluation API test failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Evaluation API test failed: {e}")
            return False
    
    def generate_test_script(self):
        """Generate a test script for the evaluation API"""
        print("📝 Generating test script...")
        
        script_content = '''#!/usr/bin/env python3
"""
Test script for Mercor Search Engineer Evaluation API

This script demonstrates how to:
1. Call the search API
2. Extract candidate IDs
3. Call the evaluation API
4. Parse and display results
"""

import requests
import json

# Configuration
API_BASE = "http://localhost:3001/api"
EMAIL = os.getenv('MERCOR_EMAIL', 'your_email_here')  # Use environment variable

def test_search_and_evaluate():
    """Test the complete search and evaluation pipeline"""
    
    # Step 1: Search for candidates
    search_payload = {
        "query": {
            "id": "tax_lawyer",
            "name": "Tax Lawyer",
            "naturalLanguage": "Seasoned attorney with a JD from a top U.S. law school...",
            "hardCriteria": ["JD degree from an accredited U.S. law school", "3+ years of experience practicing law"],
            "softCriteria": ["Experience advising clients on tax implications...", "Experience handling IRS audits..."],
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
    
    print("🔍 Searching for candidates...")
    search_response = requests.post(f"{API_BASE}/search", json=search_payload)
    
    if search_response.status_code != 200:
        print(f"❌ Search failed: {search_response.status_code}")
        return
    
    search_results = search_response.json()
    print(f"✅ Found {len(search_results)} candidates")
    
    # Step 2: Extract candidate IDs
    candidate_ids = [result['profile']['_id'] for result in search_results[:5]]
    print(f"📋 Using top 5 candidates: {candidate_ids}")
    
    # Step 3: Evaluate candidates
    eval_payload = {
        "configPath": "tax_lawyer.yml",
        "candidateIds": candidate_ids
    }
    
    print("🧪 Evaluating candidates...")
    eval_response = requests.post(f"{API_BASE}/evaluate", json=eval_payload)
    
    if eval_response.status_code == 200:
        eval_result = eval_response.json()
        print("✅ Evaluation successful!")
        print(f"Overall Score: {eval_result.get('average_final_score', 'N/A')}")
        print(f"Full Response: {json.dumps(eval_result, indent=2)}")
    else:
        print(f"❌ Evaluation failed: {eval_response.status_code}")
        print(f"Response: {eval_response.text}")

if __name__ == "__main__":
    test_search_and_evaluate()
'''
        
        with open('test_evaluation.py', 'w') as f:
            f.write(script_content)
        
        print("✅ Generated test_evaluation.py")
        print("   Run with: python test_evaluation.py")
    
    def run_setup(self, validate_only=False, test_evaluation=False):
        """Run the complete setup process"""
        print("🚀 Starting Mercor Search Engineer Setup...\n")
        
        # Step 1: Validate environment
        if not self.validate_environment():
            return False
        
        if validate_only:
            print("\n✅ Environment validation complete.")
            return True
        
        # Step 2: Test database connection
        if not self.test_database_connection():
            print("\n❌ Setup failed: Database connection failed.")
            return False
        
        # Step 3: Get sample profiles
        sample_ids = self.get_sample_profiles(5)
        if not sample_ids:
            print("\n❌ Setup failed: Could not load sample profiles.")
            return False
        
        # Step 4: Test evaluation API (optional)
        if test_evaluation:
            if not self.test_evaluation_api(profile_ids=sample_ids):
                print("\n⚠️  Evaluation API test failed, but setup can continue.")
        
        # Step 5: Generate test script
        self.generate_test_script()
        
        print("\n🎉 Setup complete!")
        print("\n📖 Next steps:")
        print("   1. Start the server: npm run server")
        print("   2. Open http://localhost:3001")
        print("   3. Test the evaluation: python test_evaluation.py")
        print("   4. Run searches and evaluations through the web interface")
        
        return True

def main():
    parser = argparse.ArgumentParser(description='Mercor Search Engineer Setup Script')
    parser.add_argument('--validate', action='store_true', help='Only validate environment')
    parser.add_argument('--test-evaluation', action='store_true', help='Test evaluation API')
    
    args = parser.parse_args()
    
    setup = MercorSetup()
    success = setup.run_setup(
        validate_only=args.validate,
        test_evaluation=args.test_evaluation
    )
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 