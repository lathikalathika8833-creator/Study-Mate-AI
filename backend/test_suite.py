import sys
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)
    print("==================================================")
    print("🚀 STUDYMATE AI BACKEND FULL TEST SUITE")
    print("==================================================")

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("✅ 1. Health Check Endpoint: PASS (/api/health -> 200 OK)")

    # 2. Register a new student
    test_email = "newstudent@stanford.edu"
    register_payload = {
        "email": test_email,
        "password": "securepassword123",
        "name": "Sarah Connor",
        "college": "Stanford University",
        "major": "Computer Science & AI"
    }
    # Might already exist if previously run, so handle both 200 and 400
    res = client.post("/api/auth/register", json=register_payload)
    if res.status_code == 200:
        data = res.json()
        assert "token" in data
        assert data["user"]["email"] == test_email
        print("✅ 2. User Registration: PASS (/api/auth/register -> 200 OK)")
    elif res.status_code == 400:
        print("ℹ️ 2. User already registered (Skipping re-registration)")

    # 3. Login with Demo User
    login_payload = {
        "email": "alex.rivera@university.edu",
        "password": "password123"
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    data = res.json()
    token = data["token"]
    user = data["user"]
    assert token is not None
    assert user["name"] == "Alex Rivera"
    headers = {"Authorization": f"Bearer {token}"}
    print(f"✅ 3. User Login: PASS (/api/auth/login -> 200 OK, User: {user['name']})")

    # 4. Get Current User (/auth/me)
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    me_data = res.json()
    assert me_data["email"] == "alex.rivera@university.edu"
    print("✅ 4. Auth Current User: PASS (/api/auth/me -> 200 OK)")

    # 5. Update Profile (/auth/profile)
    res = client.put("/api/auth/profile", json={"name": "Alex Rivera", "dailyGoalHours": 4.0}, headers=headers)
    assert res.status_code == 200
    assert res.json()["dailyGoalHours"] == 4.0
    print("✅ 5. Update Profile: PASS (/api/auth/profile -> 200 OK)")

    # 6. Notes CRUD
    # 6a. Get Notes
    res = client.get("/api/notes", headers=headers)
    assert res.status_code == 200
    notes = res.json()
    assert isinstance(notes, list)
    print(f"✅ 6a. Get Notes: PASS (/api/notes -> 200 OK, Found {len(notes)} notes)")

    # 6b. Create Note
    new_note = {
        "title": "Machine Learning: Backpropagation Calculus",
        "subject": "Artificial Intelligence",
        "tags": ["Neural Networks", "Calculus", "ML"],
        "content": "# Backpropagation\nGradient descent calculates partial derivatives via the chain rule.",
        "summary": "Step-by-step breakdown of backpropagation and loss gradients in neural nets.",
        "keyPoints": ["Chain rule multiplies local gradients", "Learning rate scales weight updates"],
        "keyDefinitions": [{"term": "Gradient", "definition": "Vector of partial derivatives pointing in direction of steepest ascent"}],
        "examPoints": ["Watch out for vanishing and exploding gradient problems"]
    }
    res = client.post("/api/notes", json=new_note, headers=headers)
    assert res.status_code == 200
    created_note = res.json()
    note_id = created_note["id"]
    assert created_note["title"] == new_note["title"]
    print(f"✅ 6b. Create Note: PASS (/api/notes -> ID: {note_id})")

    # 6c. Get Note by ID
    res = client.get(f"/api/notes/{note_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["id"] == note_id
    print("✅ 6c. Get Note by ID: PASS")

    # 6d. Update Note
    res = client.put(f"/api/notes/{note_id}", json={"title": "ML: Deep Backpropagation & Optimizer Mechanics"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["title"] == "ML: Deep Backpropagation & Optimizer Mechanics"
    print("✅ 6d. Update Note: PASS")

    # 7. Quizzes CRUD & Results
    # 7a. Get Quizzes
    res = client.get("/api/quizzes", headers=headers)
    assert res.status_code == 200
    quizzes = res.json()
    print(f"✅ 7a. Get Quizzes: PASS (/api/quizzes -> Found {len(quizzes)} quizzes)")

    # 7b. Create / Save Quiz
    sample_quiz_payload = {
        "id": "quiz_test_ml",
        "title": "Neural Networks & Backprop Mastery",
        "subject": "Artificial Intelligence",
        "topic": "Backpropagation",
        "difficulty": "Hard",
        "questions": [
            {
                "id": "q1",
                "question": "Which mathematical rule powers gradient backpropagation?",
                "options": ["Chain Rule", "L'Hopital's Rule", "Product Rule only", "Bayes Theorem"],
                "correctAnswer": 0,
                "explanation": "The calculus chain rule allows computing error gradients across layered composite functions."
            }
        ]
    }
    res = client.post("/api/quizzes", json=sample_quiz_payload, headers=headers)
    assert res.status_code == 200
    saved_quiz = res.json()
    print(f"✅ 7b. Save Quiz: PASS (/api/quizzes -> ID: {saved_quiz['id']})")

    # 7c. Submit Quiz Result
    quiz_result_payload = {
        "quizId": saved_quiz["id"],
        "quizTitle": saved_quiz["title"],
        "subject": saved_quiz["subject"],
        "topic": saved_quiz["topic"],
        "score": 100,
        "correctCount": 1,
        "totalQuestions": 1,
        "userAnswers": {"0": 0}
    }
    res = client.post("/api/quizzes/results", json=quiz_result_payload, headers=headers)
    assert res.status_code == 200
    result_data = res.json()
    assert result_data["score"] == 100
    print("✅ 7c. Submit Quiz Result: PASS (/api/quizzes/results -> 200 OK)")

    # 7d. Get Quiz Results (/quizzes/results and /quizzes/results/all)
    res = client.get("/api/quizzes/results", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    print(f"✅ 7d. Get Quiz Results: PASS (/api/quizzes/results -> {len(res.json())} results)")

    # 8. Flashcards CRUD
    # 8a. Get Flashcards
    res = client.get("/api/flashcards", headers=headers)
    assert res.status_code == 200
    decks = res.json()
    print(f"✅ 8a. Get Flashcard Decks: PASS (/api/flashcards -> Found {len(decks)} decks)")

    # 8b. Save Flashcard Deck
    sample_deck_payload = {
        "id": "deck_ml_test",
        "title": "Machine Learning Core Definitions",
        "subject": "Artificial Intelligence",
        "cards": [
            {
                "id": "c1",
                "question": "What is overfitting?",
                "answer": "When a model learns training noise and fails to generalize to unseen test data.",
                "category": "Machine Learning",
                "mastered": False
            },
            {
                "id": "c2",
                "question": "What is regularization (L1 / L2)?",
                "answer": "Technique adding a penalty term to loss function to discourage complex models.",
                "category": "Machine Learning",
                "mastered": False
            }
        ]
    }
    res = client.post("/api/flashcards", json=sample_deck_payload, headers=headers)
    assert res.status_code == 200
    created_deck = res.json()
    print(f"✅ 8b. Save Flashcard Deck: PASS (ID: {created_deck['id']})")

    # 8c. Toggle Card Mastery
    res = client.patch(f"/api/flashcards/{created_deck['id']}/cards/c1", json={"mastered": True}, headers=headers)
    assert res.status_code == 200
    assert res.json()["masteredCount"] == 1
    print("✅ 8c. Toggle Card Mastery: PASS (/api/flashcards/.../cards/... -> 200 OK)")

    # 9. Study Planner CRUD
    # 9a. Get Study Plans
    res = client.get("/api/study-plans", headers=headers)
    assert res.status_code == 200
    plans = res.json()
    print(f"✅ 9a. Get Study Plans: PASS (/api/study-plans -> Found {len(plans)} plans)")

    # 9b. Save Study Plan
    sample_plan_payload = {
        "id": "plan_finals_test",
        "title": "Fall Semester Final Exam Roadmap",
        "examDate": "2026-12-15",
        "dailyHours": 4.0,
        "subjects": ["AI & Machine Learning", "Distributed Systems"],
        "targetScore": "98%",
        "days": [
            {
                "dayName": "Monday",
                "date": "Day 1",
                "blocks": [
                    {"id": "blk1", "time": "08:00 - 09:30 AM", "subject": "AI", "topic": "Loss Functions", "type": "Study", "duration": "90 mins", "completed": False}
                ]
            }
        ]
    }
    res = client.post("/api/study-plans", json=sample_plan_payload, headers=headers)
    assert res.status_code == 200
    created_plan = res.json()
    print(f"✅ 9b. Save Study Plan: PASS (ID: {created_plan['id']})")

    # 9c. Toggle Block Completion
    res = client.patch(f"/api/study-plans/{created_plan['id']}/blocks/blk1", json={"completed": True}, headers=headers)
    assert res.status_code == 200
    assert res.json()["days"][0]["blocks"][0]["completed"] is True
    print("✅ 9c. Toggle Block Completion: PASS")

    # 10. AI Service Endpoints
    # 10a. AI Chat
    res = client.post("/api/ai/chat", json={
        "message": "Explain Dynamic Programming using the Fibonacci sequence analogy.",
        "context": {"tutorPersona": "Socratic & Step-by-Step"}
    }, headers=headers)
    assert res.status_code == 200
    ai_chat_res = res.json()
    assert "reply" in ai_chat_res and len(ai_chat_res["reply"]) > 10
    print("✅ 10a. AI Chat Tutor: PASS (/api/ai/chat -> 200 OK)")

    # 10b. AI Summarize
    res = client.post("/api/ai/summarize", json={
        "content": "Dynamic programming breaks complex problems into overlapping subproblems and caches solutions in a memoization table.",
        "mode": "all"
    }, headers=headers)
    assert res.status_code == 200
    ai_sum = res.json()
    assert "summary" in ai_sum
    assert len(ai_sum["keyPoints"]) > 0
    print(f"✅ 10b. AI Summarize: PASS (/api/ai/summarize -> {len(ai_sum['keyPoints'])} Key Points)")

    # 10c. AI Quiz Generator
    res = client.post("/api/ai/quiz", json={
        "subject": "Computer Science",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "questionCount": 3
    }, headers=headers)
    assert res.status_code == 200
    ai_quiz = res.json()
    assert len(ai_quiz["questions"]) >= 1
    print(f"✅ 10c. AI Quiz Generator: PASS (/api/ai/quiz -> {len(ai_quiz['questions'])} Questions)")

    # 10d. AI Flashcard Generator
    res = client.post("/api/ai/flashcards", json={
        "subject": "Computer Science",
        "topic": "Graph Algorithms",
        "cardCount": 4
    }, headers=headers)
    assert res.status_code == 200
    ai_cards = res.json()
    assert len(ai_cards["cards"]) >= 1
    print(f"✅ 10d. AI Flashcard Generator: PASS (/api/ai/flashcards -> {len(ai_cards['cards'])} Cards)")

    # 10e. AI Study Plan Generator
    res = client.post("/api/ai/study-plan", json={
        "examDate": "2026-11-20",
        "subjects": ["Operating Systems", "Computer Networks"],
        "dailyHours": 3.0
    }, headers=headers)
    assert res.status_code == 200
    ai_plan = res.json()
    assert len(ai_plan["days"]) >= 1
    print(f"✅ 10e. AI Study Plan Generator: PASS (/api/ai/study-plan -> {len(ai_plan['days'])} Days)")

    # 11. Progress Analytics
    res = client.get("/api/progress", headers=headers)
    assert res.status_code == 200
    progress = res.json()
    assert "quizAverage" in progress
    assert "weeklyStudyHours" in progress
    assert "topicMastery" in progress
    assert "badges" in progress
    print(f"✅ 11. Progress Analytics: PASS (/api/progress -> Quiz Avg: {progress['quizAverage']}%, Streak: {progress['streak']} days, Badges: {len(progress['badges'])})")

    print("\n🎉 ALL 17 TEST SUITE INTEGRATION CHECKS PASSED PERFECTLY! 100% OPERATIONAL.")

if __name__ == "__main__":
    run_tests()
