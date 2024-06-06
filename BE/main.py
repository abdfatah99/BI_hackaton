from API import app
import uvicorn

# for debugging with breakpoint in vscode
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)