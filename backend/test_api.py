import httpx
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_all():
    print("🧪 Running StudyMate AI Backend API Test Suite...\n")
    
    with httpx.Client(base_url=BASE_URL, timeout=15.0) as client:
        # 1. Health Check
        r = client.get("/health")
        print(f"1. Health Check: {r.status_code} -> {r.json()}")
        assert r.status_code == 200, "Health check failed"

        # 2. Login
        login_payload = {
            "email": "alex.rivera@university.edu",
            "password": "password123"
        }
        r = client.post("/auth/login", json=login_payload)
        print(f"2. Auth Login: {r.status_code}")
        assert r.status_code == 200, f"Login failed: {r.text}"
        data = r.json()
        token = data["token"]
        user = data["user"]
        print(f"   Logged in as: {user['name']} ({user['email']})")

        headers = {"Authorization": f"Bearer {token}"}

        # 3. Get Me
        r = client.get("/auth/me", headers=headers)
        print(f"3. Auth Me: {r.status_code} -> {r.json()['name']}")
        assert r.status_code == 200

        # 4. Get Notes
        r = client.get("/notes", headers=headers)
        notes = r.json()
        print(f"4. Get Notes: {r.status_code} -> Found {len(notes)} notes")
        assert r.status_code == 200

        # 5. Create Note
        new_note_payload = {
            "title": "Algorithms: Graph Traversal BFS & DFS",
            "subject": "Computer Science",
            "tags": ["Graph", "BFS", "DFS"],
            "content": "# Graph Traversals\n\nBFS uses a Queue while DFS uses a Stack/Recursion."
        }
        r = client.post("/notes", json=new_note_payload, headers=headers)
        print(f"5. Create Note: {r.status_code} -> Created ID: {r.json()['id']}")
        assert r.status_code == 200

        # 6. Get Quizzes
        r = client.get("/quizzes", headers=headers)
        quizzes = r.json()
        print(f"6. Get Quizzes: {r.status_code} -> Found {len(quizzes)} quizzes")
        assert r.status_code == 200

        # 7. Submit Quiz Result
        result_payload = {
            "quizId": quizzes[0]["id"] if quizzes else None,
            "quizTitle": "Java OOP Test Run",
            "subject": "Computer Science",
            "topic": "OOP",
            "score": 90,
            "correctCount": 4,
            "totalQuestions": 5,
            "userAnswers": {"0": 1, "1": 1}
        }
        r = client.post("/quizzes/results", json=result_payload, headers=headers)
        print(f"7. Save Quiz Result: {r.status_code} -> Score: {r.json()['score']}%")
        assert r.status_code == 200

        # 8. Get Flashcards
        r = client.get("/flashcards", headers=headers)
        decks = r.json()
        print(f"8. Get Flashcards: {r.status_code} -> Found {len(decks)} decks")
        assert r.status_code == 200

        # 9. Get Study Plans
        r = client.get("/study-plans", headers=headers)
        plans = r.json()
        print(f"9. Get Study Plans: {r.status_code} -> Found {len(plans)} plans")
        assert r.status_code == 200

        # 10. AI Chat
        ai_chat_payload = {
            "message": "Can you explain Polymorphism simply with an analogy?",
            "context": {"tutorPersona": "Simple Words"}
        }
        r = client.post("/ai/chat", json=ai_chat_payload, headers=headers)
        print(f"10. AI Chat: {r.status_code} -> Reply length: {len(r.json()['reply'])} chars")
        assert r.status_code == 200

        # 11. AI Summarize
        ai_sum_payload = {
            "content": "Operating systems manage hardware resources through scheduling and virtual memory.",
            "mode": "all"
        }
        r = client.post("/ai/summarize", json=ai_sum_payload, headers=headers)
        print(f"11. AI Summarize: {r.status_code} -> Key points count: {len(r.json()['keyPoints'])}")
        assert r.status_code == 200

        # 12. AI Quiz Generator
        ai_quiz_payload = {
            "subject": "Computer Science",
            "topic": "Process Scheduling",
            "difficulty": "Medium",
            "questionCount": 3
        }
        r = client.post("/ai/quiz", json=ai_quiz_payload, headers=headers)
        print(f"12. AI Quiz Generator: {r.status_code} -> Questions generated: {len(r.json()['questions'])}")
        assert r.status_code == 200

        # 13. Progress Analytics
        r = client.get("/progress", headers=headers)
        progress = r.json()
        print(f"13. Progress Analytics: {r.status_code} -> Quiz Avg: {progress['quizAverage']}%, Streak: {progress['streak']} days")
        assert r.status_code == 200

    print("\n✅ All 13 Backend API Endpoints Passed Successfully!")

if __name__ == "__main__":
    test_all()
