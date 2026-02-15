import sqlite3
import os

db_path = os.path.join("..", "backend", "db.sqlite3")

def cleanup_duplicates():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Find duplicates
        cursor.execute("SELECT project_id, COUNT(*) FROM test_plan_kanbanboardconfig GROUP BY project_id HAVING COUNT(*) > 1")
        duplicates = cursor.fetchall()
        
        if not duplicates:
            print("No duplicates found.")
            return

        for project_id, count in duplicates:
            print(f"Project ID {project_id} has {count} entries. Cleaning up...")
            
            # Keep the one with the highest ID (or most recent)
            cursor.execute("SELECT id FROM test_plan_kanbanboardconfig WHERE project_id = ? ORDER BY id DESC LIMIT 1", (project_id,))
            keep_id = cursor.fetchone()[0]
            
            cursor.execute("DELETE FROM test_plan_kanbanboardconfig WHERE project_id = ? AND id != ?", (project_id, keep_id))
            print(f"Kept ID {keep_id} for Project {project_id}.")

        conn.commit()
        print("Cleanup successful.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    cleanup_duplicates()
