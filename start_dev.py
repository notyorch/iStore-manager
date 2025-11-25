import subprocess
import sys
import os
import time
import threading

def stream_output(process, prefix):
    try:
        for line in iter(process.stdout.readline, b''):
            print(f"[{prefix}] {line.decode('utf-8', errors='replace').strip()}")
    except Exception as e:
        print(f"[{prefix}] Error reading output: {e}")

def start_dev():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, 'backend')
    frontend_dir = os.path.join(root_dir, 'frontend')

    print("--- Starting Development Environment ---")

    # 1. Start Backend
    print("Starting Backend (Flask)...")
    backend_process = subprocess.Popen(
        [sys.executable, 'api.py'],
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )
    
    # Thread to print backend output
    t_backend = threading.Thread(target=stream_output, args=(backend_process, "BACKEND"))
    t_backend.daemon = True
    t_backend.start()

    # 2. Start Frontend
    print("Starting Frontend (Vite)...")
    # npm run dev
    frontend_cmd = 'npm run dev'
    if sys.platform == 'win32':
        frontend_process = subprocess.Popen(
            frontend_cmd,
            cwd=frontend_dir,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )
    else:
        frontend_process = subprocess.Popen(
            frontend_cmd.split(),
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )

    # Thread to print frontend output
    t_frontend = threading.Thread(target=stream_output, args=(frontend_process, "FRONTEND"))
    t_frontend.daemon = True
    t_frontend.start()

    print("Services started. Press Ctrl+C to stop.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend_process.terminate()
        # Kill frontend process tree (especially for Windows/npm)
        if sys.platform == 'win32':
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(frontend_process.pid)])
        else:
            frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    start_dev()
